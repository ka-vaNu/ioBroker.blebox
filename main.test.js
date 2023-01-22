"use strict";

/**
 * This is a dummy TypeScript test file using chai and mocha
 *
 * It's automatically excluded from npm and its build output is excluded from both git and npm.
 * It is advised to test all your modules with accompanying *.test.js-files
 */

// tslint:disable:no-unused-expression

// @ts-ignore
const { expect } = require("chai");
// import { functionToTest } from "./moduleToTest";

// @ts-ignore
// eslint-disable-next-line no-undef
describe("module to test => function to test", () => {
    // initializing logic
    const expected = 5;

    // @ts-ignore
    // eslint-disable-next-line no-undef
    it(`should return ${expected}`, () => {
        const result = 5;
        // assign result a value from functionToTest
        expect(result).to.equal(expected);
        // or using the should() syntax
        // @ts-ignore
        result.should.equal(expected);
    });
    // ... more tests => it
});

// ... more test suites => describe
