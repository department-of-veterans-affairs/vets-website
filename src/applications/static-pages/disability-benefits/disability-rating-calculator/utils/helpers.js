export function getRatings(disabilities) {
  return disabilities.map(disability => disability.rating);
}

export function getRatingErrorMessage(rating) {
  const isFactorOfTen = rating % 10 === 0;
  const isBelowMin = rating <= 0;
  const isBeyondMax = rating >= 100;

  if (isBeyondMax) {
    return {
      title: '100% is the maximum disability rating',
      body: 'You can’t receive a combined disability rating of more than 100%.',
    };
  }

  if (!isFactorOfTen || isBelowMin) {
    return {
      title: 'Enter a valid rating',
      body: 'Disability ratings are given in 10% increments.',
    };
  }

  return false;
}

export function calculateCombinedRating(ratings) {
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

  return {
    exact: combinedRating,
    rounded: combinedRatingRounded,
  };
}
