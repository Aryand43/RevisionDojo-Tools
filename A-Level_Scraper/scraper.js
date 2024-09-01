const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const fs = require('fs');

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({ headless: false }); // Launch in non-headless mode to see the actions
  const page = await browser.newPage();
  
  console.log('Navigating to the target page...');
  await page.goto('https://revisionworld.com/a2-level-level-revision', { waitUntil: 'networkidle2' });

  console.log('Closing browser...');
  await browser.close();
  console.log('Browser closed.');
})();
