export function getRatings(disabilities) {
  return disabilities.map(disability => disability.rating);
}

export function calculateRating(disabilities) {
  const ratings = getRatings(disabilities);
  const ratingsSortedDesc = ratings.sort((a, b) => b - a);

  const combinedRating = ratingsSortedDesc.reduce(
    (currentCombinedRating, nextRating) => {
      if (!currentCombinedRating) return nextRating;

      const a = 100 - currentCombinedRating;
      const b = nextRating * (a / 100);
      const nextCombinedRating = currentCombinedRating + b;

      return Math.round(nextCombinedRating);
    },
    null,
  );

  const combinedRatingRounded = Math.round(combinedRating / 10) * 10;

  return [combinedRatingRounded, combinedRating];
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
