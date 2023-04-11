// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const { Builder, By, until } = require('selenium-webdriver');


export default async function handler(req, res) {
  const firefox = require('selenium-webdriver/firefox');
  const options = new firefox.Options();
  options.headless();
  async function example(query) {
    let driver = await new Builder().forBrowser('firefox').setFirefoxOptions(options).build();
    await driver.get(`https://www.google.com/search?q=site:linkedin.com ${query} jobs`);

    let element = await driver.findElement(By.className('yuRUbf'));
    let link = await element.findElement(By.tagName('a')).getAttribute('href');
    await driver.get(link);

    let i = 0
    while (true) {
      await driver.executeScript('window.scrollTo(0, document.body.scrollHeight)');
      let elements = await driver.findElements(By.className('infinite-scroller__show-more-button'));
      if (elements.length > 0) {
        let element = elements[0];
        await driver.executeScript('arguments[0].scrollIntoView(true);', element);
        await driver.wait(until.elementIsEnabled(element));
      }
      i++
      if (i == 280) {
        break
      }
    }

    // click
    let jobs = []
    try {
      i = 0;
      while (true) {
        await driver.executeScript('window.scrollTo(0, document.body.scrollHeight)');
        let elements = await driver.findElements(By.className('infinite-scroller__show-more-button'));
        if (elements.length > 0) {
          let element = elements[0];
          await driver.executeScript('arguments[0].scrollIntoView(true);', element);
          await driver.wait(until.elementIsEnabled(element));
          await element.click()
          i++
        } else {
          break
        }
      }
    }
    catch (err) {
      let cards = await driver.findElements(By.className('base-card__full-link'));
      for (let card of cards) {
        let title = await card.getAttribute('innerHTML')
        let link = await card.getAttribute('href')
        jobs.push({
          title,
          link
        })
      }
      return jobs
    }


  }

  const response = await example(req.body.query)
 
  return res.status(200).json({response})
}
