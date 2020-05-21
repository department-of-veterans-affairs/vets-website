import React from 'react';
import ReactDOM from 'react-dom';
import './sass/coronavirus-chatbot.scss';
import { ChatbotPage } from './components/ChatbotPage';

export default (store, widgetType) => {
  // Derive the element to render our widget.
  const root = document.querySelector(`[data-widget-type="${widgetType}"]`);

  // Escape early if no element was found.
  if (!root) {
    return;
  }

  ReactDOM.render(<ChatbotPage store={store} />, root);
};
