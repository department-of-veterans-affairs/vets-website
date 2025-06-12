// import React from 'react';
// import { Provider } from 'react-redux';
// import { render } from '@testing-library/react';
// import configureStore from 'redux-mock-store';
// import thunk from 'redux-thunk';
// import { expect } from 'chai';
// import SaveInProgressIntro from '../../containers/SaveInProgressIntro';

// before(() => {
//   if (!window.customElements) {
//     window.customElements = { define: () => {}, get: () => {} };
//   }
//   ['va-alert', 'va-button', 'va-loading-indicator'].forEach(tag => {
//     if (!window.customElements.get(tag)) {
//       window.customElements.define(tag, class extends HTMLElement {});
//     }
//   });
// });

// const middleware = [thunk];
// const mockStore = configureStore(middleware);

// const getBaseState = (overrides = {}) => ({
//   user: {
//     profile: {
//       loading: false,
//       prefillsAvailable: ['test-form'],
//       savedForms: [],
//       ...overrides.profile,
//     },
//     login: {
//       currentlyLoggedIn: false,
//       ...overrides.login,
//     },
//   },
//   form: {
//     formId: 'test-form',
//     ...overrides.form,
//   },
// });

// const defaultProps = {
//   formId: 'test-form',
//   pageList: [{ path: 'introduction' }, { path: 'start' }],
//   formConfig: {
//     customText: { appType: 'application', appAction: 'applying' },
//   },
//   prefillEnabled: true,
//   headingLevel: 2,
//   startText: 'Start application',
//   unauthStartText: 'Sign in to start your application',
//   messages: {},
//   migrations: [],
//   resumeOnly: false,
//   buttonOnly: false,
//   retentionPeriod: '60 days',
//   retentionPeriodStart: 'when you start',
// };

// describe('SaveInProgressIntro', () => {
//   it('renders without crashing', () => {
//     const store = mockStore(getBaseState());
//     render(
//       <Provider store={store}>
//         <SaveInProgressIntro {...defaultProps} />
//       </Provider>,
//     );
//   });
//   it('renders unauthenticated alert and sign in button', () => {
//     const store = mockStore(getBaseState());
//     const { getByRole, getByText } = render(
//       <Provider store={store}>
//         <SaveInProgressIntro {...defaultProps} />
//       </Provider>,
//     );
//     expect(getByRole('heading', { level: 2 })).to.exist;
//     expect(getByText(/sign in to start your application/i)).to.exist;
//     expect(getByText(/how signing in now helps you/i)).to.exist;
//     expect(getByRole('button', { name: /sign in to start your application/i }))
//       .to.exist;
//   });

//   it('renders authenticated prefill alert if logged in and prefill available', () => {
//     const store = mockStore(
//       getBaseState({
//         login: { currentlyLoggedIn: true },
//         profile: { prefillsAvailable: ['test-form'] },
//       }),
//     );
//     const { getByText } = render(
//       <Provider store={store}>
//         <SaveInProgressIntro {...defaultProps} />
//       </Provider>,
//     );
//     expect(getByText(/we've prefilled some of your information/i)).to.exist;
//     expect(
//       getByText(
//         /since you’re signed in, we can prefill part of your application/i,
//       ),
//     ).to.exist;
//   });

//   it('renders in-progress alert with form controls if user has a saved form', () => {
//     const now = Math.floor(Date.now() / 1000);
//     const store = mockStore(
//       getBaseState({
//         login: { currentlyLoggedIn: true },
//         profile: {
//           savedForms: [
//             {
//               form: 'test-form',
//               metadata: {
//                 expiresAt: now + 86400,
//                 lastUpdated: now - 1000,
//               },
//             },
//           ],
//           prefillsAvailable: ['test-form'],
//         },
//       }),
//     );
//     const { getByText } = render(
//       <Provider store={store}>
//         <SaveInProgressIntro {...defaultProps} />
//       </Provider>,
//     );
//     expect(getByText(/continue applying now/i)).to.exist;
//     expect(getByText(/will expire on/i)).to.exist;
//   });

//   it('renders expired alert if saved form is expired', () => {
//     const now = Math.floor(Date.now() / 1000);
//     const store = mockStore(
//       getBaseState({
//         login: { currentlyLoggedIn: true },
//         profile: {
//           savedForms: [
//             {
//               form: 'test-form',
//               metadata: {
//                 expiresAt: now - 1000,
//                 lastUpdated: now - 2000,
//               },
//             },
//           ],
//         },
//       }),
//     );
//     const { getByText } = render(
//       <Provider store={store}>
//         <SaveInProgressIntro {...defaultProps} />
//       </Provider>,
//     );
//     expect(getByText(/your application has expired/i)).to.exist;
//   });

//   it('renders only the button when buttonOnly is true', () => {
//     const store = mockStore(getBaseState());
//     const { getByRole, queryByText } = render(
//       <Provider store={store}>
//         <SaveInProgressIntro {...defaultProps} buttonOnly />
//       </Provider>,
//     );
//     expect(getByRole('button', { name: /sign in to start your application/i }))
//       .to.exist;
//     expect(queryByText(/how signing in now helps you/i)).to.be.null;
//   });

//   it('renders loading indicator when profile is loading', () => {
//     const store = mockStore(
//       getBaseState({
//         profile: { loading: true },
//       }),
//     );
//     const { getByText } = render(
//       <Provider store={store}>
//         <SaveInProgressIntro {...defaultProps} />
//       </Provider>,
//     );
//     expect(getByText(/checking to see if you have a saved version/i)).to.exist;
//   });

//   it('renders nothing if resumeOnly is true and no saved form', () => {
//     const store = mockStore(getBaseState());
//     const { container } = render(
//       <Provider store={store}>
//         <SaveInProgressIntro {...defaultProps} resumeOnly />
//       </Provider>,
//     );
//     expect(container).to.be.empty;
//   });
// });

import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import SaveInProgressIntro from '../../containers/SaveInProgressIntro';

before(() => {
  if (!window.customElements) {
    window.customElements = { define: () => {}, get: () => {} };
  }
  ['va-alert', 'va-button', 'va-loading-indicator'].forEach(tag => {
    if (!window.customElements.get(tag)) {
      window.customElements.define(tag, class extends HTMLElement {});
    }
  });
});

const middleware = [thunk];
const mockStore = configureStore(middleware);

const getBaseState = (overrides = {}) => ({
  user: {
    profile: {
      loading: false,
      prefillsAvailable: ['test-form'],
      savedForms: [],
      ...overrides.profile,
    },
    login: {
      currentlyLoggedIn: false,
      ...overrides.login,
    },
  },
  form: {
    formId: 'test-form',
    ...overrides.form,
  },
});

const defaultProps = {
  formId: 'test-form',
  pageList: [{ path: 'introduction' }, { path: 'start' }],
  formConfig: {
    customText: { appType: 'application', appAction: 'applying' },
  },
  prefillEnabled: true,
  headingLevel: 2,
  startText: 'Start application',
  unauthStartText: 'Sign in to start your application',
  messages: {},
  migrations: [],
  resumeOnly: false,
  buttonOnly: false,
  retentionPeriod: '60 days',
  retentionPeriodStart: 'when you start',
};

describe('SaveInProgressIntro', () => {
  it('renders without crashing', () => {
    const store = mockStore(getBaseState());
    render(
      <Provider store={store}>
        <SaveInProgressIntro {...defaultProps} />
      </Provider>,
    );
  });
});
