const { GoogleGenAI } = require('@google/genai');
const ai = new GoogleGenAI({ apiKey: '' });
ai.models.list().then(res => {
  for (const m of res) {
    if (m.name.includes('flash')) console.log(m.name);
  }
}).catch(console.error);
