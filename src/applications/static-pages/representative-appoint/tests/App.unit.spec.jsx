import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import configureStore from 'redux-mock-store';
import App from '../components/App';

const mockStore = configureStore([]);

describe('<App />', () => {
  it('renders new landing content when show is true', () => {
    const initialState = {
      featureToggles: {
        appointARepresentativeEnableFrontend: true,
      },
    };
    const store = mockStore(initialState);

    const { container } = render(
      <Provider store={store}>
        <App />
      </Provider>,
    );

    expect(container.textContent).to.include(
      'Use our online tool to fill out your form.',
    );
    expect(container.textContent).to.not.include(
      'Fill out one of the PDF forms listed here.',
    );
  });

  it('renders old landing content when show is false', () => {
    const initialState = {
      featureToggles: {
        appointARepresentativeEnableFrontend: false,
      },
    };
    const store = mockStore(initialState);

    const { container } = render(
      <Provider store={store}>
        <App />
      </Provider>,
    );

    expect(container.textContent).to.include(
      'Fill out one of the PDF forms listed here.',
    );
    expect(container.textContent).to.not.include(
      'Use our online tool to fill out your form.',
    );
  });
});
