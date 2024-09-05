Code: Imports & Setup 

const axios = require('axios');
const cheerio = require ('cheerio');
const fs = require('fs'); 

const baseUrl = 'Your-URL-Link';

Purpose:

- Axios: HTTP Client for requests - fetch data - from web pages 
- Cheerio: Fast, flexible - used for Parsing HTML and traversing DOM (Document Object Model) in Node.js - 
Lean implementation for core jQuery. 
- fs: built-in Node.js module for file system operations, used to write scraped data into a file. 
- BaseURL: website to be scraped 

Code: Helper Function generateSlug(text)

function generateSlug(text){
    return text.toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, "");
}

Purpose: Converts a string to a URL-friendly "slug" format. Does this by: 
- Converting text to lowercase 
- replacing non-alphanumeric characters with hyphens 
- Remove leading or trailing hyphens. 

