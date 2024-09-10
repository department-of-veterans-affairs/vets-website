import React from 'react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { fireEvent, render } from '@testing-library/react';
import sinon from 'sinon';
import { simulateInputChange } from '../../helpers';
import formConfig from '../../../config/form';
import AuthBenefitsPackagePage from '../../../containers/AuthBenefitsPackagePage';

describe('hca AuthBenefitsPackagePage', () => {
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
      dispatch: sinon.stub(),
    },
  });
  const subject = ({ props, mockStore }) => {
    const { container } = render(
      <Provider store={mockStore}>
        <AuthBenefitsPackagePage {...props} />
      </Provider>,
    );
    const selectors = () => ({
      form: container.querySelector('.rjsf'),
      primaryBtn: container.querySelector('.usa-button-primary'),
      secondaryBtn: container.querySelector('.usa-button-secondary'),
    });
    return { container, selectors };
  };

  it('should render form and navigation buttons', () => {
    const { props, mockStore } = getData();
    const { selectors } = subject({ props, mockStore });
    const { form, primaryBtn, secondaryBtn } = selectors();
    expect(form).to.exist;
    expect(primaryBtn).to.exist;
    expect(secondaryBtn).to.exist;
  });

  it('should fire the routers `push` method with the correct path when the `back` button is clicked', () => {
    const { props, mockStore } = getData();
    const { selectors } = subject({ props, mockStore });
    const { router } = props;
    fireEvent.click(selectors().secondaryBtn);
    expect(router.push.calledWith('/previous')).to.be.true;
  });

  it('should fire the routers `push` method with the correct path when the `continue` button is clicked', () => {
    const { props, mockStore } = getData();
    const { selectors } = subject({ props, mockStore });
    const { router } = props;
    fireEvent.click(selectors().primaryBtn);
    expect(router.push.calledWith('/next')).to.be.true;
  });

  it('should fire the `setData` dispatch with the correct data', () => {
    const { props, mockStore } = getData();
    const { container } = subject({ props, mockStore });
    const { dispatch } = mockStore;
    const expectedData = { 'view:vaBenefitsPackage': 'regOnly' };
    simulateInputChange(
      container,
      '#root_view\\3A vaBenefitsPackage_1',
      'regOnly',
    );
    expect(dispatch.firstCall.args[0].type).to.eq('SET_DATA');
    expect(dispatch.firstCall.args[0].data).to.deep.eq(expectedData);
  });
});
