import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import formConfig from '../../config/form';
import IntroductionPage from '../../containers/IntroductionPage';

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

  it('should render form title', () => {
    const { getByTestId } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    // Ensure FormTitle is present by checking the h1 text rendered by it
    const h1 = getByTestId('form-title');
    expect(h1?.textContent).to.contain(
      'Apply for the Approval of a Program in a Foreign Country',
    );
  });

  it('should render process list with four items', () => {
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    expect(container.querySelectorAll('va-process-list').length).to.equal(1);
    expect(container.querySelectorAll('va-process-list-item').length).to.equal(
      4,
    );
  });

  it('should render privacy accordions', () => {
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    expect(container.querySelector('va-accordion')).to.exist;
    const item = container.querySelector(
      'va-accordion-item[header="View Privacy Act Statement"]',
    );
    expect(item).to.exist;
  });
});
