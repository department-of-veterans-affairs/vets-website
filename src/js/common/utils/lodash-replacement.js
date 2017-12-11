const numIndexRE = /(.+)\[(\d+)\]$/;


/**
 * Takes a string and casts it into an array.
 * Can take strings like a.b[4].c
 *
 * @param {string} path
 * @return {Array}
 */
export function deconstructPath(path) {
  const arrayPath = path.split('.');

  // Change ['a', 'b[0]'] -> ['a', 'b', 0]
  arrayPath.forEach((e, i) => {
    // Skip the nubers we insert
    if (typeof e === 'number') {
      return;
    }

    const matches = e.match(numIndexRE);
    if (matches) {
      arrayPath[i] = matches[1];
      arrayPath.splice(i + 1, 0, parseInt(matches[2], 10));
    }
  });

  return arrayPath;
}


/**
 * Clones an object. Currently just uses Object.assign(), but we can change that later if desired.
 *
 * @param {Object} object
 * @return {Object}
 */
export function clone(object) {
  return Object.assign({}, object);
}

/**
 * Deeply clones an object. It's probably not super performant on deeply nested objects, but
 *  it gets the job done for now.
 *
 * Functions retain the same reference, but their `this` context changes like we'd expect.
 *
 * @param {Object} object
 * @return {Object}
 */
export function cloneDeep(object) {
  const newObj = clone(object);

  const cloneArrayElement = e => {
    // Deep clones arrays and objects
    if (typeof e === 'object' && e !== null) {
      return cloneDeep(e);
    }

    return e;
  };

  for (const key of Object.keys(newObj)) {
    if (Array.isArray(newObj[key])) {
      newObj[key] = newObj[key].slice().map(cloneArrayElement);
    } else if (typeof newObj[key] === 'object') {
      newObj[key] = cloneDeep(newObj[key]);
    }
  }

  return newObj;
}


/**
 * Gets a the value at the end of the path.
 *
 * @param {Object} object
 * @param {Array|string} path
 * @param {*} [defaultValue]
 * @return {*}
 */
export function get(object, path, defaultValue) {
  const arrayPath = Array.isArray(path) ? path : deconstructPath(path);
  let currentValue = object;

  for (let i = 0; i < arrayPath.length; i++) {
    if (currentValue[arrayPath[i]]) {
      currentValue = currentValue[arrayPath[i]];
    } else {
      return defaultValue;
    }
  }

  return (typeof currentValue !== 'undefined') ? currentValue : defaultValue;
}


/**
 * Sets the value at the end of the path, creating the appropriate objects along the way if needed.
 *
 * @param {Obect} object
 * @param {Array|string} path
 * @param {*} value
 * @return {Object} A new object with the appropriate value set
 */
// export function set(object, path, value) {
//   const arrayPath = Array.isArray(path) ? path : deconstructPath(path);
//   // The use of cloneDeep here could really slow it down; perf needed
//   const newObj = cloneDeep(object);
// 
//   for (let i = 0; i < arrayPath.length; i++) {
//   }
// }
