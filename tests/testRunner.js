/**
 * @fileoverview Test runner for running unit tests from the command line.
 *
 * Copyright 2012 Digital Darkness
 */

goog.require('goog.testing.jsunit');

/**
 * Success or failure indications.
 * @type {!string}
 */
var logged = '';

/**
 * Consolidate success and failure indicators so they don't take a ridiculous
 * amount of vertical space.
 * @param {!string} str Indicator to add to the logger.
 */
var logger = function(str) {
    // The test framework runs tests in reverse order, so add the result to the
    // beginning of the logged string.
    logged = str + logged;
    if (60 < logged.length) {
        // Add a line break before this gets out of hand.
        window.console.info(logged);
        logged = '';
    }
};

// Keep the test runner from clogging up the display.
var originalLog = window.console.log;
window.console.log = function() {};

// Closure expects there to be a document.body to add their logger to.
document.body = document.createElement('body');

/**
 * @type {!goog.testing.TestCase}
 */
var test = new goog.testing.TestCase();


/**
 * Override the success handler.
 * @override
 * @param {!string} test Name of the test that succeeded.
 */
test.doSuccess = function(test) {
    this.result_.successCount++;
    logger('.');
};


/**
 * Override the error handler.
 * @override
 * @param {!string} test Name of the failing test.
 * @param {jsunitException} opt_e Exception containing failure information.
 */
test.doError = function(test, opt_e) {
    var message = test.name + ' : FAILED';
    this.saveMessage({message: message, error: opt_e});
    logger('F');
}

/**
 * Save an error message.
 * @override
 * @param {object} message Message to save.
 */
test.saveMessage = function(message) {
    this.result_.messages.push(message);
};

test.autoDiscoverTests();

/**
 * @type {!goog.testing.TestRunner}
 */
var runner = new goog.testing.TestRunner();
runner.initialize(test);
runner.execute();

window.console.info(logged + '\n');

if (runner.isSuccess()) {
    phantom.exit(0);
}
window.console.log = originalLog;
var failure;
var i = 0;

window.console.log('There were ' + (test.result_.messages.length - 2) +
    ' failures.');
while (test.result_.messages.length) {
    failure = test.result_.messages.shift();
    if (goog.isString(failure)) {
        continue;
    }
    i = i + 1;
    window.console.log(i + '. ' + failure.message);
    window.console.log('   ' + failure.error.message);
}
phantom.exit(1);
