// helper function to round to nearest 10
function roundRating(num) {
  const ratingWithDecimal = parseFloat(num).toFixed(0.1);
  return Math.round(ratingWithDecimal / 10) * 10;
}

export function pullRatingsFromState(arr) {
  const allRatings = [];
  arr.forEach(e => {
    allRatings.push(e.rating);
  });
  return allRatings;
}

export function calculateRating(arr) {
  const ratingArr = pullRatingsFromState(arr);
  const sortedArr = ratingArr.sort((a, b) => b - a);
  let a;
  let b;
  let x;

  while (sortedArr.length > 1) {
    a = 100 - sortedArr[0];
    b = (sortedArr[1] * a) / 100;
    x = sortedArr[0] + b;
    sortedArr.splice(0, 2, x);
  }

  if (sortedArr.length === 1) {
    const lastCalcualtedRating = sortedArr[0];
    let result = roundRating(lastCalcualtedRating);

    const actualRating = Number(parseFloat(lastCalcualtedRating).toFixed(2));
    if (result > 100) {
      result = 100;
    }
    return [result, actualRating];
  }
  return [undefined, undefined];
}
// calculateRating will return array with two elements. first element in array is rounded rating
// and second element is the actual rating

// this is a validator to check if there are at least two ratings
export function shouldCalculate(ratingsArr) {
  const checkIfTwo = ratingsArr;
  const returnArr = [];
  checkIfTwo.forEach(e => {
    if (typeof e === 'number') {
      returnArr.push(e);
    }
  });
  if (returnArr.length >= 2) {
    return true;
  }
  return false;
}
