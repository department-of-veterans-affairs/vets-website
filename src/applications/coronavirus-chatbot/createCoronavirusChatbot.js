import React from 'react';
import ReactDOM from 'react-dom';
import './sass/coronavirus-chatbot.scss';

export default async (store, widgetType) => {
  // Derive the element to render our widget.
  const root = document.querySelector(`[data-widget-type="${widgetType}"]`);
  if (root) {
    const {
      ChatbotWrapper,
    } = await import(/* webpackChunkName: "coronavirus-chatbot" */ './components/ChatbotWrapper');
    ReactDOM.render(<ChatbotWrapper store={store} />, root);
  }
};
