
const puppeteer = require('puppeteer');
const $ = require('cheerio');
const dayjs = require('dayjs'); // TODO: remove it
const fs = require('fs');
const { formatBooksData, getRandomPagesCount } = require('./utils');

const { urls = [], startIndex = 1 } = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));

const scrapData = async (page, url) => {
  await page.goto(url);
  await page.click('a#load-more-search-results');
  await page.waitFor(2000);
  await page.click('a#load-more-search-results');
  await page.waitFor(2000);
  await page.click('a#load-more-search-results');
  await page.waitFor(2000);
  const bookItemsHtml = await page.$$eval('.row.book-row', items => items.map(item => item.innerHTML));
  const data = bookItemsHtml.map(item => {
    const title = $('h2.search-result-title a', item).text().trim();
    const author = $('dt', item).eq(0).children().contents().toArray()[1].data;
    const [, date] = $('dt', item).eq(-2).text().split(': ');
    const formatedDate = dayjs(date).format('YYYY');
    const pagesCount = getRandomPagesCount();
    // TODO: add Publisher
    return { title, author, date: formatedDate, pagesCount, url };
  });
  return data;
}

(async () => {
  const browser = await puppeteer.launch();
  const promises = urls.map(async url => {
    const newPage = await browser.newPage();
    return scrapData(newPage, url);
  });
  try {
    const booksData = await Promise.all(promises);
    const formatedBooksData = formatBooksData(booksData, startIndex);

    fs.writeFile('reference-list.txt', formatedBooksData, e => {
      if (e) throw err;
      console.log('The file has been saved!');
    });
  } catch (e) {
    throw e;
  }
  browser.close();
})()
  .catch(e => { console.error('Catching...', e) });

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', reason.stack)
});

process.on('uncaughtException', e => {
  console.error('Something went wrong...', e);
  process.exit(1);
});
