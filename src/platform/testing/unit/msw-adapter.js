/**
 * MSW Adapter
 *
 * This adapter provides a consistent API across MSW v1 and v2, allowing tests to
 * run in both Node 14 and Node 22 environments without maintaining separate code paths.
 *
 * MSW v1 uses the rest.* API with (req, res, ctx) handler pattern
 * MSW v2 uses the http.* API with HttpResponse factory pattern
 */

let mswVersion = 1;
let mswModule;

try {
  // Try to import MSW modules
  mswModule = require('msw');
  // Check for v2 by looking for http namespace AND HttpResponse
  if (mswModule.http && mswModule.HttpResponse) {
    mswVersion = 2;
  }
} catch (e) {
  // Fallback to v1
  mswVersion = 1;
  mswModule = require('msw');
}

/**
 * Creates a GET request handler with a consistent API
 *
 * @param {string} url - The URL to mock
 * @param {Function} handler - Response handler function
 * @returns {Object} - MSW compatible request handler
 */
export function createGetHandler(url, handler) {
  if (mswVersion === 2) {
    return mswModule.http.get(url, ({ params, request }) => {
      return handler({
        params,
        request,
      });
    });
  }

  // MSW v1
  return mswModule.rest.get(url, (req, res, ctx) => {
    const handlerResult = handler({
      params: req.params,
      request: req,
      res,
      ctx,
    });

    // If the handler returns a function (for v1), execute it with res and ctx
    if (typeof handlerResult === 'function') {
      return handlerResult(res, ctx);
    }

    return handlerResult;
  });
}

/**
 * Creates a POST request handler with a consistent API
 *
 * @param {string} url - The URL to mock
 * @param {Function} handler - Response handler function
 * @param {Object} headers - Optional headers to include in the response
 * @returns {Object} - MSW compatible request handler
 */
export function createPostHandler(url, handler) {
  if (mswVersion === 2) {
    return mswModule.http.post(url, async ({ params, request }) => {
      return handler({
        params,
        request,
      });
    });
  }

  // MSW v1
  return mswModule.rest.post(url, async (req, res, ctx) => {
    const handlerResult = handler({
      params: req.params,
      request: req,
      res,
      ctx,
    });

    // If the handler returns a function (for v1), execute it with res and ctx
    if (typeof handlerResult === 'function') {
      return handlerResult(res, ctx);
    }

    return handlerResult;
  });
}

/**
 * Creates a PUT request handler with a consistent API
 *
 * @param {string} url - The URL to mock
 * @param {Function} handler - Response handler function
 * @param {Object} headers - Optional headers to include in the response
 * @returns {Object} - MSW compatible request handler
 */
export function createPutHandler(url, handler, headers = {}) {
  if (mswVersion === 2) {
    return mswModule.http.put(url, async ({ params, request }) => {
      return handler({
        params,
        request,
        body: await request.json().catch(() => ({})),
        headers,
      });
    });
  }

  // MSW v1
  return mswModule.rest.put(url, async (req, res, ctx) => {
    // In MSW v1, we need to extract the body differently
    let body = {};
    try {
      // Get the request body if available
      body = req.body ? req.body : {};
    } catch (e) {
      // If parsing fails, use empty object
      body = {};
    }

    const handlerResult = handler({
      params: req.params,
      request: req,
      body,
      headers,
      res,
      ctx,
    });

    // If the handler returns a function (for v1), execute it with res and ctx
    if (typeof handlerResult === 'function') {
      return handlerResult(res, ctx);
    }

    return handlerResult;
  });
}

/**
 * Creates a PATCH request handler with a consistent API
 *
 * @param {string} url - The URL to mock
 * @param {Function} handler - Response handler function
 * @param {Object} headers - Optional headers to include in the response
 * @returns {Object} - MSW compatible request handler
 */
export function createPatchHandler(url, handler, headers = {}) {
  if (mswVersion === 2) {
    return mswModule.http.patch(url, async ({ params, request }) => {
      return handler({
        params,
        request,
        body: await request.json().catch(() => ({})),
        headers,
      });
    });
  }

  // MSW v1
  return mswModule.rest.patch(url, async (req, res, ctx) => {
    // In MSW v1, we need to extract the body differently
    let body = {};
    try {
      // Get the request body if available
      body = req.body ? req.body : {};
    } catch (e) {
      // If parsing fails, use empty object
      body = {};
    }

    const handlerResult = handler({
      params: req.params,
      request: req,
      body,
      headers,
      res,
      ctx,
    });

    // If the handler returns a function (for v1), execute it with res and ctx
    if (typeof handlerResult === 'function') {
      return handlerResult(res, ctx);
    }

    return handlerResult;
  });
}

/**
 * Creates a DELETE request handler with a consistent API
 *
 * @param {string} url - The URL to mock
 * @param {Function} handler - Response handler function
 * @returns {Object} - MSW compatible request handler
 */
export function createDeleteHandler(url, handler) {
  if (mswVersion === 2) {
    return mswModule.http.delete(url, ({ params, request }) => {
      return handler({
        params,
        request,
      });
    });
  }

  // MSW v1
  return mswModule.rest.delete(url, (req, res, ctx) => {
    const handlerResult = handler({
      params: req.params,
      request: req,
      res,
      ctx,
    });

    // If the handler returns a function (for v1), execute it with res and ctx
    if (typeof handlerResult === 'function') {
      return handlerResult(res, ctx);
    }

    return handlerResult;
  });
}

/**
 * Creates a JSON response with a consistent API
 *
 * @param {Object} data - JSON response body
 * @param {Object} options - Response options like status
 * @returns {Object|Function} - MSW compatible response or function
 */
export function jsonResponse(data, options = {}) {
  const status = options?.status || 200;

  if (mswVersion === 2) {
    return mswModule.HttpResponse.json(data, { status, ...options });
  }

  // For v1, we return a function that uses res and ctx from the handler
  return (res, ctx) => {
    if (data) {
      return res(ctx.status(status), ctx.json(data));
    }
    return res(ctx.status(status));
  };
}

/**
 * Creates a network error response
 *
 * @param {string} message - Error message
 * @param {number} status - Status code (for v2)
 * @returns {Object|Function} - MSW compatible error response or function
 */
export function networkError(message = '', status = 500) {
  if (mswVersion === 2) {
    return mswModule.HttpResponse.error({
      status,
      statusText: message,
    });
  }

  // For v1, we return a function that uses res
  return res => {
    return res.networkError(message);
  };
}

/**
 * Creates a text response with a consistent API
 *
 * @param {string} text - Text response body
 * @param {Object} options - Response options like status
 * @returns {Object|Function} - MSW compatible response or function
 */
export function textResponse(text, options = { status: 200 }) {
  if (mswVersion === 2) {
    return new mswModule.HttpResponse(text, options);
  }

  // For v1, we return a function that uses res and ctx
  return (res, ctx) => res(ctx.status(options.status), ctx.text(text));
}

/**
 * Creates a binary response with a consistent API
 *
 * @param {Object} data - Binary response body
 * @param {Object} options - Response options like status
 * @returns {Object|Function} - MSW compatible response or function
 */
export function binaryResponse(data, options = { status: 200 }) {
  if (mswVersion === 2) {
    return new mswModule.HttpResponse(data, options);
  }

  // For v1, we return a function that uses res and ctx
  const headers = options.headers ?? {};
  return (res, ctx) =>
    res(ctx.status(options.status), ctx.set(headers), ctx.body(data));
}

/**
 * Creates a delayed response that works with both MSW v1 and v2
 *
 * @param {Object} data - The data to return in the response
 * @param {number} delayMs - Delay in milliseconds
 * @returns {Object|Function} - MSW compatible delayed response
 */
export function delayedJsonResponse(data, delayMs = 200) {
  if (mswVersion === 2) {
    // In v2, we need to use the delay utility and return in the handler
    return async () => {
      await new Promise(resolve => setTimeout(resolve, delayMs));
      return mswModule.HttpResponse.json(data);
    };
  }

  // For v1, wrap the response function with ctx.delay
  return (res, ctx) => {
    return res(ctx.delay(delayMs), ctx.json(data));
  };
}

// Export setupServer with consistent API
export const setupServer = (...handlers) => {
  if (mswVersion === 2) {
    const { setupServer: setup } = require('msw/node');
    return setup(...handlers);
  }
  return require('msw/node').setupServer(...handlers);
};

// Re-export original MSW methods for advanced use cases
export const msw = mswModule;
