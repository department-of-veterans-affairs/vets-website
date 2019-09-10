// "Long" log.
function llog(item) {
  // eslint-disable-next-line no-console
  console.dir(item, { depth: null, maxArrayLength: null });
}

function getArrayDepth(arr) {
  const counter = curArr =>
    curArr.children[0] ? Math.max(...curArr.children.map(counter)) + 1 : 0;
  return counter(arr);
}

module.exports = {
  llog,
  getArrayDepth,
};
