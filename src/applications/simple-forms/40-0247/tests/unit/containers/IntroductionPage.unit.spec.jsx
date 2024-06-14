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

describe('IntroductionPage', () => {
  let container;

  beforeEach(() => {
    const { container: c } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    container = c;
  });

  it('should render', () => {
    expect(container).to.exist;
  });

  it('should render v3-web-component process-list', () => {
    expect(container.querySelector('va-process-list[uswds]')).to.exist;
    expect(container.querySelector('va-process-list-item[header]')).to.exist;
  });

  it('should not render regular sign-in alert', () => {
    expect(container.querySelector('.schemaform-sip-alert')).to.not.exist;
  });

  it('should render no-auth start-link', () => {
    expect(container.querySelector('.no-auth-start-link')).to.exist;
  });
});
