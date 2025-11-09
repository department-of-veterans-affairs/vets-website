import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import { Provider } from 'react-redux';

import formConfig from '@bio-aquia/21-0779-nursing-home-information/config/form';
import {
  TITLE,
  SUBTITLE,
} from '@bio-aquia/21-0779-nursing-home-information/constants';
import { IntroductionPage } from '@bio-aquia/21-0779-nursing-home-information/containers/introduction-page';

const createMockStore = (overrides = {}) => ({
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
        ...overrides.user?.profile,
      },
      ...overrides.user,
    },
    form: {
      formId: formConfig.formId,
      loadedStatus: 'success',
      savedStatus: '',
      loadedData: {
        metadata: {},
      },
      data: {},
      ...overrides.form,
    },
    scheduledDowntime: {
      globalDowntime: null,
      isReady: true,
      isPending: false,
      serviceMap: { get() {} },
      dismissedDowntimeWarnings: [],
      ...overrides.scheduledDowntime,
    },
    ...overrides,
  }),
  subscribe: () => {},
  dispatch: () => {},
});

const defaultRoute = {
  path: 'introduction',
  pageList: [],
  formConfig,
};

const renderIntroductionPage = (props = {}, storeOverrides = {}) => {
  const mockStore = createMockStore(storeOverrides);
  return render(
    <Provider store={mockStore}>
      <IntroductionPage route={defaultRoute} {...props} />
    </Provider>,
  );
};

describe('IntroductionPage', () => {
  it('should render without crashing', () => {
    const { container } = renderIntroductionPage();
    expect(container).to.exist;
  });

  it('should display the correct title and subtitle', () => {
    const { getByText } = renderIntroductionPage();
    expect(getByText(TITLE)).to.exist;
    expect(getByText(SUBTITLE)).to.exist;
  });

  it('should display key information sections', () => {
    const { getByText } = renderIntroductionPage();
    expect(getByText('What to know before you fill out this form')).to.exist;
    expect(getByText('What is a qualified extended care facility?')).to.exist;
  });

  it('should display required information list', () => {
    const { getByText } = renderIntroductionPage();
    expect(getByText('Social Security number or VA file number')).to.exist;
    expect(getByText('Date of birth')).to.exist;
    expect(getByText('Level of care at the facility')).to.exist;
    expect(getByText('Medicaid status')).to.exist;
    expect(getByText('Monthly out of pocket cost')).to.exist;
  });

  it('should show verify identity prompt when user is logged in but not verified', () => {
    const { container } = renderIntroductionPage(
      {},
      {
        user: {
          login: { currentlyLoggedIn: true },
          profile: { loa: { current: 1 }, verified: false },
        },
      },
    );
    expect(container).to.exist;
  });

  it('should render OMB information', () => {
    const { container } = renderIntroductionPage();
    const ombInfo = container.querySelector('va-omb-info');
    expect(ombInfo).to.exist;
    expect(ombInfo).to.have.attribute('res-burden', '10');
    expect(ombInfo).to.have.attribute('omb-number', '2900-0652');
    expect(ombInfo).to.have.attribute('exp-date', '09/30/2026');
  });

  it('should include link to learn more about nursing homes', () => {
    const { container } = renderIntroductionPage();
    const link = container.querySelector(
      'va-link[href="/pension/aid-attendance-housebound/"]',
    );
    expect(link).to.exist;
  });
});
