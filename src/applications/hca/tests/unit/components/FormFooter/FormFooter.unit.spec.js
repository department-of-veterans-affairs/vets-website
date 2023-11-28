import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import FormFooter from '../../../../components/FormFooter';
import formConfig from '../../../../config/form';

describe('hca <FormFooter>', () => {
  const getData = ({
    pathname = '/introduction',
    loggedIn = true,
    loaState = 3,
  }) => ({
    props: {
      formConfig,
      currentLocation: { pathname },
    },
    mockStore: {
      getState: () => ({
        hcaEnrollmentStatus: {
          isUserInMVI: true,
          hasServerError: false,
          noESRRecordFound: true,
          showReapplyContent: false,
          isLoadingApplicationStatus: false,
        },
        form: {
          data: {},
        },
        user: {
          login: { currentlyLoggedIn: loggedIn },
          profile: {
            loading: false,
            verified: loggedIn,
            loa: { current: loaState },
          },
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    },
  });

  context('when not on the confirmation page', () => {
    context('when `shouldHideFormFooter` returns `false`', () => {
      it('should render markup with the correct title', () => {
        const { props, mockStore } = getData({});
        const { container } = render(
          <Provider store={mockStore}>
            <FormFooter {...props} />
          </Provider>,
        );
        const selectors = {
          title: container.querySelector('.help-heading'),
          content: container.querySelectorAll('.help-talk'),
        };
        expect(selectors.title).to.exist;
        expect(selectors.title).to.contain.text('Need help?');
        expect(selectors.content).to.have.length;
      });
    });

    context('when `shouldHideFormFooter` returns `true`', () => {
      it('should not render', () => {
        const { props, mockStore } = getData({ loaState: 1 });
        const { container } = render(
          <Provider store={mockStore}>
            <FormFooter {...props} />
          </Provider>,
        );
        expect(container).to.be.empty;
      });
    });
  });

  context('when on the confirmation page', () => {
    it('should not render', () => {
      const { props, mockStore } = getData({ pathname: '/confirmation' });
      const { container } = render(
        <Provider store={mockStore}>
          <FormFooter {...props} />
        </Provider>,
      );
      expect(container).to.be.empty;
    });
  });
});
