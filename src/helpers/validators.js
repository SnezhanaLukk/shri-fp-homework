import { __, prop, equals, compose, allPass, gte, propEq, countBy, identity, values, dissoc, any, complement} from "ramda";

const getStar = prop('star');
const getTriangle = prop('triangle');
const getSquare = prop('square');
const getCircle = prop('circle');

const isRed = equals('red');
const isGreen = equals('green');
const isBlue = equals('blue');
const isWhite = equals('white');
const isOrange = equals('orange');
const getGreen = prop('green');
const dissocWhite = dissoc('white');

const isRedStar = compose(isRed, getStar);
const isGreenSquare = compose(isGreen, getSquare);
const isGreenTriangle = compose(isGreen, getTriangle);
const isWhiteStar = compose(isWhite, getStar);
const isWhiteCircle = compose(isWhite, getCircle);
const isWhiteSquare = compose(isWhite, getSquare);
const isWhiteTriangle = compose(isWhite, getTriangle);
const isBlueCircle = compose(isBlue, getCircle);
const isOrangeSquare = compose(isOrange, getSquare);
const isNotRedStar = complement(isRedStar);
const isNotWhiteStar = complement(isWhiteStar);
const isNotWhiteTriangle = complement(isWhiteTriangle);
const isNotWhiteSquare = complement(isWhiteSquare);


const isMoreThenTwoOrEqual = gte(__, 2);
const isMoreThenTreeOrEqual = gte(__, 3);
const numberOfColors = compose(countBy(identity), values);
const numberOfColorsWhitoutWhite = compose(dissocWhite, numberOfColors);
const numberOfSimilarColor = compose(any(isMoreThenTreeOrEqual), values);

const numberOfGreenColors = compose(getGreen, numberOfColors);
const allOneColor = color => compose(propEq(color, 4), numberOfColors);
const redEqualsBlue = ({blue, red}) => blue === red;
const twoGreen = compose(propEq('green', 2), numberOfColors);
const oneRed = compose(propEq('red', 1), numberOfColors);
const squareEquelsTriangleColor = ({square, triangle}) => square === triangle;

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = allPass([isRedStar, isGreenSquare, isWhiteTriangle, isWhiteCircle])

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = compose(isMoreThenTwoOrEqual, numberOfGreenColors)

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = compose(redEqualsBlue, numberOfColors)

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = allPass([isBlueCircle, isRedStar, isOrangeSquare])

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = compose(numberOfSimilarColor, numberOfColorsWhitoutWhite)

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = allPass([isGreenTriangle, twoGreen, oneRed ])

// 7. Все фигуры оранжевые.
export const validateFieldN7 = allOneColor('orange');

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = allPass([isNotRedStar, isNotWhiteStar])

// 9. Все фигуры зеленые.
export const validateFieldN9 = allOneColor('green');

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = allPass([isNotWhiteSquare, isNotWhiteTriangle, squareEquelsTriangleColor])
