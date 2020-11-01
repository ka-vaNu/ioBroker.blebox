const shutterbox = require("./shutterbox");
const switchbox = require("./switchbox");

/**
 * Tests whether the given variable is a real object and not an Array
 * @param {any} it The variable to test
 * @returns {it is Record<string, any>}
 */
function isObject(it) {
    // This is necessary because:
    // typeof null === 'object'
    // typeof [] === 'object'
    // [] instanceof Object === true
    return Object.prototype.toString.call(it) === "[object Object]";
}

/**
 * Tests whether the given variable is really an Array
 * @param {any} it The variable to test
 * @returns {it is any[]}
 */
function isArray(it) {
    if (typeof Array.isArray === "function") return Array.isArray(it);
    return Object.prototype.toString.call(it) === "[object Array]";
}

function getDatapoints(type) {
    switch (type) {
        case "shutterbox":
            return shutterbox.datapoints;
        case "switchbox":
            return switchbox.datapoints;
        default:
            break;
    }
    return false;
}

module.exports = {
    isArray,
    isObject,
    getDatapoints
};
