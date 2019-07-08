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

export function canCalculate(ratings) {
  return ratings.filter(r => !!r).length >= 2;
}
