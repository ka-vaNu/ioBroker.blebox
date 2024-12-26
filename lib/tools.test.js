/* eslint-disable no-undef */
const expect = require('chai').expect;
const tools = require('../lib/tools');
const axios = require('axios');
const sinon = require('sinon');

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

const responseData = {
    status: 'value1',
    details: {
        description: 'value3',
        isActive: true,
        additionalInfo: null,
    },
    items: [
        {
            id: 1,
            name: 'Item 1',
        },
        {
            id: 2,
            name: 'Item 2',
        },
    ],
    message: 'Ein einfacher String',
    userId: 12345,
    balance: 123.45,
};

const expectedResponse =
    '{"status":"value1","details.description":"value3","details.isActive":true,"details.additionalInfo":null,"items[0].id":1,"items[0].name":"Item 1","items[1].id":2,"items[1].name":"Item 2","message":"Ein einfacher String","userId":12345,"balance":123.45}';

const device = {
    dev_name: 'fakeName',
    smart_name: 'fakeSmartName',
    dev_ip: 'localhost',
    dev_port: 3000,
    dev_type: 'shutterbox',
    polling: 60,
    api_type: 'shutterbox',
};

const fruits = [];
fruits.push('banana', 'apple', 'peach');

describe('Test tools.isObject', function () {
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

describe('Test tools.isArray', function () {
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

describe('Test tools.simpleObjectUrlGetter', () => {
    let axiosGetStub;

    beforeEach(() => {
        axiosGetStub = sinon.stub(axios.default, 'get');
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should fetch data and return the dot-notated object', async () => {
        const url = '/test';

        axiosGetStub.resolves({ data: responseData });

        const result = await tools.simpleObjectUrlGetter(device, url);

        expect(axiosGetStub).to.have.been.calledOnceWithExactly('http://localhost:3000/test');
        expect(JSON.stringify(result)).to.be.equal(expectedResponse);
    });
});
