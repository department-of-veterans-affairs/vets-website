import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import DebtLettersSummary from '../components/DebtLettersSummary';

describe('DebtLettersSummary', () => {
  it('renders correct summary component', () => {
    const fakeStore = {
      getState: () => ({
        featureToggles: {
          debtLettersShowLetters: true,
        },
        user: {
          login: {
            currentlyLoggedIn: true,
          },
        },
        debtLetters: {
          isFetching: false,
          isVBMSError: false,
          isError: false,
          debts: [],
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    };
    const wrapper = render(
      <Provider store={fakeStore}>
        <BrowserRouter>
          <DebtLettersSummary />
        </BrowserRouter>
      </Provider>,
    );
    expect(wrapper.getByTestId('current-va-debt')).to.exist;
    wrapper.unmount();
  });
});
