import React from 'react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { fireEvent, render, waitFor } from '@testing-library/react';
import sinon from 'sinon';

import { toggleLoginModal } from 'platform/site-wide/user-nav/actions';
import { HCA_ENROLLMENT_STATUSES } from '../../../utils/constants';
import formConfig from '../../../config/form';
import IdentityPage from '../../../containers/IdentityPage';

describe('hca IdentityPage', () => {
  const getData = ({
    status = '',
    loggedIn = false,
    recordFound = false,
    fetchingStatus = false,
    fetchAttempted = false,
  }) => ({
    props: {
      router: {
        push: sinon.spy(),
      },
      route: {
        pageList: [{ path: '/current-page' }, { path: '/next', formConfig }],
      },
      location: {
        pathname: '/current-page',
      },
    },
    mockStore: {
      getState: () => ({
        hcaEnrollmentStatus: {
          statusCode: status,
          isUserInMPI: false,
          vesRecordFound: recordFound,
          hasServerError: false,
          loading: fetchingStatus,
          fetchAttempted,
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
      dispatch: sinon.stub(),
    },
  });
  const subject = ({ props, mockStore }) => {
    const { container, rerender } = render(
      <Provider store={mockStore}>
        <IdentityPage {...props} />
      </Provider>,
    );
    const selectors = () => ({
      form: container.querySelector('.rjsf'),
      buttons: {
        login: container.querySelector('[data-testid="hca-login-button"]'),
        submit: container.querySelector('.hca-idform-submit-button'),
      },
    });
    return { container, rerender, selectors };
  };

  it('should render the sign-in button and form when the page renders', () => {
    const { props, mockStore } = getData({});
    const { selectors } = subject({ props, mockStore });
    const { form, buttons } = selectors();
    expect(form).to.exist;
    expect(buttons.login).to.exist;
    expect(buttons.submit).to.exist;
  });

  it('should fire the routers `push` method with the next valid page path when the user is logged in', () => {
    const { props, mockStore } = getData({ loggedIn: true });
    const { router } = props;
    subject({ props, mockStore });
    expect(router.push.calledWith('/next')).to.be.true;
  });

  it('should redirect to root path when logged in and no next page is found', () => {
    const { props, mockStore } = getData({ loggedIn: true });
    props.route.pageList = [{ path: '/current-page' }];
    const { router } = props;
    subject({ props, mockStore });
    expect(router.push.calledWith('/')).to.be.true;
  });

  it('should fire the `toggleLoginModal` action when user attempts to sign in', () => {
    const { props, mockStore } = getData({});
    const { selectors } = subject({ props, mockStore });
    const { dispatch } = mockStore;
    fireEvent.click(selectors().buttons.login);
    expect(dispatch.called).to.be.true;
    expect(dispatch.calledWithMatch(toggleLoginModal(true))).to.be.true;
  });

  it('should fire the `fetchEnrollmentStatus` action when the form is submitted', async () => {
    const { props, mockStore } = getData({});
    const { container, selectors } = subject({ props, mockStore });
    const { dispatch } = mockStore;
    const dataToSet = {
      firstName: 'Diane',
      lastName: 'Smith',
      dobMonth: '1',
      dobDay: '1',
      dobYear: '1990',
      ssn: '211111111',
    };

    for (const [key, value] of Object.entries(dataToSet)) {
      const el = container.querySelector(`#root_${key}`);
      fireEvent.change(el, { target: { value } });
    }

    fireEvent.click(selectors().buttons.submit);
    await waitFor(() => sinon.assert.called(dispatch));
  });

  it('should not fire the `setData` action or router `push` method when existing record is found in VES', () => {
    const { props, mockStore } = getData({});
    const { rerender } = subject({ props, mockStore });
    const { props: newProps, mockStore: newMockStore } = getData({
      status: HCA_ENROLLMENT_STATUSES.enrolled,
      fetchAttempted: true,
      recordFound: true,
    });
    const { dispatch } = newMockStore;
    const { router } = newProps;
    rerender(
      <Provider store={newMockStore}>
        <IdentityPage {...newProps} />
      </Provider>,
    );
    expect(dispatch.called).to.be.false;
    expect(router.push.calledWith('/next')).to.be.false;
  });

  it('should fire the `setData` action and router `push` method, with correct path, when no record is found in VES', () => {
    const { props, mockStore } = getData({});
    const { rerender } = subject({ props, mockStore });
    const { props: newProps, mockStore: newMockStore } = getData({
      fetchAttempted: true,
    });
    const { dispatch } = newMockStore;
    const { router } = newProps;
    rerender(
      <Provider store={newMockStore}>
        <IdentityPage {...newProps} />
      </Provider>,
    );
    expect(dispatch.firstCall.args[0].type).to.eq('SET_DATA');
    expect(router.push.calledWith('/next')).to.be.true;
  });

  it('should fire the `setData` action and router `push` method, with correct path, when enrollment status code is `none_of_the_above`', () => {
    const { props, mockStore } = getData({});
    const { rerender } = subject({ props, mockStore });
    const { props: newProps, mockStore: newMockStore } = getData({
      status: HCA_ENROLLMENT_STATUSES.noneOfTheAbove,
      fetchAttempted: true,
      recordFound: true,
    });
    const { dispatch } = newMockStore;
    const { router } = newProps;
    rerender(
      <Provider store={newMockStore}>
        <IdentityPage {...newProps} />
      </Provider>,
    );
    expect(dispatch.firstCall.args[0].type).to.eq('SET_DATA');
    expect(router.push.calledWith('/next')).to.be.true;
  });
});
