const { Builder, By, until, Key } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');
const { JSDOM } = require("jsdom");
const options = new firefox.Options();
const profilePath = "C:/Users/Imtiaz Ahmed/AppData/Roaming/Mozilla/Firefox/Profiles/rf2zatww.scrapperProfile";
options.setProfile(profilePath);
let browser;
async function start() {
    const driver = await new Builder().forBrowser('firefox').setFirefoxOptions(options).build();
    browser = driver;
}

async function getCompanies(queryParams = 'react') {
    await start();
    await browser.get('https://www.amazon.com/?&tag=googleglobalp-20&ref=pd_sl_7nnedyywlk_e&adgrpid=82342659060&hvpone=&hvptwo=&hvadid=585475370855&hvpos=&hvnetw=g&hvrand=10375415508302608441&hvqmt=e&hvdev=c&hvdvcmdl=&hvlocint=&hvlocphy=1011082&hvtargid=kwd-10573980&hydadcr=2246_13468515');
    // Wait for the page to finish loading before attempting to find the search input element
    await browser.wait(until.elementLocated(By.id('twotabsearchtextbox')));
    let element = await browser.findElement(By.id('twotabsearchtextbox'));
    await element.click();
    await element.sendKeys(queryParams);
    await element.sendKeys(Key.RETURN);
    await browser.wait(until.elementLocated(By.className('s-pagination-strip')));
    let paginated = await browser.findElement(By.className('s-pagination-strip'));
    let lastSpan = await paginated.findElement(By.xpath('.//span[last()]'));
    let lastPageNumber = await lastSpan.getText(); // last number
    let results = [];
    // all products of first page
    let temp = await browser.findElements(By.className('s-result-item'));
    for (let i = 0; i < temp.length; i++) {
        let innerHTML = await temp[i].getAttribute("innerHTML");
        console.log(innerHTML);
        results.push(temp[i]);
    }
    // go to second page
    const page2Link = await paginated.findElement(By.xpath('.//a[@aria-label="Go to page 2"]'));
    await page2Link.click();
    // get current url
    let url = await browser.getCurrentUrl();
    console.log("New ------------------------- Current URL is: " + url);
    // get second page products
    let productsLoaded = false;
    let previousProductCount = 0;
    while (!productsLoaded) {
        await browser.executeScript("arguments[0].scrollTop = arguments[0].scrollHeight;", browser.findElement(By.tagName("body")));
        await new Promise(resolve => setTimeout(resolve, 6000)); // wait for page to finish loading
        temp = await browser.findElements(By.className('s-result-item'));
        for (let i = 0; i < temp.length; i++) {
            let innerHTML = await temp[i].getAttribute("innerHTML");
            console.log(innerHTML);
            results.push(temp[i]);
        }
        if (temp.length === previousProductCount) {
            productsLoaded = true;
        } else {
            previousProductCount = temp.length;
        }
    }
    for (let page = 3; page <= lastPageNumber; page++) {
        let link = await browser.findElement(By.linkText(`${page}`));
        await link.click();
        await browser.wait(until.urlContains(`page=${page}`), 5000);
        productsLoaded = false;
        previousProductCount = 0;
        while (!productsLoaded) {
            await browser.executeScript("arguments[0].scrollTop = arguments[0].scrollHeight;", browser.findElement(By.tagName("body")));
            await new Promise(resolve => setTimeout(resolve, 6000)); // wait for page to finish loading
            temp = await browser.findElements(By.className('s-result-item'));
            for (let i = 0; i < temp.length; i++) {
                let innerHtml = await temp[i].getAttribute("innerHTML");
                console.log(innerHtml);
                results.push(temp[i]);
            }
            if (temp.length === previousProductCount) {
                productsLoaded = true;
            } else {
                previousProductCount = temp.length;
            }
        }
    }
}


getCompanies()