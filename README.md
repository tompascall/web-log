![Build Status](https://travis-ci.org/tompascall/web-log.svg?branch=master) [![Coverage Status](https://coveralls.io/repos/tompascall/web-log/badge.svg?branch=master)](https://coveralls.io/r/tompascall/web-log?branch=master)


# web-log
## nodejs e2e test utility for testing network traffic

This utility helps you testing network traffic in your selenium e2e tests. If you don't know much about selenium webdriver and how to use it with node, I recommend you to check its usage in the [webdriver documentation](http://seleniumhq.github.io/selenium/docs/api/javascript/index.html). You can find a demo at the bottom of this file, where we use some basic feature of webdriver. 

When you write e2e tests, sometimes you would like to check the network traffic during between changes of the state of your application. You may want to know for example if an ajax request has really been sent (say with the correct query params) after a button was clicked, or you would like to check if the response was correct. 

A solution for this problem can be getting and filtering the log entries extracted from selenium webdriver network log:

```js
const { driverUtil, logEntries } = require('web-log');

//  use your previously configured web driver instance, 
//  or you can use the built-in driver config as below.

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
As you can see there are a lot of information available by filtering the log data of the webdriver. The main aim of this utility is to make filtering and analyzing the log easier and help you for setting up the webdriver to get the log data.

## Prerequisites

- Nodejs (at least v6.1)

- For the moment the tool only works with [chromedriver](https://sites.google.com/a/chromium.org/chromedriver/getting-started)<sup>*</sup>. You have to install it if you haven't done yet.

- Install the package: `npm -i save-dev web-log`  

<sup>*</sup>The logging interface supported by Selenium isn’t available in geckodriver yet. Read more about this issue [here](https://github.com/mozilla/geckodriver/issues/284).

## Usage

### logEntries

You can use logEntries module by requiring it from the main module:  

```js
const { logEntries } = require('web-log');
```

logEntries module gets the raw entry data, transforms it to a JSON object, and has filter utilities to filter entries in quite a flexible way. You can use the following methods:

#### getRawEntries ({ driver }): promise (the result is an array)

Gets the raw performance log data. It is an array which contains **raw** entry objects (ie. we have not done any transformation in the data). You have to provide a webdriver object to get the raw log data. Check a basic example for setting up a driver object in the demo block.

#### getLogEntries ({ driver }) : promise (result is an array)

It gets raw entries and transforms the message part of the entry to a JSON format object. This method is ideal for getting all the log data, and after that you may want to filter entries with the filter utilities. **Getting entries clears the log content of the driver**, so you have to make all operation on entries data before getting log entries again, and it means you can use this method if you only want to clear entries from the driver. All the filters and matchers work on entries got by this method, but not on the raw entry data. So a basic workflow can be getting the data via this method, and after that you can use the filter utilities below:

```js
const { logEntries, driverUtils } = require('web-log');
const driver = driverUtil.createDriver({type: 'chrome'});

logEntries.getLogentries({ driver }).then( (entries) => {
  ... filter entries here
})
```

#### filterEntries ({entries, method?, urlPart?, refParams?, status?, predicate?, dupAlert?}) : array of filtered entries or false if no match

It needs entries you got previously via `getLogentries()` method. You can filter the entries quite comfortably with the following options:

- **method** can be
  - 'Network.requestWillBeSent'
  - 'Network.requestServedFromCache'
  - 'Network.responseReceived'
  - 'Network.dataReceived'
  - 'Network.loadingFinished'
  - 'Network.loadingFailed'
- **urlPart** can be a string or a regex to filter the url of a request or a response
- **refParams** is an object with key:value pairs of params `{ param1: 'value1', param2: 'value2' }`. These are params you want to check if a given url query contains. You do not have to give all the params of url, just the ones you want to check.
- **status** can be a string or a regex (it is only reasonable when method is `Network.responseReceived`)
- **predicate** can be any filter function which works on entry (eg. `entry => { any function that returns boolean }`)
- **dupAlert** is a boolean with the false default value. You want to use it if yau want to make sure a eg. a request with the given params is sent just only once. In case of duplication you'll get an error message.

So we can write a test even with more filters like this (suppose we use mocha and chai for tests):

```js
const { logEntries, driverUtils } = require('web-log');
const driver = driverUtil.createDriver({type: 'chrome'});

describe('test yahoo search landig page', () => {
  before( () => {
    return logEntries.getLogentries({ driver }) // clear driver log entries
      .then( () => {
         return driver.get('https://search.yahoo.com/')
      });
  });

  it('should have loaded a firefox icon from s.yimg.com', () => {
    return logEntries.getLogEntries({ driver })
      .then( (entries) => {
        let matched = logEntries.filterEntries({
          entries,
          urlPart: /s\.yimg\.com.+images\/ff_icon\-compressed\.png$/,
          method: 'Network.responseReceived',
          status: /[23]\d\d/,
          dupAlert: true
        });
        expect(matched.length).to.be.ok;
      });
  });
});
```

You can use the following built-in fiter methods directly if you want. Built-in filter methods have the same form:
- you have to provide entries got from `logEntries.getLogEntries() method prevously`
- they give back a self reference for the object for chainability  
- You can reach the result in filteredEntries attribute  
- If you do not provide params, they give back all the entries

#### filterByStatus({ entries, [status: regex | string]? })

```js
  const filteredEntries = logEntries.filterByStatus({entries: previouslyGotEntries, status: 'someString'}).filteredEntries;
```

#### filterByMethod({ entries, [method: string]? }) : self reference

#### filterByRefParams({ entries, [refParams: object ]? }) : self reference

#### filterByUrlPart({ entries, [refParams: string | regex ]? }) : self reference

#### filterByPredicate({ entries, [predicate: function]? }) : self reference

Predicate can be any filter function which works on item of entries (eg. `entry => { any function that returns boolean }`)

### logEntry

logEntry module operates on single entry object.

#### getMethod ({ entry }) : string

Get method of entry.

````js
const { logEntries, logEntry } = require('web-log');

// getting entries
// and work on on of them

logEntry.getMethod({ entry }) // Network.requestWillBeSent
```

#### getUrl ({ entry }) : string

Get url of entry.
```js
logEntry.getUrl({ entry }) // "https://s.yimg.com/kx/yucs/uh3s/promo-ff/1/images/ff_icon-compressed.png"
```

#### getStatus ({ entry }) : string

Get status of entry (checks only 'Network.responseReceived' methods).
```js
logEntry({ entry }) // "200"
```

## Demo

In the demo we navigate to a page and fiter a small part of the log entries.   
To run demo: `node demo/demo.js`  

## Development

We use [Jest](https://facebook.github.io/jest/) for unit testing. You can run tests with `npm run test` or `npm run test:watch` for only watching changed file.

