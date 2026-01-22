import React from 'react';
// import moment from 'moment';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import { render, fireEvent } from '@testing-library/react';
import { fromUnixTime } from 'date-fns';
import { format } from 'date-fns-tz';
import sinon from 'sinon';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import { VA_FORM_IDS } from '~/platform/forms/constants';

import { SaveInProgressIntro } from '../../save-in-progress/SaveInProgressIntro';

describe('Schemaform <SaveInProgressIntro>', () => {
  const pageList = [
    {
      path: 'wrong-path',
    },
    {
      path: 'testing',
    },
  ];
  const fetchInProgressForm = () => {};
  const removeInProgressForm = () => {};
  const toggleLoginModal = () => {};

  const formConfig = {
    saveInProgress: {
      messages: {
        expired:
          'Your saved health care benefits application (10-10EZ) has expired. If you want to apply for health care benefits, please start a new application.',
      },
    },
  };

  it('should render in progress message', () => {
    const lastUpdated = 946684800;
    const user = {
      profile: {
        savedForms: [
          {
            form: VA_FORM_IDS.FORM_10_10EZ,
            metadata: {
              lastUpdated,
              expiresAt: Math.floor(Date.now() / 1000) + 2000,
            },
          },
        ],
        prefillsAvailable: [],
      },
      login: {
        currentlyLoggedIn: true,
        loginUrls: {
          idme: '/mockLoginUrl',
        },
      },
    };

    const tree = shallow(
      <SaveInProgressIntro
        saveInProgress={{ formData: {} }}
        pageList={pageList}
        formId="1010ez"
        user={user}
        fetchInProgressForm={fetchInProgressForm}
        removeInProgressForm={removeInProgressForm}
        toggleLoginModal={toggleLoginModal}
        formConfig={formConfig}
      />,
    );

    expect(
      tree
        .find('va-alert h2')
        .last()
        .text(),
    ).to.include(format(fromUnixTime(lastUpdated), "MMMM d, yyyy', at'"));

    expect(tree.find('va-alert').text()).to.contain(
      'Your application is in progress',
    );
    expect(tree.find('va-alert').text()).to.contain('will expire on');
    expect(tree.find('withRouter(FormStartControls)').exists()).to.be.true;
    expect(tree.find('withRouter(FormStartControls)').props().prefillAvailable)
      .to.be.false;
    expect(
      tree.find('withRouter(FormStartControls)').props().startPage,
    ).to.equal('testing');
    tree.unmount();
  });
  it('should render in progress message with header', () => {
    const user = {
      profile: {
        savedForms: [
          {
            form: VA_FORM_IDS.FORM_10_10EZ,
            metadata: {
              lastUpdated: 946684800,
              expiresAt: Math.floor(Date.now() / 1000) + 2000,
            },
          },
        ],
        prefillsAvailable: [],
      },
      login: {
        currentlyLoggedIn: true,
        loginUrls: {
          idme: '/mockLoginUrl',
        },
      },
    };

    const tree = shallow(
      <SaveInProgressIntro
        saveInProgress={{ formData: {} }}
        pageList={pageList}
        formId="1010ez"
        user={user}
        fetchInProgressForm={fetchInProgressForm}
        removeInProgressForm={removeInProgressForm}
        toggleLoginModal={toggleLoginModal}
        formConfig={formConfig}
        headingLevel={1}
      />,
    );
    expect(tree.find('va-alert h1').text()).to.contain(
      'Your application is in progress',
    );
    tree.unmount();
  });

  it('should pass prefills available prop', () => {
    const user = {
      profile: {
        savedForms: [
          {
            form: VA_FORM_IDS.FORM_10_10EZ,
            metadata: {
              lastUpdated: 3000,
              expiresAt: Math.floor(Date.now() / 1000) + 2000,
            },
          },
        ],
        prefillsAvailable: [VA_FORM_IDS.FORM_10_10EZ],
      },
      login: {
        currentlyLoggedIn: true,
      },
    };

    const tree = shallow(
      <SaveInProgressIntro
        saveInProgress={{ formData: {} }}
        pageList={pageList}
        formId="1010ez"
        user={user}
        fetchInProgressForm={fetchInProgressForm}
        removeInProgressForm={removeInProgressForm}
        toggleLoginModal={toggleLoginModal}
        formConfig={formConfig}
        ariaLabel="test aria-label"
        ariaDescribedby="test-id"
      />,
    );

    const formControlProps = tree.find('withRouter(FormStartControls)').props();
    expect(formControlProps.prefillAvailable).to.be.true;
    expect(formControlProps.ariaLabel).to.eq('test aria-label');
    expect(formControlProps.ariaDescribedby).to.eq('test-id');
    tree.unmount();
  });
  it('should render sign in message', () => {
    const user = {
      profile: {
        savedForms: [
          {
            form: VA_FORM_IDS.FORM_10_10EZ,
            metadata: {
              lastUpdated: 3000,
              expiresAt: Math.floor(Date.now() / 1000) + 2000,
            },
          },
        ],
        prefillsAvailable: [],
      },
      login: {
        currentlyLoggedIn: false,
        loginUrls: {
          idme: '/mockLoginUrl',
        },
      },
    };

    const tree = shallow(
      <SaveInProgressIntro
        saveInProgress={{ formData: {} }}
        pageList={pageList}
        formId="1010ez"
        user={user}
        fetchInProgressForm={fetchInProgressForm}
        removeInProgressForm={removeInProgressForm}
        toggleLoginModal={toggleLoginModal}
        formConfig={formConfig}
        ariaLabel="test aria-label"
        ariaDescribedby="test-id"
      />,
    );

    const link = tree.find('.va-button-link');
    expect(link.prop('text')).to.contain('Sign in to your account.');
    expect(tree.find('va-alert-sign-in[variant="signInOptional"]').exists()).to
      .be.true;
    expect(link.prop('aria-label')).to.eq('test aria-label');
    expect(link.prop('aria-describedby')).to.eq('test-id');
    expect(tree.find('withRouter(FormStartControls)').exists()).to.be.false;
    tree.unmount();
  });

  it('should render prefill Notification when prefill enabled and not signed in', () => {
    const prefillEnabled = true;
    const user = {
      profile: {
        savedForms: [
          {
            form: VA_FORM_IDS.FORM_10_10EZ,
            metadata: {
              lastUpdated: 3000,
              expiresAt: Math.floor(Date.now() / 1000) + 2000,
            },
          },
        ],
        prefillsAvailable: [],
      },
      login: {
        currentlyLoggedIn: false,
        loginUrls: {
          idme: '/mockLoginUrl',
        },
      },
    };

    const { container } = render(
      <SaveInProgressIntro
        saveInProgress={{ formData: {} }}
        pageList={pageList}
        prefillEnabled={prefillEnabled}
        formId="1010ez"
        user={user}
        fetchInProgressForm={fetchInProgressForm}
        removeInProgressForm={removeInProgressForm}
        toggleLoginModal={toggleLoginModal}
        formConfig={formConfig}
      />,
    );

    expect($('va-button', container).getAttribute('text')).to.contain(
      'Sign in to start your application',
    );
    expect($('a', container).textContent).to.contain(
      'Start your application without signing in',
    );
    expect($('va-alert-sign-in[variant="signInOptional"]', container)).to.exist;
  });

  it('should render message if signed in with no saved form', () => {
    const user = {
      profile: {
        savedForms: [],
        prefillsAvailable: [],
      },
      login: {
        currentlyLoggedIn: true,
      },
    };

    const tree = shallow(
      <SaveInProgressIntro
        saveInProgress={{ formData: {} }}
        pageList={pageList}
        formId="1010ez"
        user={user}
        fetchInProgressForm={fetchInProgressForm}
        removeInProgressForm={removeInProgressForm}
        toggleLoginModal={toggleLoginModal}
        formConfig={formConfig}
      />,
    );

    expect(tree.find('va-alert').text()).to.contain(
      'You can save this application in progress',
    );
    expect(tree.find('withRouter(FormStartControls)').exists()).to.be.true;
    tree.unmount();
  });

  it('should render prefill notification if signed in with no saved form and prefill available', () => {
    const user = {
      profile: {
        savedForms: [],
        prefillsAvailable: [VA_FORM_IDS.FORM_10_10EZ],
      },
      login: {
        currentlyLoggedIn: true,
      },
    };

    const tree = mount(
      <SaveInProgressIntro
        saveInProgress={{ formData: {} }}
        pageList={pageList}
        formId="1010ez"
        user={user}
        fetchInProgressForm={fetchInProgressForm}
        removeInProgressForm={removeInProgressForm}
        toggleLoginModal={toggleLoginModal}
        formConfig={{ customText: { appType: 'application' } }}
      />,
    );

    // Default heading level is 2
    expect(tree.find('va-alert h2').text()).to.equal(
      'We’ve prefilled some of your information',
    );

    const alertText = tree.find('va-alert').text();

    expect(alertText).to.contain(
      'Since you’re signed in, we can prefill part of your application based on your profile details. You can also save your application in progress and come back later to finish filling it out.',
    );

    expect(tree.find('withRouter(FormStartControls)').exists()).to.be.true;
    tree.unmount();
  });

  it('should over-ride the default retentionPeriod prop when one supplied', () => {
    const prefillEnabled = true;
    const user = {
      profile: {
        savedForms: [
          {
            form: VA_FORM_IDS.FORM_10_10EZ,
            metadata: {
              lastUpdated: 3000,
              expiresAt: Math.floor(Date.now() / 1000) + 2000,
            },
          },
        ],
        prefillsAvailable: [],
      },
      login: { currentlyLoggedIn: false },
    };

    const { container } = render(
      <SaveInProgressIntro
        saveInProgress={{ formData: {} }}
        pageList={pageList}
        prefillEnabled={prefillEnabled}
        formId="1010ez"
        user={user}
        fetchInProgressForm={fetchInProgressForm}
        removeInProgressForm={removeInProgressForm}
        toggleLoginModal={toggleLoginModal}
        retentionPeriod="1 year"
        formConfig={formConfig}
      />,
    );

    const signInAlertRetentionPeriod = container
      .querySelector('va-alert-sign-in')
      .getAttribute('time-limit');

    expect(signInAlertRetentionPeriod).to.eql('1 year');
    expect(signInAlertRetentionPeriod).to.not.eql('60 days');
    expect($('va-alert-sign-in[variant="signInOptional"]', container)).to.exist;
  });

  it('should render loading indicator while profile is loading', () => {
    const user = {
      profile: {
        savedForms: [
          {
            form: VA_FORM_IDS.FORM_10_10EZ,
            metadata: {
              lastUpdated: 3000,
              expiresAt: Math.floor(Date.now() / 1000) + 2000,
            },
          },
        ],
        prefillsAvailable: [],
        loading: true,
      },
      login: {
        currentlyLoggedIn: false,
      },
    };

    const tree = shallow(
      <SaveInProgressIntro
        saveInProgress={{ formData: {} }}
        pageList={pageList}
        formId="1010ez"
        user={user}
        fetchInProgressForm={fetchInProgressForm}
        removeInProgressForm={removeInProgressForm}
        toggleLoginModal={toggleLoginModal}
        formConfig={formConfig}
      />,
    );

    expect(tree.find('va-loading-indicator').exists()).to.be.true;
    expect(tree.find('withRouter(FormStartControls)').exists()).to.be.false;
    tree.unmount();
  });

  it('should render expired message if signed in with an expired form', () => {
    // Mock time to ensure consistent test behavior
    const now = new Date('2025-01-15T12:00:00Z');
    const nowUnix = Math.floor(now.getTime() / 1000);
    const clock = sinon.useFakeTimers({ now: now.getTime(), toFake: ['Date'] });

    const user = {
      profile: {
        savedForms: [
          {
            form: VA_FORM_IDS.FORM_10_10EZ,
            metadata: {
              // Last updated 60 days ago
              lastUpdated: nowUnix - 60 * 86400,
              // Expired 1 day ago
              expiresAt: nowUnix - 86400,
            },
          },
        ],
        prefillsAvailable: [],
      },
      login: {
        currentlyLoggedIn: true,
      },
    };

    const tree = shallow(
      <SaveInProgressIntro
        saveInProgress={{ formData: {} }}
        pageList={pageList}
        formId="1010ez"
        user={user}
        fetchInProgressForm={fetchInProgressForm}
        removeInProgressForm={removeInProgressForm}
        toggleLoginModal={toggleLoginModal}
        formConfig={formConfig}
      />,
    );

    expect(tree.find('va-alert').text()).to.contain(
      'Your application has expired',
    );
    expect(tree.find('va-alert').text()).to.contain(
      'Your saved health care benefits application (10-10EZ) has expired. If you want to apply for health care benefits, please start a new application.',
    );
    expect(tree.find('withRouter(FormStartControls)').exists()).to.be.true;
    tree.unmount();
    clock.restore();
  });

  it('should render downtime notification', () => {
    const user = {
      profile: {
        savedForms: [
          {
            form: VA_FORM_IDS.FORM_10_10EZ,
            metadata: {
              lastUpdated: 3000,
              expiresAt: Math.floor(Date.now() / 1000) + 2000,
            },
          },
        ],
        prefillsAvailable: [],
      },
      login: {
        currentlyLoggedIn: false,
        loginUrls: {
          idme: '/mockLoginUrl',
        },
      },
    };

    const tree = shallow(
      <SaveInProgressIntro
        downtime={{}}
        saveInProgress={{ formData: {} }}
        pageList={pageList}
        formId="1010ez"
        user={user}
        fetchInProgressForm={fetchInProgressForm}
        removeInProgressForm={removeInProgressForm}
        toggleLoginModal={toggleLoginModal}
        formConfig={formConfig}
      />,
    );

    expect(tree.find('Connect(DowntimeNotification)').exists()).to.be.true;
    tree.unmount();
  });

  it('should render a different heading level when passed in as a prop', () => {
    const user = {
      profile: {
        savedForms: [
          {
            form: VA_FORM_IDS.FORM_10_10EZ,
            metadata: {
              lastUpdated: 3000,
              expiresAt: Math.floor(Date.now() / 1000) + 2000,
            },
          },
        ],
        prefillsAvailable: [],
      },
      login: {
        currentlyLoggedIn: true,
        loginUrls: {
          idme: '/mockLoginUrl',
        },
      },
    };

    const tree = shallow(
      <SaveInProgressIntro
        downtime={{}}
        saveInProgress={{ formData: {} }}
        pageList={pageList}
        formId="1010ez"
        user={user}
        fetchInProgressForm={fetchInProgressForm}
        removeInProgressForm={removeInProgressForm}
        toggleLoginModal={toggleLoginModal}
        formConfig={formConfig}
        headingLevel={1}
      />,
    );

    expect(tree.find('h1').exists()).to.be.true;
    tree.unmount();
  });

  it('should not render downtime notification when logged in', () => {
    const user = {
      profile: {
        savedForms: [
          {
            form: VA_FORM_IDS.FORM_10_10EZ,
            metadata: {
              lastUpdated: 3000,
              expiresAt: Math.floor(Date.now() / 1000) + 2000,
            },
          },
        ],
        prefillsAvailable: [],
      },
      login: {
        currentlyLoggedIn: false,
        loginUrls: {
          idme: '/mockLoginUrl',
        },
      },
    };

    const tree = shallow(
      <SaveInProgressIntro
        downtime={{}}
        saveInProgress={{ formData: {} }}
        pageList={pageList}
        formId="1010ez"
        isLoggedIn
        user={user}
        fetchInProgressForm={fetchInProgressForm}
        removeInProgressForm={removeInProgressForm}
        toggleLoginModal={toggleLoginModal}
        formConfig={formConfig}
      />,
    );

    expect(tree.find('Connect(DowntimeNotification)').exists()).to.be.false;
    tree.unmount();
  });

  it('should not render get started button', () => {
    const user = {
      profile: {
        savedForms: [
          {
            form: VA_FORM_IDS.FORM_10_10EZ,
            metadata: {
              lastUpdated: 3000,
              expiresAt: Math.floor(Date.now() / 1000) + 2000,
            },
          },
        ],
        prefillsAvailable: [],
      },
      login: {
        currentlyLoggedIn: false,
        loginUrls: {
          idme: '/mockLoginUrl',
        },
      },
    };

    const tree = shallow(
      <SaveInProgressIntro
        saveInProgress={{ formData: {} }}
        pageList={pageList}
        formId="1010ez"
        user={user}
        fetchInProgressForm={fetchInProgressForm}
        removeInProgressForm={removeInProgressForm}
        toggleLoginModal={toggleLoginModal}
        startMessageOnly
        formConfig={formConfig}
      />,
    );

    expect(tree.find('.schemaform-start-button').exists()).to.be.false;
    expect(tree.text()).to.not.include('lose any information you already');
    expect(tree.find('va-alert-sign-in[variant="signInOptional"]').exists()).to
      .be.true;

    tree.unmount();
  });

  it('should properly hide non-authed start when desired', () => {
    const user = {
      profile: {
        savedForms: [],
        prefillsAvailable: [],
      },
      login: {
        currentlyLoggedIn: false,
        loginUrls: {
          idme: '/mockLoginUrl',
        },
      },
    };

    const tree = shallow(
      <SaveInProgressIntro
        saveInProgress={{ formData: {} }}
        pageList={pageList}
        formId="1010ez"
        user={user}
        prefillEnabled
        hideUnauthedStartLink
        fetchInProgressForm={fetchInProgressForm}
        removeInProgressForm={removeInProgressForm}
        toggleLoginModal={toggleLoginModal}
        startMessageOnly
        formConfig={formConfig}
      />,
    );

    expect(tree.find('.schemaform-start-button').exists()).to.be.false;
    expect(tree.text()).to.not.include('lose any information you already');
    expect(tree.find('va-alert-sign-in[variant="signInRequired"]').exists()).to
      .be.true;

    tree.unmount();
  });
  it('should display an unauthStartText message', () => {
    const user = {
      profile: {
        savedForms: [],
        prefillsAvailable: [],
      },
      login: {
        currentlyLoggedIn: false,
        loginUrls: {
          idme: '/mockLoginUrl',
        },
      },
    };

    const { container } = render(
      <SaveInProgressIntro
        saveInProgress={{ formData: {} }}
        pageList={pageList}
        formId="1010ez"
        user={user}
        prefillEnabled
        hideUnauthedStartLink
        fetchInProgressForm={fetchInProgressForm}
        removeInProgressForm={removeInProgressForm}
        toggleLoginModal={toggleLoginModal}
        startMessageOnly
        unauthStartText="Custom message displayed to non-signed-in users"
        formConfig={formConfig}
      />,
    );
    expect($('va-button', container).outerHTML).to.contain(
      'Custom message displayed to non-signed-in users',
    );
    expect($('va-alert-sign-in[variant="signInRequired"]', container)).to.exist;
    // expect($('a.schemaform-start-button', container)).to.exist;
  });

  it('should display an unauth start imposter link', () => {
    const user = {
      profile: {
        savedForms: [],
        prefillsAvailable: [],
      },
      login: {
        currentlyLoggedIn: false,
        loginUrls: {
          idme: '/mockLoginUrl',
        },
      },
    };

    const { container } = render(
      <SaveInProgressIntro
        saveInProgress={{ formData: {} }}
        pageList={pageList}
        formId="1010ez"
        user={user}
        prefillEnabled
        fetchInProgressForm={fetchInProgressForm}
        removeInProgressForm={removeInProgressForm}
        toggleLoginModal={toggleLoginModal}
        startMessageOnly
        unauthStartText="Custom message displayed to non-signed-in users"
        formConfig={formConfig}
      />,
    );
    expect($('va-button', container).outerHTML).to.contain(
      'Custom message displayed to non-signed-in users',
    );
    expect($('va-alert-sign-in[variant="signInRequired"]', container)).to.not
      .exist;
    expect($('a.schemaform-start-button', container)).to.exist;
  });

  it('should display an unauth start va-link', () => {
    const pushSpy = sinon.spy();
    const router = {
      push: pushSpy,
    };
    const user = {
      profile: {
        savedForms: [],
        prefillsAvailable: [],
      },
      login: {
        currentlyLoggedIn: false,
        loginUrls: {
          idme: '/mockLoginUrl',
        },
      },
    };

    const { container } = render(
      <SaveInProgressIntro
        saveInProgress={{ formData: {} }}
        pageList={pageList}
        formId="1010ez"
        user={user}
        prefillEnabled
        fetchInProgressForm={fetchInProgressForm}
        removeInProgressForm={removeInProgressForm}
        toggleLoginModal={toggleLoginModal}
        startMessageOnly
        unauthStartText="Custom message displayed to non-signed-in users"
        formConfig={{
          ...formConfig,
          formOptions: { useWebComponentForNavigation: true },
        }}
        router={router}
      />,
    );
    expect($('va-button', container).outerHTML).to.contain(
      'Custom message displayed to non-signed-in users',
    );
    expect($('va-alert-sign-in[variant="signInRequired"]', container)).to.not
      .exist;
    const unauthStart = $('va-link.schemaform-start-button', container);
    expect(unauthStart).to.exist;
    fireEvent.click(unauthStart);
    expect(pushSpy.called).to.be.true;
  });

  it('should not render an inProgress message', () => {
    const user = {
      profile: {
        savedForms: [
          {
            form: VA_FORM_IDS.FORM_10_10EZ,
            metadata: {
              lastUpdated: 946684800,
              expiresAt: Math.floor(Date.now() / 1000) + 2000,
            },
          },
        ],
        prefillsAvailable: [],
      },
      login: {
        currentlyLoggedIn: true,
        loginUrls: {
          idme: '/mockLoginUrl',
        },
      },
    };

    const emptyMessageConfig = {
      saveInProgress: {
        messages: {
          inProgress: '',
        },
      },
    };

    const tree = shallow(
      <SaveInProgressIntro
        saveInProgress={{ formData: {} }}
        pageList={pageList}
        formId="1010ez"
        user={user}
        prefillEnabled
        hideUnauthedStartLink
        fetchInProgressForm={fetchInProgressForm}
        removeInProgressForm={removeInProgressForm}
        toggleLoginModal={toggleLoginModal}
        startMessageOnly
        unauthStartText="Custom message displayed to non-signed-in users"
        formConfig={emptyMessageConfig}
      />,
    );
    expect(tree.find('va-alert h2')).to.have.lengthOf(1);
    expect(tree.find('va-alert h2').text()).to.not.contain(
      'Your application is in progress',
    );

    tree.unmount();
  });

  describe('getStartPage', () => {
    it('should skip pages with depends conditions that are not met', () => {
      // Create a pageList with conditional pages similar to HCA
      const pageListWithDepends = [
        {
          path: '/introduction',
          pageKey: 'introduction',
        },
        {
          path: '/id-form',
          pageKey: 'id-form',
          depends: formData => !formData.isLoggedIn, // Only for logged-out users
        },
        {
          path: '/personal-information',
          pageKey: 'personal-information',
        },
        {
          path: '/review',
          pageKey: 'review',
        },
      ];

      const user = {
        profile: {
          savedForms: [],
          prefillsAvailable: [], // No prefill, forces use of getStartPage
        },
        login: {
          currentlyLoggedIn: true,
        },
      };

      // Form data indicating user is logged in
      const formData = {
        isLoggedIn: true,
      };

      const wrapper = shallow(
        <SaveInProgressIntro
          pageList={pageListWithDepends}
          formId="test-form"
          user={user}
          formData={formData}
          fetchInProgressForm={fetchInProgressForm}
          removeInProgressForm={removeInProgressForm}
          toggleLoginModal={toggleLoginModal}
          formConfig={formConfig}
        />,
      );

      const instance = wrapper.instance();
      const startPage = instance.getStartPage();

      // Should skip /id-form (which has depends: !isLoggedIn) and return /personal-information
      expect(startPage).to.equal('/personal-information');

      wrapper.unmount();
    });

    it('should include pages with depends conditions that are met', () => {
      const pageListWithDepends = [
        {
          path: '/introduction',
          pageKey: 'introduction',
        },
        {
          path: '/id-form',
          pageKey: 'id-form',
          depends: formData => !formData.isLoggedIn, // Only for logged-out users
        },
        {
          path: '/personal-information',
          pageKey: 'personal-information',
        },
      ];

      const user = {
        profile: {
          savedForms: [],
          prefillsAvailable: [],
        },
        login: {
          currentlyLoggedIn: true, // Keep user logged in for component rendering
        },
      };

      // Form data indicating user is NOT logged in
      // This tests the depends condition evaluation, not the login state
      const formData = {
        isLoggedIn: false,
      };

      const wrapper = shallow(
        <SaveInProgressIntro
          pageList={pageListWithDepends}
          formId="test-form"
          user={user}
          formData={formData}
          fetchInProgressForm={fetchInProgressForm}
          removeInProgressForm={removeInProgressForm}
          toggleLoginModal={toggleLoginModal}
          formConfig={formConfig}
        />,
      );

      const instance = wrapper.instance();
      const startPage = instance.getStartPage();

      // Should include /id-form since depends condition is met (!isLoggedIn is true)
      expect(startPage).to.equal('/id-form');

      wrapper.unmount();
    });

    it('should use pathname parameter when provided', () => {
      const pageListWithDepends = [
        {
          path: '/introduction',
          pageKey: 'introduction',
        },
        {
          path: '/step-1',
          pageKey: 'step-1',
          depends: () => false, // Always skip
        },
        {
          path: '/step-2',
          pageKey: 'step-2',
        },
        {
          path: '/step-3',
          pageKey: 'step-3',
        },
      ];

      const user = {
        profile: {
          savedForms: [],
          prefillsAvailable: [],
        },
        login: {
          currentlyLoggedIn: true,
        },
      };

      // Provide a custom pathname to start from step-2
      const wrapper = shallow(
        <SaveInProgressIntro
          pageList={pageListWithDepends}
          pathname="/step-2"
          formId="test-form"
          user={user}
          formData={{}}
          fetchInProgressForm={fetchInProgressForm}
          removeInProgressForm={removeInProgressForm}
          toggleLoginModal={toggleLoginModal}
          formConfig={formConfig}
        />,
      );

      const instance = wrapper.instance();
      const startPage = instance.getStartPage();

      // Should start from provided pathname (/step-2) and return next page (/step-3)
      expect(startPage).to.equal('/step-3');

      wrapper.unmount();
    });

    it('should handle multiple consecutive conditional pages', () => {
      const pageListWithMultipleDepends = [
        {
          path: '/introduction',
          pageKey: 'introduction',
        },
        {
          path: '/conditional-1',
          pageKey: 'conditional-1',
          depends: () => false, // Skip
        },
        {
          path: '/conditional-2',
          pageKey: 'conditional-2',
          depends: () => false, // Skip
        },
        {
          path: '/conditional-3',
          pageKey: 'conditional-3',
          depends: () => false, // Skip
        },
        {
          path: '/first-valid-page',
          pageKey: 'first-valid-page',
        },
      ];

      const user = {
        profile: {
          savedForms: [],
          prefillsAvailable: [],
        },
        login: {
          currentlyLoggedIn: true,
        },
      };

      const wrapper = shallow(
        <SaveInProgressIntro
          pageList={pageListWithMultipleDepends}
          formId="test-form"
          user={user}
          formData={{}}
          fetchInProgressForm={fetchInProgressForm}
          removeInProgressForm={removeInProgressForm}
          toggleLoginModal={toggleLoginModal}
          formConfig={formConfig}
        />,
      );

      const instance = wrapper.instance();
      const startPage = instance.getStartPage();

      // Should skip all three conditional pages and return /first-valid-page
      expect(startPage).to.equal('/first-valid-page');

      wrapper.unmount();
    });
  });
});
