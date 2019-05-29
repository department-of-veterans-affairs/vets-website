// helper function to round to nearest 10
function roundRating(num) {
    const ratingWithDecimal = Number.parseFloat(num).toFixed(.1);
    return Math.round(ratingWithDecimal / 10) * 10;
}

// helper to check if value of rating is a number
function isNaN(arr) {
    for (var i = arr.length - 1; i >= 0; i--) {
        if (!Number.isInteger(arr[i])) {
            arr.splice(i, 1)
        }
        console.log('isNaN: ' + arr)
    }
    return arr;
}

// helper to remove % sign from rating
function checkForPercent(e) {
    let element = String(e).split('')
    for (let i = element.length - 1; i >= 0; i--) {
        if (element[i] === '%') {
            element.splice(i, 1);
        }
    }
    return parseInt(element.join(''))
}

// list of ratings
let ratingArray = [20, NaN, 30, 10,];

// main calculation function
export function calculateRating(arr) {
    let checkIfRatingsAreNumbers = isNaN(arr);

    let sortedArr = checkIfRatingsAreNumbers.sort(function (a, b) {
        return b - a;
    })
    let a, b, x;

    console.log('sortedArr: ' + sortedArr)
    while (sortedArr.length > 1) {
        console.log(sortedArr)
        a = 100 - sortedArr[0];
        console.log('100 - sortedArr[0]', 100 - sortedArr[0])
        b = (sortedArr[1] * a) / 100;
        console.log('(sortedArr[1] * a) / 100', (sortedArr[1] * a) / 100)
        x = sortedArr[0] + b
        console.log('sortedArr[0] + b', sortedArr[0] + b)
        sortedArr.splice(0, 2, x);
        console.log(sortedArr)
    }

    if (sortedArr.length === 1) {
        let lastCalcualtedRating = sortedArr[0];
        return roundRating(lastCalcualtedRating);
    }
}
