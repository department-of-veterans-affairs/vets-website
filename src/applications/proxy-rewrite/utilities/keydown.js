export const keyDownHandler = (event, callback, arg = null) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    callback(arg);
  }
};
