import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import VeteranDetails from '../../components/VeteranDetails';

describe('VeteranDetails', () => {
  it('renders with first, middle and last name', () => {
    const mockStore = configureStore([]);
    const initialState = {
      user: {
        profile: {
          dob: '1950-10-04',
          gender: 'M',
          ssn: '123-12-1234',
          userFullName: {
            first: 'MARK',
            middle: 'TUX',
            last: 'POLARBEAR',
            suffix: 'JR.',
          },
          vaFileNumber: '2312311',
        },
      },
    };

    const tree = render(
      <Provider store={mockStore(initialState)}>
        <VeteranDetails />
      </Provider>,
    );

    tree.getByText('This is the personal information we have on file for you.');
    tree.getByText('MARK TUX POLARBEAR, JR.');
    tree.getByText('Date of birth: October 4, 1950', { exact: false });
    tree.getByText('Gender: Male', { exact: false });
  });

  // below added for coverage
  it('renders with last name only', () => {
    const mockStore = configureStore([]);
    const initialState = {
      user: {
        profile: {
          dob: '1950-10-04',
          gender: 'M',
          userFullName: {
            last: 'POLARBEAR',
          },
        },
      },
    };
    const tree = render(
      <Provider store={mockStore(initialState)}>
        <VeteranDetails />
      </Provider>,
    );

    tree.getByText('POLARBEAR');
  });

  it('renders with first and middle, no dob', () => {
    const mockStore = configureStore([]);
    const initialState = {
      user: {
        profile: {
          gender: 'M',
          userFullName: {
            first: 'MARK',
            middle: 'TUX',
          },
        },
      },
    };
    const tree = render(
      <Provider store={mockStore(initialState)}>
        <VeteranDetails />
      </Provider>,
    );

    tree.getByText('MARK TUX');
  });
});
