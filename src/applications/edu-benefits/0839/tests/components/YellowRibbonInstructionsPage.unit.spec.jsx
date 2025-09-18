import React from 'react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import YellowRibbonInstructionsPage from '../../components/YellowRibbonInstructionsPage';

const middleware = [thunk];
const mockStore = configureStore(middleware);

describe('YellowRibbonInstructionsPage', () => {
  it('should render heading and NeedHelp', () => {
    const initialState = {
      navigation: {
        route: {
          path: '/yellow-ribbon-instructions',
        },
      },
    };
    const store = mockStore(initialState);

    const { container, getByText } = render(
      <Provider store={store}>
        <YellowRibbonInstructionsPage />
      </Provider>,
    );

    expect(
      getByText(
        'Instructions for completing the Yellow Ribbon Program agreement',
      ),
    ).to.exist;
    expect(container.querySelector('va-need-help')).to.exist;
  });
});
