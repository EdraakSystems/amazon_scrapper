const { Builder, Key } = require("selenium-webdriver");
const firefox = require("selenium-webdriver/firefox");
const { By, until } = require('selenium-webdriver');
const profilePath = "C:/Users/Imtiaz Ahmed/AppData/Roaming/Mozilla/Firefox/Profiles/rf2zatww.scrapperProfile";

async function getJobs() {
    const options = new firefox.Options();
    options.setProfile(profilePath);
    const driver = new Builder()
        .forBrowser("firefox")
        .setFirefoxOptions(options)
        .build();
    await driver.get('https://www.linkedin.com');

    // Wait for the page to finish loading before attempting to find the search input element
    await driver.wait(until.elementLocated(By.className('search-global-typeahead__input')));
    // get jobs on the page
    let element = await driver.findElement(By.className('search-global-typeahead__input'));
    await element.click()
    await element.sendKeys('wordpress');
    await element.sendKeys(Key.RETURN);
    await driver.wait(until.elementLocated(By.className('search-reusables__primary-filter')));
    const buttons = await driver.findElements(By.className("search-reusables__primary-filter"));
    await buttons[0].click()
    // Fetch all jobs
    let totalJobs = []
    await driver.wait(until.elementLocated(By.className('jobs-search-results__list-item')));
    await new Promise(resolve => setTimeout(resolve, 10000));
    const container = await driver.findElement(By.className('jobs-search-results-list'));
    await driver.executeScript("arguments[0].scrollTop += arguments[0].offsetHeight;", container);

    await driver.wait(until.elementLocated(By.className('artdeco-pagination__indicator--number')));
    const pagination = await driver.findElements(By.className('artdeco-pagination__indicator--number'));
    const lastPageButton = pagination[pagination.length - 1];
    const spanElement = await lastPageButton.findElement(By.tagName('span'));
    let spanValue = await spanElement.getText();

    if(spanValue>5){
        spanValue = 5
    }
    for (let i = 0; i < spanValue; i++) {
        // await driver.wait(until.elementLocated(By.className('artdeco-pagination__indicator--number')));
        const pagination = await driver.findElements(By.className('artdeco-pagination__indicator--number'));

        // await driver.wait(until.elementLocated(By.className('jobs-search-results__list-item')));
        // await new Promise(resolve => setTimeout(resolve, 6000));

        const list = await driver.findElements(By.className("jobs-search-results__list-item"))
        for(let i=0 ; i<list.length; i++){
            totalJobs.push(await list[i].getAttribute('innerHTML'))
        }
        // totalJobs.push(list.getAttribute('innerHTML'))
        await pagination[i + 1].click()
        await driver.wait(until.elementLocated(By.className('jobs-search-results__list-item')));
        await new Promise(resolve => setTimeout(resolve, 6000));
        const container = await driver.findElement(By.className('jobs-search-results-list'));
        await driver.executeScript("arguments[0].scrollTop += arguments[0].offsetHeight;", container)
    }
    console.log(totalJobs)
}

async function getCompanies() {
    const options = new firefox.Options();
    options.setProfile(profilePath);
    const driver = new Builder()
        .forBrowser("firefox")
        .setFirefoxOptions(options)
        .build();
    await driver.get('https://www.linkedin.com');

    // Wait for the page to finish loading before attempting to find the search input element
    await driver.wait(until.elementLocated(By.className('search-global-typeahead__input')));
    // get jobs on the page
    let element = await driver.findElement(By.className('search-global-typeahead__input'));
    await element.click()
    await element.sendKeys('wordpress');
    await element.sendKeys(Key.RETURN);
    await driver.wait(until.elementLocated(By.className('search-reusables__primary-filter')));
    const buttons = await driver.findElements(By.className("search-reusables__primary-filter"));
    await buttons[1].click()
    // Fetch all companies
    let totalCompanies = []
    await driver.wait(until.elementLocated(By.className('entity-result__item')));
    await new Promise(resolve => setTimeout(resolve, 10000));
    const container = await driver.findElement(By.className('theme--mercado'));
    await driver.executeScript("arguments[0].scrollTop = arguments[0].scrollHeight;", container);

    await driver.wait(until.elementLocated(By.className('artdeco-pagination__indicator--number')));
    const pagination = await driver.findElements(By.className('artdeco-pagination__indicator--number'));
    const lastPageButton = pagination[pagination.length - 1];
    const spanElement = await lastPageButton.findElement(By.tagName('span'));
    let spanValue = await spanElement.getText();

    if(spanValue>5){
        spanValue = 5
    }
    for (let i = 0; i < spanValue; i++) {
        const container = await driver.findElement(By.className('theme--mercado'));
        await driver.executeScript("arguments[0].scrollTop = arguments[0].scrollHeight;", container);
        await driver.wait(until.elementLocated(By.className('artdeco-pagination__indicator--number')));
        const pagination = await driver.findElements(By.className('artdeco-pagination__indicator--number'));

        // await driver.wait(until.elementLocated(By.className('jobs-search-results__list-item')));
        // await new Promise(resolve => setTimeout(resolve, 6000));

        const list = await driver.findElements(By.className("reusable-search__entity-result-list "))
        for(let i=0 ; i<list.length; i++){
            console.log('the test is ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------',await list[i].getAttribute('innerHTML'))
            totalCompanies.push(await list[i].getAttribute('innerHTML'))
        }
        // totalJobs.push(list.getAttribute('innerHTML'))
        await pagination[i + 1].click()
        await driver.wait(until.elementLocated(By.className('entity-result__item')));
        await new Promise(resolve => setTimeout(resolve, 6000));
    }
    console.log(totalCompanies)
}

async function getProfiles() {
    const options = new firefox.Options();
    options.setProfile(profilePath);
    const driver = new Builder()
        .forBrowser("firefox")
        .setFirefoxOptions(options)
        .build();
    await driver.get('https://www.linkedin.com');

    // Wait for the page to finish loading before attempting to find the search input element
    await driver.wait(until.elementLocated(By.className('search-global-typeahead__input')));
    // get jobs on the page
    let element = await driver.findElement(By.className('search-global-typeahead__input'));
    await element.click()
    await element.sendKeys('wordpress');
    await element.sendKeys(Key.RETURN);
    await driver.wait(until.elementLocated(By.className('search-reusables__primary-filter')));
    const buttons = await driver.findElements(By.className("search-reusables__primary-filter"));
    await buttons[2].click()
    // Fetch all companies
    let totalProfiles = []
    await driver.wait(until.elementLocated(By.className('reusable-search__entity-result-list')));
    await new Promise(resolve => setTimeout(resolve, 5000));
    const container = await driver.findElement(By.className('theme--mercado'));
    await driver.executeScript("arguments[0].scrollTop = arguments[0].scrollHeight;", container);

    await driver.wait(until.elementLocated(By.className('artdeco-pagination__indicator--number')));
    const pagination = await driver.findElements(By.className('artdeco-pagination__indicator--number'));
    const lastPageButton = pagination[pagination.length - 1];
    const spanElement = await lastPageButton.findElement(By.tagName('span'));
    let spanValue = await spanElement.getText();

    if(spanValue > 5){
        spanValue = 5
    }
    for (let i = 0; i < spanValue; i++) {
        const container = await driver.findElement(By.className('theme--mercado'));
        await driver.executeScript("arguments[0].scrollTop = arguments[0].scrollHeight;", container);
        await driver.wait(until.elementLocated(By.className('artdeco-pagination__indicator--number')));
        const pagination = await driver.findElements(By.className('artdeco-pagination__indicator--number'));

        // await driver.wait(until.elementLocated(By.className('jobs-search-results__list-item')));
        // await new Promise(resolve => setTimeout(resolve, 6000));

        const list = await driver.findElements(By.className("entity-result__item"))
        for(let i=0 ; i<list.length; i++){
            totalProfiles.push(await list[i].getAttribute('innerHTML'))
        }
        // totalJobs.push(list.getAttribute('innerHTML'))
        await pagination[i + 1].click()
        await driver.wait(until.elementLocated(By.className('entity-result__item')));
        await new Promise(resolve => setTimeout(resolve, 6000));
    }
    console.log(totalProfiles)
}

getCompanies();