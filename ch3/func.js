const {odd, even} = require('./var') //node.js에서 제공하는 함수

function checkOddOrEven(number) {
    if (number % 2) {
        return odd;
    } else {
        return even;
    }
}

module.exports = {
    checkOddOrEven,
    odd,
    even,
};