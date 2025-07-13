import Api from '../tools/api';
import { inRange, flow, toNumber, isFinite, every, size, property, multiply, partial } from 'lodash';
import { modulo } from 'ramda';

const api = new Api();
const API_NUMBERS_URL = 'https://api.tech/numbers/base';
const API_ANIMALS_URL = 'https://animals.tech/';

const isValidChar = str => /^[\d.]+$/.test(str);
const isValidLength = str => inRange(str.length, 3, 10);
const isPositiveNumber = num => isFinite(num) && num > 0;
const validate = value => every([ isValidChar, isValidLength], fn => fn(value));
const toValidNumber = flow([toNumber, num => isPositiveNumber(num) ? Math.round(num) : NaN ]);


const processSequence = ({value, writeLog, handleSuccess, handleError}) => {
    writeLog(value);

    if(!validate(value)) {
        handleError('ValidationError');
        return;
    }

    const num = toValidNumber(value);
    if (isNaN(num)) {
        handleError('ValidationError');
        return;
    }
    writeLog(num);

    api.get(API_NUMBERS_URL, {from: 10, to: 2, number: num})
        .then(property('result'))
        .then(result => {
            writeLog(result);
            return result;
        })
        .then(binStr => {
            const length = size(binStr);
            writeLog(length);
            return length;
        })
        .then(length => {
            const square = multiply(length, length);
            writeLog(square);
            return square;
        })
        .then(square => {
            const remains = modulo(square, 3);
            writeLog(remains);
            return remains;
        })
        .then(remains => api.get(`${API_ANIMALS_URL}${remains}`, {}))
        .then(property('result'))
        .then(handleSuccess)
        .catch(partial(handleError, 'API Error'));
}

export default processSequence;
