/* eslint-disable no-undef */
const expect = require('chai').expect;
const tools = require('../lib/tools');

const datapoints = {
    'gatebox#command.move': {
        path: 'command.move',
        type: 'state',
        common: {
            name: 'primary action (p), secondary action (s), open (o), close (c)',
            type: 'string',
            role: 'text',
            read: true,
            write: true,
            states: { p: 'Primary', s: 'Secondary', o: 'Open', c: 'Close' },
        },
    },
};

const fruits = [];
fruits.push('banana', 'apple', 'peach');

describe('Test isObject', function () {
    it('expect false', function () {
        expect(tools.isObject(null)).to.be.false;
    });

    it('expect true', function () {
        expect(tools.isObject(['true', 'true'])).to.be.false;
    });

    it('expect true', function () {
        expect(tools.isObject(datapoints)).to.be.true;
    });
});

describe('Test isArray', function () {
    it('expect true', function () {
        expect(tools.isArray(fruits)).to.be.true;
    });

    it('expect true', function () {
        expect(tools.isArray(['true', 'true'])).to.be.true;
    });

    it('expect false', function () {
        expect(tools.isArray(datapoints)).to.be.false;
    });
});
