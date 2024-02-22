import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { render } from '@testing-library/react';

import { AskVAPage } from '../../containers/AskVAPage';

const getRouter = () => ({ push: sinon.spy() });

const store = createStore(() => ({
  featureToggles: {},
}));

describe('<AskVAPage>', () => {
  it('should render disabled submit button', () => {
    const router = getRouter();

    const tree = SkinDeep.shallowRender(
      <AskVAPage
        decisionRequestError={null}
        params={{ id: 1 }}
        router={router}
      />,
    );
    expect(tree.everySubTree('va-button')[0].props.disabled).to.be.true;
    expect(tree.everySubTree('va-button')[0].props.text).to.equal('Submit');
    expect(router.push.called).to.be.false;
  });

  // Disabling this test because it is not compatible with the va-checkbox web component yet.
  it.skip('should render enabled button', () => {
    const router = getRouter();
    const submitRequest = sinon.spy();

    const tree = SkinDeep.shallowRender(
      <AskVAPage
        decisionRequestError={null}
        params={{ id: 1 }}
        submitRequest={submitRequest}
        router={router}
      />,
    );

    tree.subTree('Checkbox').props.onValueChange(true);
    expect(tree.everySubTree('button')[0].props.disabled).to.be.null;
  });

  it('should render disabled submitting button', () => {
    const router = {
      push: sinon.spy(),
    };
    const submitRequest = sinon.spy();

    const tree = SkinDeep.shallowRender(
      <AskVAPage
        loadingDecisionRequest
        decisionRequestError={null}
        params={{ id: 1 }}
        submitRequest={submitRequest}
        router={router}
      />,
    );

    expect(tree.everySubTree('va-button')[0].props.disabled).to.be.true;
    expect(tree.everySubTree('va-button')[0].props.text).to.equal(
      'Submitting...',
    );
  });

  // Disabling this test because it is not compatible with the va-checkbox web component yet.
  it.skip('should submit request', () => {
    const router = getRouter();
    const submitRequest = sinon.spy();

    const tree = SkinDeep.shallowRender(
      <AskVAPage
        decisionRequestError={null}
        params={{ id: 1 }}
        submitRequest={submitRequest}
        router={router}
      />,
    );

    tree.subTree('Checkbox').props.onValueChange(true);
    tree.subTree('button').props.onClick();
    expect(submitRequest.called).to.be.true;
  });

  it('should update claims and redirect after success', () => {
    const router = getRouter();
    const submitRequest = sinon.spy();
    const getClaimEVSS = sinon.spy();

    const tree = SkinDeep.shallowRender(
      <AskVAPage
        params={{ id: 1 }}
        submitRequest={submitRequest}
        router={router}
      />,
    );
    tree.getMountedInstance().UNSAFE_componentWillReceiveProps({
      decisionRequested: true,
      getClaimEVSS,
    });
    expect(getClaimEVSS.calledWith(1)).to.be.true;
    expect(router.push.calledWith('your-claims/1')).to.be.true;
  });

  // START lighthouse_migration
  context('cst_use_lighthouse feature toggle', () => {
    const params = { id: 1 };

    const props = {
      decisionRequestError: null,
      params,
      router: getRouter(),
    };

    it('calls getClaimLighthouse when enabled', () => {
      // Reset sinon spies / set up props
      props.getClaimEVSS = sinon.spy();
      props.getClaimLighthouse = sinon.spy();
      props.useLighthouseShow = true;

      const { rerender } = render(
        <Provider store={store}>
          <AskVAPage {...props} />
        </Provider>,
      );

      // We want to trigger the 'UNSAFE_componentWillReceiveProps' method
      // which requires rerendering
      rerender(
        <Provider store={store}>
          <AskVAPage {...props} decisionRequested />
        </Provider>,
      );

      expect(props.getClaimEVSS.called).to.be.false;
      expect(props.getClaimLighthouse.called).to.be.true;
    });

    it('calls getClaimEVSS when disabled', () => {
      // Reset sinon spies / set up props
      props.getClaimEVSS = sinon.spy();
      props.getClaimLighthouse = sinon.spy();
      props.useLighthouseShow = false;

      const { rerender } = render(
        <Provider store={store}>
          <AskVAPage {...props} />
        </Provider>,
      );

      // We want to trigger the 'UNSAFE_componentWillReceiveProps' method
      // which requires rerendering
      rerender(
        <Provider store={store}>
          <AskVAPage {...props} decisionRequested />
        </Provider>,
      );

      expect(props.getClaimEVSS.called).to.be.true;
      expect(props.getClaimLighthouse.called).to.be.false;
    });

    // Disabling this test because it is not compatible with the va-checkbox web component yet.
    it.skip('calls submitRequest when disabled', () => {
      props.submitRequest = sinon.spy();
      props.submit5103 = sinon.spy();
      props.useLighthouse5103 = false;

      const screen = render(
        <Provider store={store}>
          <AskVAPage {...props} />
        </Provider>,
      );

      screen.getByRole('checkbox').click();
      screen.getByText('Submit').click();

      expect(props.submitRequest.called).to.be.true;
      expect(props.submit5103.called).to.be.false;
    });

    // Disabling this test because it is not compatible with the va-checkbox web component yet.
    it.skip('calls submit5103 when enabled', () => {
      props.submitRequest = sinon.spy();
      props.submit5103 = sinon.spy();
      props.useLighthouse5103 = true;

      const screen = render(
        <Provider store={store}>
          <AskVAPage {...props} />
        </Provider>,
      );

      screen.getByRole('checkbox').click();
      screen.getByText('Submit').click();

      expect(props.submitRequest.called).to.be.false;
      expect(props.submit5103.called).to.be.true;
    });
  });
  // END lighthouse_migration
});
