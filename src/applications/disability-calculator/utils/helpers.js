
// helper function to round rating up or down.
export function roundRating(num) {
    const ratingWithDecimal = Number.parseFloat(num).toFixed(.1);
    return Math.round(ratingWithDecimal / 10) * 10;
}

// list of ratings
let ratingArray = [20, 10, 30];

// main calculation function
export function calculateRating(arr) {
    let sortedArr = arr.sort(function (a, b) {
        return b - a;
    })
    let a, b, x;

    // sortedArr.forEach(function(el) {
    //     if (el)
    // })
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
