import React from 'react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import StaticClaimant from '../../../config/chapters/claimant-information/staticClaimantComponent';

describe('Chapter 36 - Static Claimant Information', () => {
  const createStore = ({ gender = 'M', dob } = {}) => ({
    getState: () => ({
      user: {
        profile: { gender, dob, userFullName: { first: 'John', last: 'Doe' } },
      },
    }),
    dispatch: () => {},
    subscribe: () => {},
  });

  it('should render', () => {
    const store = createStore();
    const { queryByText } = render(
      <Provider store={store}>
        <StaticClaimant />
      </Provider>,
    );
    expect(queryByText('John Doe')).to.not.be.null;
  });

  it('should display appropriate gender', () => {
    const store = createStore({ gender: 'F' });
    const { queryByText } = render(
      <Provider store={store}>
        <StaticClaimant />
      </Provider>,
    );
    expect(queryByText('Gender: Female')).to.not.be.null;
  });

  it('should display the correct date', () => {
    const store = createStore({ dob: '12-29-1990' });
    const { queryByText } = render(
      <Provider store={store}>
        <StaticClaimant />
      </Provider>,
    );
    expect(queryByText('Date of birth: December 29, 1990')).to.not.be.null;
  });
});
