import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { expect } from 'chai';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import PersonalInformation from '../../../components/PersonalInformation';

const initialData = {
  user: {
    profile: {
      userFullName: {
        first: 'Michael',
        middle: 'Thomas',
        last: 'Wazowski',
        suffix: 'Esq.',
      },
      dob: '1990-02-03',
    },
  },
  data: {
    formData: {
      data: {
        attributes: {
          claimant: {
            firstName: 'john',
            middleName: 'doe',
            lastName: 'smith',
            dateOfBirth: '1990-01-01',
          },
        },
      },
    },
  },
};

describe('PersonalInformation', () => {
  const middleware = [thunk];
  const mockStore = configureStore(middleware);

  it('should render with data', () => {
    const { container } = render(
      <Provider store={mockStore(initialData)}>
        <PersonalInformation />
      </Provider>,
    );

    expect($('.personal-info-header', container)).to.exist;
  });
});
