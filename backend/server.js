const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Builder, By, until, Key } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');
const options = new firefox.Options();
options.headless();
const profilePath = "C:/Users/Imtiaz Ahmed/AppData/Roaming/Mozilla/Firefox/Profiles/rf2zatww.scrapperProfile";
options.setProfile(profilePath);
const url = require('url');
const querystring = require('querystring');
// global browser instance

var socketObj;
let browser;
async function start() {
    const driver = await new Builder().forBrowser('firefox').setFirefoxOptions(options).build();
    browser = driver;
}

async function getProducts(socket, queryParams) {
    await start();
    socket.emit('products', '<h1>Loading Data</h1>')
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
        socket.emit('products', innerHTML)
        console.log(innerHTML)
    }
    // go to second page
    console.log('third')
    const page2Link = await paginated.findElement(By.xpath('.//a[@aria-label="Go to page 2"]'));
    await page2Link.click();
    // get current url
    let url = await browser.getCurrentUrl();
    console.log("New -------------------------Current URL is: " + url);
    // get second page products
    let productsLoaded = false;
    let previousProductCount = 0;
    console.log('fourth')
    while (!productsLoaded) {
        await browser.executeScript("arguments[0].scrollTop = arguments[0].scrollHeight;", browser.findElement(By.tagName("body")));
        await new Promise(resolve => setTimeout(resolve, 6000)); // wait for page to finish loading
        temp = await browser.findElements(By.className('s-result-item'));
        for (let i = 0; i < temp.length; i++) {
            let innerHTML = await temp[i].getAttribute("innerHTML");
            socket.emit('products', innerHTML)
            console.log(innerHTML)
        }
        if (temp.length === previousProductCount) {
            productsLoaded = true;
        } else {
            previousProductCount = temp.length;
        }
    }
    console.log('fifth')
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
                socket.emit('products', innerHtml)
                console.log(innerHtml)
            }
            if (temp.length === previousProductCount) {
                productsLoaded = true;
            } else {
                previousProductCount = temp.length;
            }
        }
    }


    // await browser.wait(until.elementLocated(By.className('search-reusables__primary-filter')));
    // const buttons = await browser.findElements(By.className("search-reusables__primary-filter"));
    // let temp = null
    // for (let i = 0; i < buttons.length; i++) {
    //     let ele = await buttons[i].getAttribute('innerHTML')
    //     let ind = ele.indexOf('type="button">')
    //     let ie = ele.slice(ind+14, ele.length)
    //     ie = ie.trim()
    //     console.log(ie)
    //     if(ie.startsWith('Jobs')){
    //         temp = i
    //         break;
    //     }
    // }
    // await new Promise(resolve => setTimeout(resolve, 6000));
    // await buttons[temp].click()
    // await browser.wait(until.elementLocated(By.className("jobs-search-box__input--location")));
    // const inp = await browser.findElement(By.className("jobs-search-box__input--location"));
    // const innerInput = await inp.findElements(By.tagName("input"));
    // await innerInput[0].click();
    // await new Promise(resolve => setTimeout(resolve, 6000));
    // await innerInput[0].clear();
    // await innerInput[0].sendKeys(q2);
    // await innerInput[0].sendKeys(Key.RETURN);
    // // Fetch all jobs
    // let totalJobs = []
    // await browser.wait(until.elementLocated(By.className('jobs-search-results__list-item')));
    // await new Promise(resolve => setTimeout(resolve, 10000));
    // const container = await browser.findElement(By.className('jobs-search-results-list'));
    // await browser.executeScript("arguments[0].scrollTop += arguments[0].offsetHeight;", container);
    // console.log('third')
    // await browser.wait(until.elementLocated(By.className('artdeco-pagination__indicator--number')));
    // const pagination = await browser.findElements(By.className('artdeco-pagination__indicator--number'));
    // const lastPageButton = pagination[pagination.length - 1];
    // const spanElement = await lastPageButton.findElement(By.tagName('span'));
    // let spanValue = await spanElement.getText();
    // console.log('fourth')
    // if (spanValue > 7) {
    //     spanValue = 7
    // }
    // for (let i = 0; i < spanValue; i++) {
    //     // await driver.wait(until.elementLocated(By.className('artdeco-pagination__indicator--number')));
    //     const pagination = await browser.findElements(By.className('artdeco-pagination__indicator--number'));
    //     // await driver.wait(until.elementLocated(By.className('jobs-search-results__list-item')));
    //     // await new Promise(resolve => setTimeout(resolve, 6000));
    //     console.log('fifth')
    //     const list = await browser.findElements(By.className("jobs-search-results__list-item"))
    //     for (let i = 0; i < list.length; i++) {
    //         let d = await list[i].getAttribute('innerHTML')
    //         totalJobs.push(d)
    //         console.log(d)
    //         console.log('siz')
    //         socket.emit('jobs', d)
    //     }
    //     // totalJobs.push(list.getAttribute('innerHTML'))
    //     await pagination[i + 1].click()
    //     await browser.wait(until.elementLocated(By.className('jobs-search-results__list-item')));
    //     await new Promise(resolve => setTimeout(resolve, 6000));
    //     const container = await browser.findElement(By.className('jobs-search-results-list'));
    //     await browser.executeScript("arguments[0].scrollTop += arguments[0].offsetHeight;", container)
    //     console.log('jobs in progress')
    // }
    // console.log('jobs is done')
    // return totalJobs
}

const server = http.createServer(async function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    let body = '';

    req.on('data', function (chunk) {
        body += chunk.toString();
    });
    req.on('end', async function () {
        if (req.url.startsWith('/products')) {
            let str = req.url
            let query = str.slice(16, str.length)
            let q1 = query.slice(0, str.length)
            console.log(q1)
            const response = await getProducts(socketObj, q1);
            // res.end(JSON.stringify(response));
        } else {
            res.statusCode = 404;
            res.end('Not found');
        }
    })
});

const io = require('socket.io')(server);

io.on('connection', (socket) => {
    socketObj = socket;
    console.log('a user connected');
    setInterval(() => {
        socket.emit('data', Math.random());
    }, 10000);
});

server.listen(4000, function () {
    console.log('Server running on port 4000');
});