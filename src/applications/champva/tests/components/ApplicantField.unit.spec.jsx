import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import formConfig from '../../config/form';
import ApplicantField from '../../components/applicant/ApplicantField';

const props = {
  applicantName: {
    first: 'firstname',
    middle: 'middlename',
    last: 'lastname',
    suffix: 'Jr.',
  },
};

// TODO: this mock store is (probably) irrelevant. Remove/update?
const mockStore = {
  getState: () => ({
    user: {
      login: {
        currentlyLoggedIn: false,
      },
      profile: {
        savedForms: [],
        prefillsAvailable: [],
        verified: false,
        dob: '2000-01-01',
        claims: {
          appeals: false,
        },
      },
    },
    form: {
      formId: formConfig.formId,
      loadedStatus: 'success',
      savedStatus: '',
      loadedData: {
        metadata: {},
      },
      data: {},
    },
    scheduledDowntime: {
      globalDowntime: null,
      isReady: true,
      isPending: false,
      serviceMap: { get() {} },
      dismissedDowntimeWarnings: [],
    },
  }),
  subscribe: () => {},
  dispatch: () => {},
};

describe('ApplicantField', () => {
  // TODO: actually check that the applicant's name (from props)
  // are displayed in the component.
  it('should render', () => {
    const { container } = render(
      <Provider store={mockStore}>
        <ApplicantField formData={props} />
      </Provider>,
    );
    expect(container).to.exist;
  });
});
