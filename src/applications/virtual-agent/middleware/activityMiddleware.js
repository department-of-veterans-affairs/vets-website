export const activityMiddleware = () => next => card => {
  if (card.activity.type === 'trace') {
    return false;
  }

  return next(card);
};
