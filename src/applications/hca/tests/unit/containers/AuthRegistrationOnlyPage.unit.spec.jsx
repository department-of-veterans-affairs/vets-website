import React from 'react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { fireEvent, render } from '@testing-library/react';
import sinon from 'sinon';
import formConfig from '../../../config/form';
import AuthRegistrationOnlyPage from '../../../containers/AuthRegistrationOnlyPage';

describe('hca AuthRegistrationOnlyPage', () => {
  const getData = () => ({
    props: {
      router: { push: sinon.spy() },
      route: {
        pageList: [
          { path: '/previous', formConfig },
          { path: '/current-page' },
          { path: '/next', formConfig },
        ],
      },
      location: {
        pathname: '/current-page',
      },
    },
    mockStore: {
      getState: () => ({
        form: { data: {} },
        user: {
          login: { currentlyLoggedIn: true },
          profile: { loading: false },
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    },
  });
  const subject = ({ props, mockStore }) => {
    const { container } = render(
      <Provider store={mockStore}>
        <AuthRegistrationOnlyPage {...props} />
      </Provider>,
    );
    const selectors = () => ({
      vaAlert: container.querySelector('va-alert'),
      secondaryBtn: container.querySelector('.usa-button-secondary'),
    });
    return { selectors };
  };

  it('should render `va-alert` and back button', () => {
    const { props, mockStore } = getData();
    const { selectors } = subject({ props, mockStore });
    const { vaAlert, secondaryBtn } = selectors();
    expect(secondaryBtn).to.exist;
    expect(vaAlert).to.exist;
    expect(vaAlert).to.have.attr('status', 'info');
  });

  it('should fire the routers `push` method with the correct path when the `back` button is clicked', () => {
    const { props, mockStore } = getData();
    const { selectors } = subject({ props, mockStore });
    const { router } = props;
    fireEvent.click(selectors().secondaryBtn);
    expect(router.push.calledWith('/previous')).to.be.true;
  });
});
