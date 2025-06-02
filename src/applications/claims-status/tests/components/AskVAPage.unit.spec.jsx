/* eslint-disable camelcase */
import React from 'react';
import { expect } from 'chai';
import { fireEvent } from '@testing-library/dom';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import { AskVAPage } from '../../containers/AskVAPage';
import { renderWithRouter, rerenderWithRouter } from '../utils';

/// /////////////////////////////////////////////////////////////////////////////
// test helpers / stubs
/// /////////////////////////////////////////////////////////////////////////////
const getRouter = () => ({ push: sinon.spy() });

const store = createStore(() => ({
  featureToggles: {},
}));

/// /////////////////////////////////////////////////////////////////////////////
// specs
/// /////////////////////////////////////////////////////////////////////////////
describe('<AskVAPage>', () => {
  it('renders disabled submit button when checkbox not checked', () => {
    const router = getRouter();

    const { container } = renderWithRouter(
      <Provider store={store}>
        <AskVAPage
          decisionRequestError={null}
          params={{ id: 1 }}
          router={router}
        />
      </Provider>,
    );

    expect($('va-checkbox', container).getAttribute('checked')).to.equal(
      'false',
    );
    expect($('.button-primary', container).getAttribute('disabled')).to.exist;
    expect(router.push.called).to.be.false;
  });

  it('enables submit button after checkbox is checked', () => {
    const router = getRouter();

    const { container, rerender } = renderWithRouter(
      <Provider store={store}>
        <AskVAPage
          decisionRequestError={null}
          params={{ id: 1 }}
          router={router}
        />
      </Provider>,
    );

    // still disabled
    expect($('.button-primary', container).getAttribute('disabled')).to.exist;

    // check the box
    $('va-checkbox', container).__events.vaChange({
      detail: { checked: true },
    });

    // re-render to pick up state change
    rerenderWithRouter(
      rerender,
      <Provider store={store}>
        <AskVAPage
          decisionRequestError={null}
          params={{ id: 1 }}
          router={router}
        />
      </Provider>,
    );

    expect($('.button-primary', container).getAttribute('disabled')).to.not
      .exist;
  });

  it('shows disabled "Submitting…" button state while loading', () => {
    const router = getRouter();

    const { container } = renderWithRouter(
      <Provider store={store}>
        <AskVAPage
          loadingDecisionRequest
          decisionRequestError={null}
          params={{ id: 1 }}
          router={router}
        />
      </Provider>,
    );

    expect($('.button-primary', container).getAttribute('disabled')).to.exist;
    expect($('.button-primary', container).getAttribute('text')).to.equal(
      'Submitting...',
    );
  });

  it('updates claim & redirects after decisionRequested flips to true', () => {
    // spies
    const navigate = sinon.spy();
    const getClaim = sinon.spy();
    const params = { id: 1 };

    // 1 initial render (decisionRequested = false)
    const { rerender } = renderWithRouter(
      <Provider store={store}>
        <AskVAPage
          decisionRequested={false}
          getClaim={getClaim}
          navigate={navigate}
          params={params}
        />
      </Provider>,
    );

    // 2 re-render with decisionRequested = true
    rerenderWithRouter(
      rerender,
      <Provider store={store}>
        <AskVAPage
          decisionRequested
          getClaim={getClaim}
          navigate={navigate}
          params={params}
        />
      </Provider>,
    );

    expect(getClaim.calledWith(1)).to.be.true;
    expect(navigate.calledWith('../status')).to.be.true;
  });

  context('5103 submission flow', () => {
    const params = { id: 1 };
    const props = {
      decisionRequestError: null,
      params,
      router: getRouter(),
    };

    it('calls submit5103 on click', () => {
      props.submit5103 = sinon.spy();

      const { container, rerender } = renderWithRouter(
        <Provider store={store}>
          <AskVAPage {...props} />
        </Provider>,
      );

      // tick the checkbox
      $('va-checkbox', container).__events.vaChange({
        detail: { checked: true },
      });

      // re-render so the button enables
      rerenderWithRouter(
        rerender,
        <Provider store={store}>
          <AskVAPage {...props} />
        </Provider>,
      );

      // click submit
      fireEvent.click($('.button-primary', container));

      expect(props.submit5103.called).to.be.true;
    });
  });
});
