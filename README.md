# RevisionDojo-Tools

## Overview

This repository contains foundational infrastructure developed to support educational content extraction, structuring, and management for online learning platforms.

The tools in this monorepo directly contributed to the early-stage backend operations of **RevisionDojo**, a platform that later became a **Y Combinator-backed company**.  
This work formed part of the technical foundation that supported RevisionDojo’s successful YC application and early operational scaling.

The primary focus is on high-efficiency web scraping, data cleaning, and structured JSON output for curriculum databases.

## Contents

- **Web Scraper**: Node.js-based scrapers that extract curriculum data from educational websites using Axios and Cheerio.
- **Data Structuring**: Functions to organize extracted syllabus data into structured JSON formats (curriculum names, subjects, subtopics).
- **Syllabus Automation**: Scripts to mass-scrape and standardize GMAT, A-Level, and OpenAI-hosted syllabi.

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Aryand43/RevisionDojo-Tools.git
   cd RevisionDojo-Tools
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

## Usage

- Run any scraper file manually to pull and clean the target curriculum data.
- Outputs structured `.json` files ready for ingestion into educational apps or content platforms.

## Technologies Used

- Node.js
- Axios (HTTP Requests)
- Cheerio (DOM Parsing)
- JavaScript (ES6+)

## License

This project is licensed under the MIT License.
