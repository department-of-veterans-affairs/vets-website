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

    ReactDOM.render(
      <>
        <va-alert
          close-btn-aria-label="Close notification"
          status="info"
          visible
        >
          <h3 slot="headline">
            This chatbot won’t be available after May 15, 2022
          </h3>
          <div>
            Read our coronavirus FAQs for answers to your questions about
            COVID-19 and your VA benefits and services.
          </div>
          <a href="https://www.va.gov/coronavirus-veteran-frequently-asked-questions/">
            Go to our coronavirus FAQs page
          </a>
        </va-alert>
        <ChatbotWrapper store={store} />
      </>,
      root,
    );
  }
};
