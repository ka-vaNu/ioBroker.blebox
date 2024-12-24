/* eslint-disable no-undef */
'use strict';
const multisensor = require('./multisensor');

const { expect } = require('chai');

const datapointElapsedTimeS = {
    path: 'multiSensor.sensors.0.elapsedTimeS',
    type: 'state',
    common: {
        name: 'Time in seconds that has elapsed since last valid measurement occurred, where -1 = Error, 0 = Fresh data',
        type: 'number',
        role: 'value',
        read: true,
        write: false,
    },
};

describe('test multisensor.getDatapoints', () => {
    const result = multisensor.datapoints;
    it(`expect command.move object`, () => {
        expect(JSON.stringify(result['multisensor#multiSensor.sensors[0].elapsedTimeS'])).to.equal(
            JSON.stringify(datapointElapsedTimeS),
        );
    });
});

describe('test multisensor.getApiUrl', () => {
    it('expect correct URL', () => {
        const result = '/state/extended';
        expect(multisensor.getApiUrl('multisensorExtendedState')).to.be.equal(result);
    });
    it('expect false on unsupported call', () => {
        expect(multisensor.getApiUrl('notExisting')).to.be.false;
    });
});

describe('test multisensor.getDeviceTypeMapping', () => {
    it('expect supported devices by this API', () => {
        const result = {
            multisensor: 'multisensor',
            tempSensor_PRO: 'multisensor',
            tempSensorAC: 'multisensor',
            humiditySensor: 'multisensor',
            windSensor_PRO: 'multisensor',
            rainSensor: 'multisensor',
            floodSensor: 'multisensor',
        };

        expect(JSON.stringify(multisensor.getDeviceTypeMapping())).to.be.equal(JSON.stringify(result));
    });
});
