/**
 * MSW Adapter
 *
 * This adapter provides a consistent API across MSW v1 and v2, allowing tests to
 * run in both Node 14 and Node 22 environments without maintaining separate code paths.
 *
 * MSW v1 uses the rest.* API with (req, res, ctx) handler pattern
 * MSW v2 uses the http.* API with HttpResponse factory pattern
 *
 * IMPORTANT: In MSW v2, there should be only ONE server instance running at a time.
 * The global server is started in mocha-setup.js. Tests should use the shared server
 * via getSharedServer() and add handlers with server.use() instead of creating
 * new server instances.
 */

let mswVersion = 2;
let mswModule;

try {
  // Try to import MSW v2 modules
  mswModule = require('msw');
  // Verify it's v2 by checking for HttpResponse
  if (!mswModule.HttpResponse) {
    mswVersion = 1;
  }
} catch (e) {
  // If HttpResponse import fails, fall back to v1
  mswVersion = 1;
  mswModule = require('msw');
}

// Reference to the shared MSW server
// In MSW v2, mocha-setup.js registers its server here via setGlobalServer()
let sharedServer = null;

/**
 * Register the global MSW server instance
 * Called by mocha-setup.js to share its server with tests using the adapter
 */
export function setGlobalServer(server) {
  sharedServer = server;
}

/**
 * Get the shared MSW server instance
 * Returns the server registered by mocha-setup.js
 */
function getGlobalServer() {
  if (mswVersion === 2 && !sharedServer) {
    // Server not registered yet - create a fallback
    // This shouldn't happen in normal test runs since mocha-setup.js runs first
    const { setupServer } = require('msw/node');
    sharedServer = setupServer();
  }
  return sharedServer;
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
// In MSW v2, this returns the shared server from mocha-setup.js to avoid conflicts
export const setupServer = (...handlers) => {
  if (mswVersion === 2) {
    const server = getGlobalServer();

    // Add any initial handlers provided
    if (handlers.length > 0) {
      server.use(...handlers);
    }

    // Track handlers added by this setupServer call so resetHandlers works correctly
    const initialHandlers = [...handlers];

    // Return a wrapper that integrates with mocha-setup.js
    return {
      listen: () => {
        // No-op: mocha-setup.js already calls server.listen() in beforeAll
      },
      close: () => {
        // No-op: mocha-setup.js handles this in afterAll
        // This prevents tests from closing the server prematurely
      },
      use: (...h) => server.use(...h),
      resetHandlers: (...h) => {
        // If no handlers provided, reset to this setupServer's initial handlers
        // This restores handlers to what this describe block set up
        if (h.length === 0 && initialHandlers.length > 0) {
          server.resetHandlers(...initialHandlers);
        } else {
          server.resetHandlers(...h);
        }
      },
      events: server.events,
    };
  }
  return require('msw/node').setupServer(...handlers);
};

/**
 * Get the shared MSW server instance
 * Use this instead of setupServer() when you need to add handlers to existing server
 */
export const getSharedServer = () => getGlobalServer();

// Re-export original MSW methods for advanced use cases
export const msw = mswModule;
