![Build Status](https://travis-ci.org/tompascall/weblog.svg?branch=master) [![Coverage Status](https://coveralls.io/repos/tompascall/weblog/badge.svg?branch=master)](https://coveralls.io/r/tompascall/weblog?branch=master)


# weblog
## e2e test utility for testing network traffic

This utility helps you testing network traffic in your selenium e2e tests. 

When you write e2e tests, sometimes you would like to check the network traffic during between changes of the state of your application. You may want to know for example if an ajax request has really been sent (say with the correct query params) or check the correct response of a request. 

A solution for this problem can be getting and filtering the log entries extracted from selenium webdriver network log:

```js
const { driverUtil, logEntries } = require('weblog');

//  use your previously configured web driver instance, 
//  or you can use the built-in driver config as below

const driver = driverUtil.createDriver({type: 'chrome'});

driver.get('https://search.yahoo.com/')
.then( () => {
  return logEntries.getLogEntries({ driver });
})
.then( (entries) => {
  let filteredEntries = logEntries.filterEntries({
    entries,
    urlPart: 'images/ff_icon-compressed.png',
    method: 'Network.requestWillBeSent'
  });
  console.log(JSON.stringify(filteredEntries));
});
```

You'll get something like this:

```js
[
  {
    "message": {
      "method": "Network.requestWillBeSent",
      "params": {
        "documentURL": "https://search.yahoo.com/",
        "frameId": "34828.1",
        "initiator": {
          "lineNumber": 2,
          "type": "parser",
          "url": "https://search.yahoo.com/"
        },
        "loaderId": "34828.1",
        "request": {
          "headers": {
            "Referer": "https://search.yahoo.com/",
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 Safari/537.36"
          },
          "initialPriority": "Low",
          "method": "GET",
          "mixedContentType": "none",
          "url": "https://s.yimg.com/kx/yucs/uh3s/promo-ff/1/images/ff_icon-compressed.png"
        },
        "requestId": "34828.3",
        "timestamp": 162088.788968,
        "type": "Other",
        "wallTime": 1486295567.13642
      }
    },
    "webview": "92d5054b-9d84-4399-8d74-9c0c9d0393d4"
  }
]
```

## Prerequisites

- Nodejs (at least v6.9)

- For the moment the tool only works with [chromedriver](https://sites.google.com/a/chromium.org/chromedriver/getting-started)<sup>*</sup>. You have to install it if you haven't done yet.

- Clone the project and install npm packages.  

<sup>*</sup>The logging interface supported by Selenium isn’t available in geckodriver. read more about this issue [here](https://github.com/mozilla/geckodriver/issues/284).

## Usage

### logEntries

logEntries module gets the raw entry data, transforms it to a JSON object, and has filter utilities to filter entries by method, urlPart or query params.

#### getRawEntries ({ driver }): promise (the result is an array)

Gets the raw performance log data. It is an array which contains **raw** entry objects.

#### getLogEntries ({ driver }) : promise (result is an array)

It gets raw entries and transforms the message part of the entry to a JSON format object. This method is ideal for getting all the log data, and after that you may want to filter entries with the filter utilities. **Getting entries clears the log content of the driver**, so you have to make all operation on entries data before getting log entries again. All the filters and matchers work on entries got by this method, but not on the raw entry data.

#### filterEntries ({entries, method?, urlPart?, refParams?, status?, predicate?}) : array of filtered entries or false if no match

Yo can filter the entries quite comfortably with this method. If method, urlPart, status or refParam omitted, it gives back all entries with all methods etc.

- **method** can be
  - 'Network.requestWillBeSent'
  - 'Network.requestServedFromCache'
  - 'Network.responseReceived'
  - 'Network.dataReceived'
  - 'Network.loadingFinished'
  - 'Network.loadingFailed'
- **urlPart** can be a string or a regex
- **refParams** is an object with params `{ param1: 'value1', param2: 'value2' }`. These are params you want to check if a given url query contains. You do not have to give all the params of url, just the ones you want to check.
- **status** can be a string or a regex (it is only reasonable when method is responseReceived)
- **predicate** can be any filter function which works on entry (eg. `entry => { any function that returns boolean }`)

### logEntry

logEntry module operates on single entry object.

#### getMethod ({ entry })

Get method of entry.

#### getUrl ({ entry })

Get url of entry.

#### getStatus ({ entry })

Get status of entry (checks only 'Network.responseReceived' methods).

## Demo

To build the demo: `npm run demo`  
To run demo: `node demo/bin/demo.js`  

## Development

We use [Jest](https://facebook.github.io/jest/) for unit testing. You can run tests with `npm run test` or `npm run test:watch` for only watching changed file.

To create a webpack package from the project run `npm build`.

