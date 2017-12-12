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

  // Turns out it's just a wee bit faster to use a named function over an anonymous one
  const decunstruct = (e, i) => {
    // Skip the nubers we insert
    if (typeof e === 'number') {
      return;
    }

    const matches = e.match(numIndexRE);
    if (matches) {
      arrayPath[i] = matches[1];
      arrayPath.splice(i + 1, 0, parseInt(matches[2], 10));
    }
  };

  // Change ['a', 'b[0]'] -> ['a', 'b', 0]
  arrayPath.forEach(decunstruct);

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
    if (typeof currentValue[arrayPath[i]] !== 'undefined') {
      currentValue = currentValue[arrayPath[i]];
    } else {
      return defaultValue;
    }
  }

  return (typeof currentValue !== 'undefined') ? currentValue : defaultValue;
}


/**
 * Same as `set`, but uses the level param to determine when to clone and give a more helpful error message.
 *
 * @param {Obect} object
 * @param {Array|string} path
 * @param {*} value
 * @param {Number} level  How many times we've recursed
 * @return {Object} A new object with the appropriate value set
 */
function baseSet(object, path, value, level = 0) {
  const arrayPath = Array.isArray(path) ? path : deconstructPath(path);

  if (!arrayPath.length) {
    // We're at the end of our path; time to assign
    return value;
  }

  // Only clone the whole object once
  let newObj = object;
  if (level === 0) {
    newObj = cloneDeep(object);
  }

  const pathSegment = arrayPath.shift();

  // Handle a path that doesn't exist
  if (typeof newObj[pathSegment] === 'undefined') {
    // The type of this element depends on the next path chunk
    switch (typeof pathSegment) {
      case 'string':
        newObj[pathSegment] = {};
        break;
      case 'number':
        // The array should be big enough to get whatever index we're looking for
        newObj[pathSegment] = new Array(pathSegment + 1);
        break;
      default:
        throw new Error(`Unrecognized path element type: ${typeof pathSegment}. Expected string or number. arrayPath[${level}] contains ${pathSegment}.`);
    }
  }

  newObj[pathSegment] = baseSet(newObj[pathSegment], arrayPath, value, level + 1);

  return newObj;
}


/**
 * Sets the value at the end of the path, creating the appropriate objects along the way if needed.
 * Separate from `baseSet` to not expose the level param.
 *
 * @param {Obect} object
 * @param {Array|string} path
 * @param {*} value
 * @return {Object} A new object with the appropriate value set
 */
export function set(object, path, value) {
  return baseSet(object, path, value, 0);
}
