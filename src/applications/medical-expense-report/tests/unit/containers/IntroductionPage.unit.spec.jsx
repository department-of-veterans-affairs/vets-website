import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import formConfig from '../../../config/form';
import IntroductionPage from '../../../containers/IntroductionPage';

const props = {
  route: {
    path: 'introduction',
    pageList: [],
    formConfig,
  },
  userLoggedIn: false,
  userIdVerified: true,
};

const mockStore = {
  getState: () => ({
    user: {
      login: {
        currentlyLoggedIn: false,
      },
      profile: {
        savedForms: [],
        prefillsAvailable: [],
        loa: {
          current: 3,
          highest: 3,
        },
        verified: true,
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

describe('IntroductionPage', () => {
  it('should render', () => {
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    expect(container).to.exist;
  });

  it('should display example expenses', () => {
    const { getByText } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );

    const expense1 = getByText('Hospital and office visits');
    const expense2 = getByText('Nursing homes and home health services');
    const expense3 = getByText('Medical supplies');
    const expense4 = getByText('Prescription and over-the-counter drugs');
    const expense5 = getByText(
      'Medical insurance premiums and Medicare deductions',
    );
    const expense6 = getByText(
      'Mileage and transportation for medical purposes',
    );

    expect(expense1).to.exist;
    expect(expense2).to.exist;
    expect(expense3).to.exist;
    expect(expense4).to.exist;
    expect(expense5).to.exist;
    expect(expense6).to.exist;
  });
});
