import React from 'react';
import { Provider } from 'react-redux';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import formConfig from '../../config/form';
import IntroductionPage from '../../containers/IntroductionPage';

const props = {
  route: {
    path: 'introduction',
    pageList: [
      { path: '/introduction', title: 'Introduction' },
      { path: '/first-page', title: 'First Page' },
    ],
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

describe('22-0839 <IntroductionPage>', () => {
  it('should render form title', () => {
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    // Ensure FormTitle is present by checking the h1 text rendered by it
    const h1 = container.querySelector('h1');
    expect(h1?.textContent).to.contain(
      'Submit a Yellow Ribbon Program agreement request',
    );
  });

  it('should render info alert', () => {
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    const banner = container.querySelector('va-alert');
    expect(banner).to.exist;
    expect(banner.getAttribute('status')).to.equal('info');
  });

  it('should render the correct section headers', () => {
    const { getByText } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );

    expect(getByText('What to know before you fill out this form')).to.exist;
    expect(getByText('How do I submit my Yellow Ribbon Agreement?')).to.exist;
  });

  it('should render process list with three items', () => {
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    expect(container.querySelectorAll('va-process-list').length).to.equal(1);
    expect(container.querySelectorAll('va-process-list-item').length).to.equal(
      3,
    );
  });

  it('should render Start the form header when logged in', () => {
    const loggedInStore = {
      ...mockStore,
      getState: () => ({
        ...mockStore.getState(),
        user: {
          ...mockStore.getState().user,
          login: {
            currentlyLoggedIn: true,
          },
        },
      }),
    };

    const { container } = render(
      <Provider store={loggedInStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    const headers = Array.from(container.querySelectorAll('h2')).map(h =>
      h.textContent?.trim(),
    );
    expect(headers.join(' | ')).to.contain('Start the form');
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

  it('should hide the Privacy Act button inside va-omb-info', async () => {
    const vaOmbInfo = document.createElement('va-omb-info');
    const privacyButton = document.createElement('va-button');
    privacyButton.setAttribute('secondary', '');
    vaOmbInfo.appendChild(privacyButton);
    document.body.appendChild(vaOmbInfo);

    const { unmount } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );

    await waitFor(() => {
      expect(privacyButton.getAttribute('style') || '').to.contain(
        'display:none',
      );
    });

    unmount();
    document.body.removeChild(vaOmbInfo);
  });
});
