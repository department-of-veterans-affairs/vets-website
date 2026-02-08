import React from 'react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { fireEvent, render } from '@testing-library/react';
import sinon from 'sinon';
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
      vaRadio: container.querySelector(
        'va-radio[name="root_view:vaBenefitsPackage"]',
      ),
      radioOption: container.querySelector('va-radio-option[value="regOnly"]'),
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
    const { secondaryBtn } = selectors();
    fireEvent.click(secondaryBtn);
    expect(router.push.calledWith('/previous')).to.be.true;
  });

  it('should fire the routers `push` method with the correct path when the `continue` button is clicked', () => {
    const { props, mockStore } = getData();
    const { container, selectors } = subject({ props, mockStore });
    const { primaryBtn } = selectors();
    const { router } = props;

    // Get the va-radio element and simulate a value change
    const vaRadio = container.querySelector(
      'va-radio[name="root_view:vaBenefitsPackage"]',
    );

    // Simulate selecting a radio option using the __events pattern
    // which is how web components expose events in the test environment
    if (vaRadio?.__events?.vaValueChange) {
      vaRadio.__events.vaValueChange({
        detail: { value: 'regOnly' },
      });
    } else {
      // Fallback to dispatching a CustomEvent
      const event = new CustomEvent('vaValueChange', {
        bubbles: true,
        composed: true,
        detail: { value: 'regOnly' },
      });
      vaRadio.dispatchEvent(event);
    }

    // Click continue button to submit the form
    fireEvent.click(primaryBtn);
    expect(router.push.calledWith('/next')).to.be.true;
  });

  it('should render va-radio web component', () => {
    const { props, mockStore } = getData();
    const { container } = subject({ props, mockStore });

    const vaRadio = container.querySelector(
      'va-radio[name="root_view:vaBenefitsPackage"]',
    );
    expect(vaRadio).to.exist;
  });

  it('should fire the `setData` dispatch with the correct data', () => {
    const { props, mockStore } = getData();
    const { container } = subject({ props, mockStore });
    const { dispatch } = mockStore;
    const expectedData = { 'view:vaBenefitsPackage': 'regOnly' };

    // Select a radio option by setting the value on the va-radio element
    const vaRadio = container.querySelector(
      'va-radio[name="root_view:vaBenefitsPackage"]',
    );
    if (vaRadio) {
      vaRadio.setAttribute('value', 'regOnly');
      // Trigger change event to update form data
      const event = new CustomEvent('vaValueChange', {
        detail: { value: 'regOnly' },
      });
      vaRadio.dispatchEvent(event);
    }

    expect(dispatch.firstCall.args[0].type).to.eq('SET_DATA');
    expect(dispatch.firstCall.args[0].data).to.deep.eq(expectedData);
  });
});
