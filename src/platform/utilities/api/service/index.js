const METHODS = {
  get: 'GET',
  post: 'POST',
  delete: 'DELETE',
  patch: 'PATCH',
};

const host = '/v0';

export function constructUrl(method, chunks, arg = null) {
  let url = `${host}/${chunks.join('/')}`;
  if (typeof arg === 'number') {
    url += `/${arg}`;
  } else if (arg != null && typeof arg === 'object' && method === METHODS.get) {
    // build query param string
    const params = [];
    Object.entries(arg).forEach(([key, value]) => {
      if (value != null) {
        params.push(`${key}=${value}`);
      }
    });
    if (params.length) {
      url += `?${params.join('&')}`;
    }
  }
  return url;
}

export function constructOptions(method, arg = null) {
  const options = {
    method,
  };
  if ([METHODS.post, METHODS.patch].includes(method) && arg) {
    options.body = JSON.stringify(arg);
  }
  return options;
}

/**
 * Make a request to the instance url
 * Uses default fetch options
 * */
export function makeRequest([url, options]) {
  return fetch(url, {
    ...options,
  });
}

/**
 * Handle the API response.
 * Returns JSON if everything is ok, otherwise throws errors
 * */
export function handleResponse(response) {
  if (response.ok) {
    return response.json();
  }

  throw new Error(`There was an error connecting to ${response.url}`);
}

function sendFetch(arg = null) {
  const { method, chunks } = this;

  return Promise.all([
    constructUrl(method, chunks, arg),
    constructOptions(method, arg),
  ])
    .then(makeRequest)
    .then(handleResponse.bind(this));
}

const resourceHandler = {
  get(obj, prop) {
    this.chunks.push(prop); // keep accumulating the path chunks

    return new Proxy(sendFetch.bind({ ...this }), resourceHandler);
  },

  apply(target, _, args) {
    return target(...args);
  },
};

const methodHandler = {
  get(obj, prop) {
    if (!(prop in METHODS)) {
      throw new Error(
        `Unsupported HTTP method: ${prop}.  Try one of: ${Object.keys(
          METHODS,
        ).join('/')} instead`,
      );
    }
    return new Proxy(
      {},
      Object.assign(resourceHandler, {
        method: METHODS[prop],
        chunks: [],
      }),
    );
  },
};

export default new Proxy({}, methodHandler);
