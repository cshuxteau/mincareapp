const { chromium } = require('playwright');

async function scrapeCNNHeadlines() {
  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  console.log('Navigating to CNN.com...');
  await page.goto('http://cnn.com', { waitUntil: 'networkidle' });

  console.log('Extracting headlines...\n');

  // CNN uses various selectors for headlines, let's try multiple approaches
  const headlines = await page.evaluate(() => {
    const headlineSet = new Set();

    // Common CNN headline selectors
    const selectors = [
      'h1', 'h2', 'h3',
      '[class*="headline"]',
      '[data-editable="headline"]',
      'a[class*="container__link"]',
      '.cd__headline',
      '.container__headline'
    ];

    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        const text = el.innerText.trim();
        // Filter out empty strings and very short text (likely not headlines)
        if (text && text.length > 20) {
          headlineSet.add(text);
        }
      });
    });

    return Array.from(headlineSet);
  });

  await browser.close();

  return headlines;
}

// Run the scraper
scrapeCNNHeadlines()
  .then(headlines => {
    console.log(`Found ${headlines.length} headlines:\n`);
    console.log('='.repeat(80));
    headlines.forEach((headline, index) => {
      console.log(`${index + 1}. ${headline}`);
      console.log('-'.repeat(80));
    });
  })
  .catch(error => {
    console.error('Error scraping CNN:', error);
    process.exit(1);
  });
