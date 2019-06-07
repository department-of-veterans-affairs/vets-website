/* eslint-disable no-console */
// helper function to round to nearest 10
function roundRating(num) {
  const ratingWithDecimal = Number.parseFloat(num).toFixed(0.1);
  return Math.round(ratingWithDecimal / 10) * 10;
}

// helper to remove % sign from rating
// eslint-disable-next-line no-unused-vars
function checkForPercent(e) {
  const element = String(e).split('');
  for (let i = element.length - 1; i >= 0; i--) {
    if (element[i] === '%') {
      element.splice(i, 1);
    }
  }
  // eslint-disable-next-line radix
  return parseInt(element.join(''));
}

function pullRatingsFromState(arr) {
  const allRatings = [];
  arr.forEach(e => {
    allRatings.push(e.rating);
  });
  return allRatings;
}

export function validateValue(e) {
  if (!/^[0-9]+$/.test(e)) {
    return false;
  }
  return true;
}

// eslint-disable-next-line consistent-return
export function calculateRating(arr) {
  const ratingArr = pullRatingsFromState(arr);
  // const checkIfRatingsAreNumbers = isNaN(ratingArr);

  const sortedArr = ratingArr.sort((a, b) => b - a);
  // eslint-disable-next-line one-var
  let a, b, x;

  console.log(`sortedArr: ${sortedArr}`);
  while (sortedArr.length > 1) {
    console.log(sortedArr);
    a = 100 - sortedArr[0];
    console.log('100 - sortedArr[0]', 100 - sortedArr[0]);
    b = (sortedArr[1] * a) / 100;
    console.log('(sortedArr[1] * a) / 100', (sortedArr[1] * a) / 100);
    x = sortedArr[0] + b;
    console.log('sortedArr[0] + b', sortedArr[0] + b);
    sortedArr.splice(0, 2, x);
    console.log(sortedArr);
  }

  if (sortedArr.length === 1) {
    const lastCalcualtedRating = sortedArr[0];
    let result = roundRating(lastCalcualtedRating);
    // eslint-disable-next-line radix
    const actualRating = parseInt(
      Number.parseFloat(lastCalcualtedRating).toFixed(0.1),
    );
    if (result > 100) {
      result = 100;
    }
    return [result, actualRating];
  }
}
// will return array with two elements. first element in array is rounded rating
// and second element is the actual rating

export function setFocus(selector) {
  const el =
    typeof selector === 'string' ? document.querySelector(selector) : selector;
  if (el) {
    el.setAttribute('tabIndex', -1);
    el.focus();
  }
}
