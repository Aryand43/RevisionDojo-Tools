const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const baseUrl = 'https://revisionworld.com/a2-level-level-revision';

// Function to scrape categories and topics
async function scrapeCategories() {
    try {
        const response = await axios.get(baseUrl);
        const $ = cheerio.load(response.data);
        const data = {};

        // Scrape subjects and their links
        $('#taxonomy-term-5006 > div > div > div > div.block.block-revision-study-resources.block-revision-study-resources-section-child-links > div > ul > li').each((i, element) => {
            const subject = $(element).find('a').text().trim();
            const subjectUrl = $(element).find('a').attr('href');
            if (subject && subjectUrl) {
                data[subject] = { Topics: {}, Subtopics: {} };
                data[subject].Topics[subject] = subjectUrl;
                data[subject].Subtopics[subject] = [];
            }
        });

        return data;

    } catch (error) {
        console.error('Error scraping categories:', error);
        return {};
    }
}

// Function to scrape topics and subtopics
async function scrapeTopicsAndSubtopics(data) {
    for (const subject in data) {
        for (const topic in data[subject].Topics) {
            const topicUrl = data[subject].Topics[topic];
            try {
                const response = await axios.get(topicUrl);
                const $ = cheerio.load(response.data);

                // General pattern to extract subtopics
                $('div.block-revision-study-resources-section-child-links ul li a').each((i, subtopicElement) => {
                    const subtopic = $(subtopicElement).text().trim();
                    if (subtopic) {
                        data[subject].Subtopics[topic].push(subtopic);
                    }
                });

            } catch (error) {
                console.error(`Error scraping topic ${topic}:`, error);
            }
        }
    }
}

// Main function to execute the scraping
async function main() {
    const data = await scrapeCategories();
    await scrapeTopicsAndSubtopics(data);

    // Save the data to a JSON file
    fs.writeFileSync('alevel_data.json', JSON.stringify(data, null, 2));
    console.log('Data saved to alevel_data.json');
}

main();