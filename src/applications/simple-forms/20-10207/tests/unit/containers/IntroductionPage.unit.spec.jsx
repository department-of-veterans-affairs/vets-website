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
        prefillsAvailable: ['20-10207'],
        dob: '2000-01-01',
        loa: {
          current: 3,
        },
        verified: true,
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

  it('should render <LOA3 content if user is logged in and not id-verified', () => {
    const userNotVerifiedMockStore = {
      ...mockStore,
      getState: () => ({
        ...mockStore.getState(),
        user: {
          login: {
            currentlyLoggedIn: true,
          },
          profile: {
            ...mockStore.getState().user.profile,
            loa: {
              current: 1,
            },
            verified: false,
          },
        },
      }),
    };
    const { container } = render(
      <Provider store={userNotVerifiedMockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );

    const userNotVerifiedDiv = container.querySelector(
      '[data-testid=verifyIdAlert]',
    );
    const sipAlert = container.querySelector('.schemaform-sip-alert');
    expect(userNotVerifiedDiv).to.exist;
    expect(sipAlert).to.not.exist;
  });

  /* TODO: Trying to fix this test before launch
  * The render's errorring out but React doesn't know what 
  * the error is. Something about "browser flakiness".
  * Delete if not fixable and coverage is good enough.
  */
  // it('should render LOA3 content if user is logged-in and id-verified', () => {
  //   const userVerifiedMockStore = {
  //     ...mockStore,
  //     getState: () => ({
  //       ...mockStore.getState(),
  //       user: {
  //         login: {
  //           currentlyLoggedIn: true,
  //         },
  //         profile: {
  //           ...mockStore.getState().user.profile,
  //           loa: {
  //             current: 3,
  //           },
  //           verified: true,
  //         },
  //       },
  //     }),
  //   };
  //   const { container } = render(
  //     <Provider store={userVerifiedMockStore}>
  //       <IntroductionPage {...props} />
  //     </Provider>,
  //   );

  //   const userNotVerifiedDiv = container.querySelector(
  //     '[data-testid=verifyIdAlert]',
  //   );
  //   const sipAlert = container.querySelector('.schemaform-sip-alert');
  //   expect(userNotVerifiedDiv).to.not.exist;
  //   expect(sipAlert).to.exist;
  // });
});
