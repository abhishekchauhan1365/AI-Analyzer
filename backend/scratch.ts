import mongoose from 'mongoose';
import { config } from 'dotenv';
config();
mongoose.connect(process.env.MONGODB_URI as string).then(async () => {
  const db = mongoose.connection.useDb('test'); // default or ai_analyzer?
  const analyses = await mongoose.connection.collection('analyses').find({}).sort({createdAt: -1}).limit(1).toArray();
  console.log(analyses.map(a => ({ file: a.fileName, status: a.status, error: a.errorMessage })));
  process.exit(0);
});
