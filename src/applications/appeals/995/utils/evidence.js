export const getIndex = (data, testingIndex) => {
  // get index from url '/{path}?index={index}' or testingIndex
  const searchIndex = new URLSearchParams(window.location.search);
  let index = parseInt(searchIndex.get('index') || testingIndex || '0', 10);
  if (Number.isNaN(index) || index > data.length) {
    index = data.length;
  }
  return index;
};
