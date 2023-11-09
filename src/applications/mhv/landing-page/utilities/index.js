const getHostname = href => {
  let result;
  try {
    result = new URL(href).hostname;
  } catch {
    result = 'localhost';
  }
  return result;
};

export { getHostname };
