const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs').promises;

const URL = 'https://www.careerlauncher.com/gmat/exam-syllabus/';
const OUTPUT_FILE = 'gmat_syllabus.json';

async function fetchSyllabus() {
  try {
    const { data } = await axios.get(URL);
    const $ = cheerio.load(data);

    const syllabus = {
      title: "GMAT Exam Syllabus",
      sections: []
    };

    //HTML content - debugging
    console.log('HTML Content:', $.html());

    const h2Elements = $('h2');
    console.log(`Found ${h2Elements.length} h2 elements`);

    h2Elements.each((index, h2) => {
      const sectionTitle = $(h2).text().trim();
      console.log(`Processing section: ${sectionTitle}`);

      const section = {
        title: sectionTitle,
        content: []
      };

      let currentElement = $(h2).next();
      while (currentElement.length && !currentElement.is('h2')) {
        if (currentElement.is('p')) {
          section.content.push(currentElement.text().trim());
        } else if (currentElement.is('ul')) {
          const listItems = currentElement.find('li').map((_, li) => $(li).text().trim()).get();
          section.content.push(listItems);
        }
        currentElement = currentElement.next();
      }

      console.log(`Section content length: ${section.content.length}`);
      syllabus.sections.push(section);
    });

    await fs.writeFile(OUTPUT_FILE, JSON.stringify(syllabus, null, 2));
    console.log(`Syllabus data has been saved to ${OUTPUT_FILE}`);
  } catch (error) {
    console.error('Error fetching or processing data:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    }
  }
}

fetchSyllabus();