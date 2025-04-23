import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import { fireEvent } from '@testing-library/dom';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import { AskVAPage } from '../../containers/AskVAPage';
import { renderWithRouter, rerenderWithRouter } from '../utils';

const getRouter = () => ({ push: sinon.spy() });

const store = createStore(() => ({
  featureToggles: {},
}));

describe('<AskVAPage>', () => {
  it('should render disabled submit button when va-checkbox not checked', () => {
    const router = getRouter();

    const { container } = renderWithRouter(
      <AskVAPage
        decisionRequestError={null}
        params={{ id: 1 }}
        router={router}
      />,
    );
    expect($('va-checkbox', container).getAttribute('checked')).to.equal(
      'false',
    );
    expect($('.button-primary', container).getAttribute('disabled')).to.exist;
    expect(router.push.called).to.be.false;
  });

  it('should render enabled submit button when va-checkbox checked', () => {
    const router = getRouter();

    const { container, rerender } = renderWithRouter(
      <AskVAPage
        decisionRequestError={null}
        params={{ id: 1 }}
        router={router}
      />,
    );

    expect($('.button-primary', container).getAttribute('disabled')).to.exist;

    // Check the checkbox
    $('va-checkbox', container).__events.vaChange({
      detail: { checked: true },
    });

    rerenderWithRouter(
      rerender,
      <AskVAPage
        decisionRequestError={null}
        params={{ id: 1 }}
        router={router}
      />,
    );

    expect($('.button-primary', container).getAttribute('disabled')).to.not
      .exist;
  });

  it('should render disabled submit button when submitting', () => {
    const router = {
      push: sinon.spy(),
    };

    const { container } = renderWithRouter(
      <AskVAPage
        loadingDecisionRequest
        decisionRequestError={null}
        params={{ id: 1 }}
        router={router}
      />,
    );

    expect($('.button-primary', container).getAttribute('disabled')).to.exist;
    expect($('.button-primary', container).getAttribute('text')).to.equal(
      'Submitting...',
    );
  });

  it('should update claims and redirect after success', () => {
    const navigate = sinon.spy();
    const getClaim = sinon.spy();

    const tree = SkinDeep.shallowRender(
      <AskVAPage params={{ id: 1 }} navigate={navigate} />,
    );
    tree.getMountedInstance().UNSAFE_componentWillReceiveProps({
      decisionRequested: true,
      getClaim,
    });
    expect(getClaim.calledWith(1)).to.be.true;
    expect(navigate.calledWith('../status')).to.be.true;
  });

  context('5103 Submission', () => {
    const params = { id: 1 };

    const props = {
      decisionRequestError: null,
      params,
      router: getRouter(),
    };

    it('calls submit5103 ', () => {
      props.submit5103 = sinon.spy();

      const { container, rerender } = renderWithRouter(
        <Provider store={store}>
          <AskVAPage {...props} />
        </Provider>,
      );
      // Check the checkbox
      $('va-checkbox', container).__events.vaChange({
        detail: { checked: true },
      });

      rerenderWithRouter(
        rerender,
        <Provider store={store}>
          <AskVAPage {...props} />
        </Provider>,
      );
      // Click submit button
      fireEvent.click($('.button-primary', container));

      expect(props.submit5103.called).to.be.true;
    });
  });
});
