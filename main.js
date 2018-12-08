
const puppeteer = require('puppeteer')
const $ = require('cheerio')
const dayjs = require('dayjs');
const fs = require('fs');
const url = 'https://isbndb.com/search/books/insurance';
const url1 = 'https://isbndb.com/search/books/insurance';

const POSSIBLE_PAGES_COUNT = [215, 220, 230, 234, 265, 275, 305, 310, 325, 345, 375, 410, 420];

const getRandomPagesCount = () => POSSIBLE_PAGES_COUNT[Math.floor(Math.random() * POSSIBLE_PAGES_COUNT.length)]; 

// TODO: add parallel requests
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  await page.click('a#load-more-search-results');
  await page.click('a#load-more-search-results');
  await page.click('a#load-more-search-results');
  await page.waitFor(4000);

  try {
    const bookItemsHtml = await page.$$eval('.row.book-row', items => items.map(item => item.innerHTML));
    console.log('books count: ', bookItemsHtml.length);
    const res = bookItemsHtml.map(item => { 
      const title = $('h2.search-result-title a', item).text().trim();
      const author = $('dt', item).eq(0).children().contents().toArray()[1].data;
      const [, date] = $('dt', item).eq(-2).text().split(': ');
      const formatedDate = dayjs(date).format('YYYY');
      const pagesCount = getRandomPagesCount();
      return { title, author, date: formatedDate, pagesCount };
    });
    console.log(res);
  } catch (e) {
    console.log ('Error:', e);
    process.exit(1);
  }
  console.log('end of script');
  browser.close();
})();

