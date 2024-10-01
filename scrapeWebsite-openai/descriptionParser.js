import dotenv from 'dotenv';
import { OpenAI } from 'openai';
import fs from 'fs';
import csv from 'csv-parser';
import { createObjectCsvWriter } from 'csv-writer';

dotenv.config();

//process.env.OPENAI_API_KEY = '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';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  throw new Error("OpenAI API key not found in environment variables");
}

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

const getDescriptionPrompt = (title, groupName) => `
Generate a concise description for the following subject:
Title: ${title}
Group: ${groupName}
The description should be informative and highlight the key aspects of the subject within its group. Keep it under 200 characters.
`;

const generateDescription = async (title, groupName) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: getDescriptionPrompt(title, groupName) }],
      max_tokens: 100,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating description:', error);
    return '';
  }
};

const processCSV = async (inputFile, outputFile) => {
  const results = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(inputFile)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        for (const row of results) {
          if (row.title && row.group_name) {
            try {
              row.description = await generateDescription(row.title, row.group_name);
              console.log(`Generated description for ${row.title}: ${row.description}`);
            } catch (error) {
              console.error(`Failed to generate description for ${row.title}:`, error);
            }
          }
        }

        const csvWriter = createObjectCsvWriter({
          path: outputFile,
          header: Object.keys(results[0]).map(key => ({ id: key, title: key })),
        });

        try {
          await csvWriter.writeRecords(results);
          console.log('CSV file has been updated with descriptions.');
          resolve();
        } catch (error) {
          console.error('Error writing to CSV:', error);
          reject(error);
        }
      })
      .on('error', (error) => reject(error));
  });
};

processCSV('subject_rows-2.csv', 'output.csv')
  .then(() => console.log('CSV processing completed successfully'))
  .catch((error) => console.error('CSV processing failed:', error));