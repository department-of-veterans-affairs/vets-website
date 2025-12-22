import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { $$ } from 'platform/forms-system/src/js/utilities/ui';

import CustomPersonalInfo from '../../components/CustomPersonalInfo';

const middleware = [thunk];
const mockStore = configureStore(middleware);
const store = mockStore({
  user: {
    login: {
      currentlyLoggedIn: true,
    },
    profile: {
      userFullName: {
        first: 'John',
        middle: 'A',
        last: 'Doe',
      },
      dob: '1990-01-01',
      ssn: '123456789',
    },
  },
  form: {
    data: {},
  },
});

const props = {
  data: {},
  goBack: () => {},
  goForward: () => {},
  NavButtons: () => null,
};

describe('<CustomPersonalInfo>', () => {
  it('should render', () => {
    const { container } = render(
      <Provider store={store}>
        <CustomPersonalInfo {...props} />
      </Provider>,
    );
    expect($$('va-telephone', container).length).to.equal(2);
  });

  it('should display the user name', () => {
    const { container } = render(
      <Provider store={store}>
        <CustomPersonalInfo {...props} />
      </Provider>,
    );
    // console.log(container.innerHTML);
    expect(container.textContent).to.include('John A Doe');
    expect(container.textContent).to.include('January 1, 1990');
  });
});
