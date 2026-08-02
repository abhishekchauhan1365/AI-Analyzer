const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

exports.analyzeResume = async (resumeText, jobDescription) => {
  const prompt = `
  You are an expert ATS (Applicant Tracking System) and Senior Technical Recruiter.
  Please analyze the following Resume against the provided Job Description.

  Job Description:
  ${jobDescription}

  Resume:
  ${resumeText}

  Provide your analysis strictly in the following JSON format without any markdown wrappers (e.g. no \`\`\`json):
  {
    "atsScore": {
      "overall": 85,
      "skillsMatch": 80,
      "experienceMatch": 90,
      "educationMatch": 100,
      "projectMatch": 70
    },
    "matchedKeywords": ["React", "Node.js", "MongoDB"],
    "missingKeywords": {
      "programmingLanguages": ["Python", "Java"],
      "frameworks": ["Express", "Next.js"],
      "cloud": ["AWS", "Docker"],
      "databases": ["PostgreSQL"],
      "softSkills": ["Leadership", "Communication"],
      "tools": ["Git", "Jira"]
    },
    "aiSuggestions": {
      "overallReview": "A strong resume but lacks some cloud exposure...",
      "weakPoints": ["Limited cloud experience", "Missing soft skills keywords"],
      "strongPoints": ["Strong frontend foundation", "Good education"],
      "grammarImprovements": ["Change 'builded' to 'built'"],
      "formattingSuggestions": ["Use bullet points for experience"],
      "recommendedSkills": ["Learn AWS", "Learn Docker"]
    }
  }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    let textResponse = response.text;
    // Strip markdown formatting if Gemini included it
    if (textResponse.startsWith('\`\`\`json')) {
      textResponse = textResponse.replace(/^\`\`\`json\n/, '').replace(/\n\`\`\`$/, '');
    }
    
    return JSON.parse(textResponse);
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error('Failed to analyze resume with AI');
  }
};

exports.generateSummary = async (resumeText, jobDescription) => {
  const prompt = `
  Based on this resume and job description, write a professional 3-4 sentence resume summary tailored to the job.
  
  Job Description: ${jobDescription}
  Resume: ${resumeText}
  
  Return ONLY the summary text, nothing else.
  `;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text.trim();
  } catch (error) {
    throw new Error('Failed to generate summary');
  }
};

exports.generateCoverLetter = async (resumeText, jobDescription) => {
  const prompt = `
  Write a modern, professional, and personalized cover letter based on the following resume and job description.
  Keep it engaging, concise (around 3 paragraphs), and highlight the most relevant skills.
  
  Job Description: ${jobDescription}
  Resume: ${resumeText}
  
  Return ONLY the cover letter text, nothing else.
  `;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text.trim();
  } catch (error) {
    throw new Error('Failed to generate cover letter');
  }
};
