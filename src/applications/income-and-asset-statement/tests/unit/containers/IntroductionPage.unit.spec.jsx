import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import IntroductionPage from '../../../containers/IntroductionPage';
import formConfig from '../../../config/form';

const getData = ({ loggedIn = true } = {}) => ({
  props: {
    route: {
      formConfig,
      pageList: [{ path: '/introduction' }, { path: '/next', formConfig }],
    },
  },
  mockStore: {
    getState: () => ({
      user: {
        login: {
          currentlyLoggedIn: loggedIn,
        },
        profile: {
          savedForms: [],
          prefillsAvailable: [],
          verified: false,
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
    }),
    subscribe: () => {},
    dispatch: () => {},
  },
});

describe('<IntroductionPage />', () => {
  it('should render', () => {
    const { props, mockStore } = getData();
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    expect($('h1', container)).to.exist;
    expect($('h1', container).textContent).to.eql(
      'Submit income and asset statement to support your claim',
    );
  });

  it('should show DIC eligibility link when not logged in', () => {
    const { props, mockStore } = getData({ loggedIn: false });
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    expect(container.innerHTML).to.include(
      'Find out if you’re eligible for VA Dependency and Indemnity Compensation',
    );
  });

  it('should not show DIC eligibility link when logged in', () => {
    const { props, mockStore } = getData({ loggedIn: true });
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    expect(container.innerHTML).to.not.include(
      'Find out if you’re eligible for VA Dependency and Indemnity Compensation',
    );
  });

  it('should render SaveInProgressIntro start button text', () => {
    const { props, mockStore } = getData();
    const { getByText } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    expect(getByText('Start the Income and Asset Statement application')).to
      .exist;
  });

  it('should render the OMB info element', () => {
    const { props, mockStore } = getData();
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    expect(container.querySelector('va-omb-info')).to.exist;
  });

  it('should render the logged-in version of content (no accordion)', () => {
    const { props, mockStore } = getData({ loggedIn: true });
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    expect(container.querySelector('va-accordion')).to.not.exist;
    expect(container.innerHTML).to.include(
      'Your spouse (unless you live apart, and you are estranged, and you do not contribute to your spouse’s support)',
    );
  });

  it('should render the accordion for logged-out users', () => {
    const { props, mockStore } = getData({ loggedIn: false });
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    expect(container.querySelector('va-accordion')).to.exist;
    expect(container.innerHTML).to.include('If you’re the Veteran');
  });
});
