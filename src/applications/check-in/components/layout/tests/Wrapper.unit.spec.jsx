import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { axeCheck } from 'platform/forms-system/test/config/helpers';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../../utils/i18n/i18n';
import { scheduledDowntimeState } from '../../../tests/unit/utils/initState';
import Wrapper from '../Wrapper';

describe('Wrapper component', () => {
  let store;
  const initState = {
    checkInData: {
      app: 'PreCheckIn',
    },
    ...scheduledDowntimeState,
  };
  const middleware = [];
  const mockStore = configureStore(middleware);
  beforeEach(() => {
    store = mockStore(initState);
  });
  it('Wrapper passes axeCheck', () => {
    axeCheck(
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <Wrapper>
            <p>test</p>
          </Wrapper>
        </I18nextProvider>
      </Provider>,
    );
  });
  it('renders the passed in page title', () => {
    const { getByText } = render(
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <Wrapper pageTitle="Test Title">
            <p>test</p>
          </Wrapper>
        </I18nextProvider>
      </Provider>,
    );
    expect(getByText('Test Title')).to.exist;
  });
});
