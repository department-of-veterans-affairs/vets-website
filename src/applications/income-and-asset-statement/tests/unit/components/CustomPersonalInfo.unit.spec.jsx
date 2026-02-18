import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { expect } from 'chai';

import CustomPersonalInfo from '../../../components/CustomPersonalInfo';

describe('CustomPersonalInfo Component', () => {
  const middleware = [thunk];
  const mockStore = configureStore(middleware);
  const store = mockStore({
    user: {
      profile: {
        userFullName: { first: 'John', last: 'Doe' },
        dob: '2000-01-01',
      },
    },
  });
  const props = {
    data: {
      veteranSsnLastFour: '1234',
      vaFileNumberLastFour: '5678',
    },
    goBack: () => {},
    goForward: () => {},
    NavButtons: () => null,
  };

  it('renders PersonalInformation component', () => {
    const { container } = render(
      <Provider store={store}>
        <CustomPersonalInfo {...props} />
      </Provider>,
    );
    expect(container.querySelector('va-card')).to.exist;
  });

  it('should have a form wrapping the h1 for focus', () => {
    const { container } = render(
      <Provider store={store}>
        <CustomPersonalInfo {...props} />
      </Provider>,
    );

    const h1 = container.querySelector('h1');
    expect(h1).to.exist;
    expect(h1.parentElement.tagName).to.equal('FORM');
  });
});
