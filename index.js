const puppeteer = require('puppeteer');

async function run() {
  const browser = await puppeteer.launch({
    headless: false
  });

  const page = await browser.newPage();

  await page.goto('https://www.barnesandnoble.com/');

  // dom element selectors
  const BUTTON_SELECTOR = '#login > form > div.auth-form-body.mt-3 > input.btn.btn-primary.btn-block';
  const SEARCH_SELECTOR = '#searchBarBN';

  await page.click(SEARCH_SELECTOR);
  await page.keyboard.type("saramago");
  await page.keyboard.press('Enter');
  await page.waitForNavigation();

  const LIST_PRICE_SELECTOR = '#gridView > div > div:nth-child(INDEX) > div.product-shelf-info.product-info-view.text--left > div.product-shelf-pricing > div:nth-child(1) > a > span:nth-child(2)';
  
  const LENGTH_SELECTOR_CLASS = 'mt-l';

  let listLength = await page.evaluate((sel) => {
    return document.getElementsByClassName(sel).length;
  }, LENGTH_SELECTOR_CLASS);

  for (let i = 1; i <= 20; i++) {
    // change the index to the next child
    let priceSelector = LIST_PRICE_SELECTOR.replace("INDEX", i);

    let price = await page.evaluate((sel) => {
        let priceString = document.querySelector(sel).textContent;
        priceString = priceString.substring(2);
        return priceString;
      }, priceSelector);

    console.log(price);
    }
  
  browser.close();
}

async function getNumPages(page) {
  const RESULTS_SELECTOR = '#searchGrid > div > section:nth-child(1) > div > div > div.col-lg-6 > h1';

  let inner = await page.evaluate((sel) => {
    let html = document.querySelector(sel).textContent.split(" ");

    // format is: "1 - 20 of 185 results for query"
    return html[4];
  }, RESULTS_SELECTOR);

  let numResults = parseInt(inner);

  console.log('numResults: ', numResults);

  /*
  * 20 resuls per page, so
  */
  let numPages = Math.ceil(numResults / 20);
  return numPages;
}

run();