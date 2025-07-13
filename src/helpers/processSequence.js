import Api from '../tools/api';
import { __, andThen, assoc, compose, otherwise, partial, prop, modulo} from 'ramda';
import { inRange, toNumber, isFinite, every, size,  multiply } from 'lodash';

const api = new Api();

const API_NUMBERS_URL = 'https://api.tech/numbers/base';
const API_ANIMALS_URL = 'https://animals.tech/';

const isValidChar = str => /^[\d.]+$/.test(str);
const isValidLength = str => inRange(str.length, 3, 10);
const isPositiveNumber = num => isFinite(num) && num > 0;
const validate = value => every([ isValidChar, isValidLength], fn => fn(value));
const toValidNumber = compose(num => isPositiveNumber(num) ? Math.round(num) : NaN, toNumber );

const evalSize = val => size(val);
const square = val => multiply(val, val);
const remains = (val) => modulo(val, 3);

const refresh = (fn, transform = v => v) =>
  andThen((v) => {
    const result = transform(v);
    fn(result);
    return result;
  });
const getResult = prop('result');

const buildBinaryRequest = assoc('number', __, { from: 10, to: 2 });
const getBinary = compose(api.get(API_NUMBERS_URL), buildBinaryRequest);
const getAnimalUrl = id => `${API_ANIMALS_URL}${id}`;
const fetchAnimal = id => api.get(getAnimalUrl(id), {});

const processSequence = ({ value, writeLog, handleSuccess, handleError }) => {

    const handleValidationError = partial(handleError, 'ValidationError');
    const handleApiError = otherwise(partial(handleError, 'API Error'));

    writeLog(value);

    if (!validate(value)) {
        handleValidationError();
        return;
    }

    const number = toValidNumber(value);
    if (isNaN(number)) {
        handleValidationError();
        return;
    }
    writeLog(number);

    const runPipeline = compose(
        handleApiError,
        andThen(handleSuccess),
        andThen(getResult),
        andThen(fetchAnimal),
        refresh(writeLog, remains),
        refresh(writeLog, square),
        refresh(writeLog, evalSize),
        refresh(writeLog),
        andThen(getResult),
        getBinary
    );

    runPipeline(number);
};

export default processSequence;