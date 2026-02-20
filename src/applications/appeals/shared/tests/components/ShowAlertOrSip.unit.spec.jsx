import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { add, getUnixTime } from 'date-fns';

import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import { heading as missingHeading } from '../../components/NeedsMissingInfoAlert';
import ShowAlertOrSip from '../../components/ShowAlertOrSip';

const defaultSipOptions = {
  formId: '1234',
  pageList: [{}],
  prefillEnabled: true,
  downtime: { requiredForPrefill: true, dependencies: [] },
  headingLevel: 2,
  hideUnauthedStartLink: true,
  messages: {
    notFound: 'Start over to apply for a DR',
    noAuth: 'Sign in again to continue your DR',
  },
  startText: 'Start your DR',
  gaStartEventName: 'decision-reviews-123',
  useActionLinks: true,
  pathname: '/introduction',
};

const inProgressForms = [
  {
    form: '1234',
    metadata: {
      expiresAt: getUnixTime(add(new Date(), { years: 1 })),
    },
  },
];

const emptyRender = '<div class="sip-wrapper vads-u-margin-y--2 bottom"></div>';
const emptyRenderWithEmptySiP =
  '<div class="sip-wrapper vads-u-margin-y--2 bottom"><div><br></div></div>';

describe('<NeedsMissingInfoAlert>', () => {
  const getData = ({
    sipOptions = defaultSipOptions,
    bottom = false,
    loggedIn = true,
    verified = true, // LOA3
    appeals = true, // SSN or LOA3
    last = 'last',
    dob = '2000-01-05',
    savedForms = inProgressForms,
  } = {}) => ({
    props: {
      basename: 'nod/intro',
      sipOptions,
      bottom,
    },
    store: {
      getState: () => ({
        user: {
          profile: {
            userFullName: {
              first: 'first',
              last,
            },
            dob,
            verified,
            claims: {
              appeals,
            },
            savedForms,
            signIn: { serviceName: 'idme' },
            prefillsAvailable: [],
          },
          login: {
            currentlyLoggedIn: loggedIn,
          },
        },
        form: {
          formId: '1234',
          data: {},
          migrations: [],
          prefillTransformer: (pages, formData, metadata) => ({
            pages,
            formData,
            metadata,
          }),
          loadedData: {
            metadata: { returnUrl: '/vet-info' },
          },
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
    },
  });
  it('should render in progress alert at top', () => {
    const { props, store } = getData();
    const { container } = render(
      <Provider store={store}>
        <ShowAlertOrSip {...props} />
      </Provider>,
    );
    expect($('va-alert', container)).to.exist;
    expect($('h2', container).textContent).to.match(/in progress/i);
  });
  it('should not render in progress alert at page bottom', () => {
    const { props, store } = getData({ bottom: true });
    const { container } = render(
      <Provider store={store}>
        <ShowAlertOrSip {...props} />
      </Provider>,
    );
    expect($('va-alert', container)).to.not.exist;
    expect($('h2', container)).to.not.exist;
    expect(container.innerHTML).to.eq(emptyRenderWithEmptySiP);
  });

  it('should render start action link with alert at top', () => {
    const { props, store } = getData({ savedForms: [] });
    const { container } = render(
      <Provider store={store}>
        <ShowAlertOrSip {...props} />
      </Provider>,
    );
    expect($('h2', container)).to.not.exist;
    expect($('va-alert', container).textContent).to.contain(
      'You can save this application in progress',
    );
    expect($('a.vads-c-action-link--green', container)).to.exist;
  });
  it('should render start action link only at bottom', () => {
    const { props, store } = getData({ savedForms: [], bottom: true });
    const { container } = render(
      <Provider store={store}>
        <ShowAlertOrSip {...props} />
      </Provider>,
    );
    expect($('h2', container)).to.not.exist;
    expect($('va-alert', container)).to.not.exist;
    expect($('a.vads-c-action-link--green', container)).to.exist;
  });

  it('should not render unauth alert at top', () => {
    const { props, store } = getData({ loggedIn: false });
    const { container } = render(
      <Provider store={store}>
        <ShowAlertOrSip {...props} />
      </Provider>,
    );
    expect($('va-alert', container)).to.not.exist;
    expect($('h2', container)).to.not.exist;
    expect(container.innerHTML).to.eq('');
  });
  it('should render unauth alert at bottom', () => {
    const { props, store } = getData({ loggedIn: false, bottom: true });
    const { container } = render(
      <Provider store={store}>
        <ShowAlertOrSip {...props} />
      </Provider>,
    );
    expect($('va-alert-sign-in[variant="signInRequired"]', container)).to.exist;
    expect($('va-button', container).text).to.eq(
      'Sign in to start your application',
    );
  });

  it('should render verify alert at top', () => {
    const { props, store } = getData({ verified: false });
    const { container } = render(
      <Provider store={store}>
        <ShowAlertOrSip {...props} />
      </Provider>,
    );
    const signInAlert = $('va-alert-sign-in', container);
    expect(signInAlert).to.exist;
    expect(signInAlert.getAttribute('heading-level')).to.eql('2');
    expect(container.querySelector('.idme-verify-button')).to.exist;
  });
  it('should not render verify alert at bottom', () => {
    const { props, store } = getData({ verified: false, bottom: true });
    const { container } = render(
      <Provider store={store}>
        <ShowAlertOrSip {...props} />
      </Provider>,
    );
    expect($('va-alert', container)).to.not.exist;
    expect($('h2', container)).to.not.exist;
    expect(container.innerHTML).to.eq(emptyRender);
  });

  it('should render missing info (SSN) alert at top', () => {
    const { props, store } = getData({ appeals: false });
    const { container } = render(
      <Provider store={store}>
        <ShowAlertOrSip {...props} />
      </Provider>,
    );
    expect($('va-alert', container)).to.exist;
    expect($('h2', container).textContent).to.contain(missingHeading);
    expect($('p', container).textContent).to.contain(
      'make sure we have your Social Security number.',
    );
    expect($$('va-telephone', container).length).to.eq(2);
  });
  it('should render missing info (SSN & DoB) alert at top', () => {
    const { props, store } = getData({ appeals: false, dob: '' });
    const { container } = render(
      <Provider store={store}>
        <ShowAlertOrSip {...props} />
      </Provider>,
    );
    expect($('va-alert', container)).to.exist;
    expect($('h2', container).textContent).to.contain(missingHeading);
    expect($('p', container).textContent).to.contain(
      'make sure we have your Social Security number and date of birth.',
    );
    expect($$('va-telephone', container).length).to.eq(2);
  });
  it('should render missing info (SSN, DoB, & name) alert at top', () => {
    const { props, store } = getData({ appeals: false, dob: '', last: '' });
    const { container } = render(
      <Provider store={store}>
        <ShowAlertOrSip {...props} />
      </Provider>,
    );
    expect($('va-alert', container)).to.exist;
    expect($('h2', container).textContent).to.contain(missingHeading);
    expect($('p', container).textContent).to.contain(
      'make sure we have your full name, Social Security number, and date of birth.',
    );
    expect($$('va-telephone', container).length).to.eq(2);
  });
  it('should not render missing info alert at bottom', () => {
    const { props, store } = getData({
      appeals: false,
      dob: '',
      last: '',
      bottom: true,
    });
    const { container } = render(
      <Provider store={store}>
        <ShowAlertOrSip {...props} />
      </Provider>,
    );
    expect($('va-alert', container)).to.not.exist;
    expect($('h2', container)).to.not.exist;
    expect(container.innerHTML).to.eq(emptyRender);
  });
});
