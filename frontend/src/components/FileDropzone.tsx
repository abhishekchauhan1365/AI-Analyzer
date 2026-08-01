import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { AnimatePresence, motion } from 'framer-motion';
import { Upload, FileText } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

interface FileDropzoneProps {
  onFile: (file: File) => void;
  isUploading?: boolean;
  uploadProgress?: number;
}

const FileDropzone: React.FC<FileDropzoneProps> = ({ onFile, isUploading, uploadProgress = 0 }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');
  const [hovered, setHovered] = useState(false);

  const onDrop = useCallback(
    (accepted: File[]) => {
      setError('');
      const file = accepted[0];
      if (file) {
        setSelectedFile(file);
        onFile(file);
      }
    },
    [onFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected: (rejections) => {
      const msg = rejections[0]?.errors[0]?.message ?? 'Invalid file.';
      setError(msg);
    },
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
    disabled: isUploading,
  });

  const formatSize = (bytes: number) =>
    bytes < 1024 * 1024
      ? `${(bytes / 1024).toFixed(1)} KB`
      : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

  return (
    <div>
      {/* motion.div handles ONLY the visual scale — no getRootProps here */}
      <motion.div
        animate={{ scale: hovered && !isUploading ? 1.01 : 1 }}
        whileTap={!isUploading ? { scale: 0.99 } : {}}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      >
        {/* Plain div owns the dropzone interaction */}
        <div
          {...getRootProps()}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            border: `2px dashed ${
              isDragActive
                ? 'var(--color-primary)'
                : error
                ? 'var(--color-error)'
                : 'var(--color-border)'
            }`,
            borderRadius: 'var(--radius-xl)',
            padding: '48px 32px',
            textAlign: 'center',
            cursor: isUploading ? 'not-allowed' : 'pointer',
            background: isDragActive ? 'rgba(124,58,237,0.08)' : 'var(--color-bg-card)',
            transition: 'border-color var(--transition-base), background var(--transition-base)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <input {...getInputProps()} />

          <AnimatePresence mode="wait">
            {isUploading ? (
              <motion.div
                key="uploading"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}
              >
                <LoadingSpinner size={40} />
                <div>
                  <p style={{ fontWeight: 600, marginBottom: 4 }}>
                    {uploadProgress < 100 ? 'Uploading...' : 'Analyzing with AI...'}
                  </p>
                  <p className="text-muted" style={{ fontSize: '0.85rem' }}>
                    {uploadProgress < 100
                      ? `${uploadProgress}% uploaded`
                      : 'This takes about 10–30 seconds'}
                  </p>
                </div>
                {uploadProgress > 0 && (
                  <div className="progress-bar" style={{ width: 200 }}>
                    <div className="progress-bar-fill" style={{ width: `${uploadProgress}%` }} />
                  </div>
                )}
              </motion.div>
            ) : selectedFile ? (
              <motion.div
                key="selected"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 14,
                    background: 'rgba(16, 185, 129, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <FileText size={28} color="var(--color-success)" />
                </div>
                <div>
                  <p style={{ fontWeight: 600 }}>{selectedFile.name}</p>
                  <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: 4 }}>
                    {formatSize(selectedFile.size)} · Click or drag to replace
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}
              >
                <motion.div
                  animate={isDragActive ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 16,
                    background: isDragActive ? 'rgba(124,58,237,0.2)' : 'var(--color-bg-card)',
                    border: '1px solid var(--color-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Upload
                    size={28}
                    color={isDragActive ? 'var(--color-primary-light)' : 'var(--color-text-muted)'}
                  />
                </motion.div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: '1.05rem' }}>
                    {isDragActive ? 'Drop your resume here' : 'Drag & drop your resume'}
                  </p>
                  <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: 6 }}>
                    or{' '}
                    <span style={{ color: 'var(--color-primary-light)', fontWeight: 600 }}>
                      click to browse
                    </span>
                    &nbsp;· PDF only · Max 5MB
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {error && (
        <p className="error-message" style={{ marginTop: 8, textAlign: 'center' }}>
          ⚠ {error}
        </p>
      )}
    </div>
  );
};

export default FileDropzone;
