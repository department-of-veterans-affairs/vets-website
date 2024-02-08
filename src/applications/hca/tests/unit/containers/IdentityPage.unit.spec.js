import React from 'react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { fireEvent, render } from '@testing-library/react';
import sinon from 'sinon';

import { toggleLoginModal } from 'platform/site-wide/user-nav/actions';
import IdentityPage from '../../../containers/IdentityPage';

import { HCA_ENROLLMENT_STATUSES } from '../../../utils/constants';
import { simulateInputChange } from '../../helpers';
import formConfig from '../../../config/form';

describe('hca IdentityPage', () => {
  const getData = ({
    push = () => {},
    dispatch = () => {},
    status = '',
    loggedIn = false,
    fetchingStatus = false,
  }) => ({
    props: {
      router: {
        push,
      },
      route: {
        pageList: [{ path: '/id-form' }, { path: '/next', formConfig }],
      },
      location: {
        pathname: '/id-form',
      },
    },
    mockStore: {
      getState: () => ({
        hcaEnrollmentStatus: {
          enrollmentStatus: status,
          isLoading: false,
          isUserInMVI: false,
          loginRequired: false,
          noESRRecordFound: false,
          hasServerError: false,
          isLoadingApplicationStatus: fetchingStatus,
        },
        form: {
          data: {},
        },
        user: {
          login: {
            currentlyLoggedIn: loggedIn,
          },
          profile: {
            loading: false,
          },
        },
      }),
      subscribe: () => {},
      dispatch,
    },
  });

  context('when the user is logged in', () => {
    it('should call the router to redirect to the intro page', () => {
      const push = sinon.spy();
      const { mockStore, props } = getData({ push, loggedIn: true });
      render(
        <Provider store={mockStore}>
          <IdentityPage {...props} />
        </Provider>,
      );
      expect(push.calledWith('/')).to.be.true;
    });
  });

  context('when the page renders', () => {
    it('should show the signin button and form', () => {
      const { mockStore } = getData({});
      const { container } = render(
        <Provider store={mockStore}>
          <IdentityPage />
        </Provider>,
      );
      const selectors = {
        form: container.querySelector('.rjsf'),
        buttons: {
          login: container.querySelector('[data-testid="hca-login-button"]'),
          submit: container.querySelector('.hca-idform-submit-button'),
        },
      };
      expect(selectors.form).to.exist;
      expect(selectors.buttons.login).to.exist;
      expect(selectors.buttons.submit).to.exist;
    });
  });

  context('when user attempts to sign in', () => {
    it('should call the `toggleLoginModal` action', () => {
      const dispatch = sinon.stub();
      const { mockStore } = getData({ dispatch });
      const { container } = render(
        <Provider store={mockStore}>
          <IdentityPage />
        </Provider>,
      );
      const selector = container.querySelector(
        '[data-testid="hca-login-button"]',
      );

      fireEvent.click(selector);
      expect(dispatch.called).to.be.true;
      expect(dispatch.calledWith(toggleLoginModal(true))).to.be.true;
    });
  });

  context('when the form is submitted', () => {
    const fillForm = container => {
      simulateInputChange(container, '#root_firstName', 'Diane');
      simulateInputChange(container, '#root_lastName', 'Smith');
      simulateInputChange(container, '#root_dobMonth', '1');
      simulateInputChange(container, '#root_dobDay', '1');
      simulateInputChange(container, '#root_dobYear', '1990');
      simulateInputChange(container, '#root_ssn', '211111111');
    };

    it('should call the dispatch action', () => {
      const dispatch = sinon.stub();
      const { mockStore } = getData({ dispatch });
      const { container } = render(
        <Provider store={mockStore}>
          <IdentityPage />
        </Provider>,
      );
      const selector = container.querySelector('.hca-idform-submit-button');

      fillForm(container);
      fireEvent.click(selector);
      expect(dispatch.called).to.be.true;
    });

    it('should go to the next page when user can fill out the application', () => {
      const push = sinon.spy();
      const dispatch = sinon.stub();
      const { mockStore, props } = getData({ push, dispatch });
      const { rerender } = render(
        <Provider store={mockStore}>
          <IdentityPage {...props} />
        </Provider>,
      );

      const { mockStore: newMockStore } = getData({
        status: HCA_ENROLLMENT_STATUSES.noneOfTheAbove,
      });
      rerender(
        <Provider store={newMockStore}>
          <IdentityPage {...props} />
        </Provider>,
      );

      expect(dispatch.called).to.be.true;
      expect(push.calledWith('/next')).to.be.true;
    });

    it('should not go to the next page when user cannot fill out the application', () => {
      const push = sinon.spy();
      const { mockStore, props } = getData({ push });
      const { rerender } = render(
        <Provider store={mockStore}>
          <IdentityPage {...props} />
        </Provider>,
      );

      const { mockStore: newMockStore } = getData({
        status: HCA_ENROLLMENT_STATUSES.enrolled,
      });
      rerender(
        <Provider store={newMockStore}>
          <IdentityPage {...props} />
        </Provider>,
      );

      expect(push.calledWith('/next')).to.be.false;
    });
  });
});
