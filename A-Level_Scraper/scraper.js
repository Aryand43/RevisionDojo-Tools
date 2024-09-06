const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const baseUrl = 'https://revisionworld.com/a2-level-level-revision';

function generateSlug(subject, topic, subtopic) {
    const slugify = (text) => {
        return text.toLowerCase()
                   .replace(/[^a-z0-9]+/g, '-')
                   .replace(/^-+|-+$/g, '')
                   .replace(/&/g, 'and')
                   .replace(/a-level|gcse/g, '');
    };

    const subjectSlug = slugify(subject);
    const topicSlug = slugify(topic);
    const subtopicSlug = slugify(subtopic);
    let slug = `a-level-${subjectSlug}`;
    if (topicSlug && topicSlug !== subjectSlug && !slug.includes(topicSlug)) {
        slug += `-${topicSlug}`;
    }
    if (subtopicSlug && subtopicSlug !== topicSlug && !slug.includes(subtopicSlug)) {
        slug += `-${subtopicSlug}`;
    }

    return slug.replace(/-+/g, '-').replace(/-$/g, '');
}

async function scrapeCategories() {
    try {
        const response = await axios.get(baseUrl);
        const $ = cheerio.load(response.data);
        const data = {};

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

async function scrapeTopicsAndSubtopics(data) {
    for (const subject in data) {
        for (const topic in data[subject].Topics) {
            const topicUrl = data[subject].Topics[topic];
            try {
                const response = await axios.get(topicUrl);
                const $ = cheerio.load(response.data);
                data[subject].Topics[topic] = {
                    url: topicUrl,
                    slug: generateSlug(subject, topic, '')
                };
                data[subject].Subtopics[topic] = [];
                $('div.block-revision-study-resources-section-child-links ul li a').each((i, subtopicElement) => {
                    const subtopicName = $(subtopicElement).text().trim();
                    if (subtopicName && subtopicName !== "DOWNLOAD Zone") {
                        data[subject].Subtopics[topic].push({
                            name: subtopicName,
                            slug: generateSlug(subject, topic, subtopicName)
                        });
                    }
                });

            } catch (error) {
                console.error(`Error scraping topic ${topic}:`, error);
            }
        }
    }
}

function filterDownloadZone(data) {
    for (const subject in data) {
        for (const topic in data[subject].Subtopics) {
            data[subject].Subtopics[topic] = data[subject].Subtopics[topic].filter(subtopic => 
                subtopic.name.toLowerCase() !== "download zone" && 
                subtopic.name.toLowerCase() !== "download"
            );
        }
    }
    return data;
}

async function main() {
    const data = await scrapeCategories();
    await scrapeTopicsAndSubtopics(data);
    const filteredData = filterDownloadZone(data);
    fs.writeFileSync('alevel_data.json', JSON.stringify(filteredData, null, 2));
    console.log('Data saved to alevel_data.json');
}

main();