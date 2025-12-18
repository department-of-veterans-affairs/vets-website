import React from 'react';

let createDirectLine;
let createStore;
let Components;

/**
 * This module is used to create the web chat framework for the virtual agent.
 * In the test environment, it returns a mock web chat framework to avoid module loading errors
 * that occur when the botframework-webchat package is imported during test execution.
 * Specifically, importing botframework-webchat in tests causes a syntax error due to untranspiled JSX in the package.
 * In production environment, it returns the real web chat framework.
 */

if (process.env.NODE_ENV === 'test') {
  createDirectLine = () => Promise.resolve({});
  createStore = () => Promise.resolve({});
  Components = {
    BasicWebChat: () => <div>BasicWebChat</div>,
    Composer: () => <div>Composer</div>,
  };
} else {
  const WebChatModule = require('botframework-webchat');
  createDirectLine = WebChatModule.createDirectLine;
  createStore = WebChatModule.createStore;
  Components = WebChatModule.Components;
}

export default { createDirectLine, createStore, Components };
