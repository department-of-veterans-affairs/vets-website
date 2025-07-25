import createMockStore from 'redux-mock-store';
import { waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import ReactDOM from 'react-dom';
import widgetTypes from 'platform/site-wide/widgetTypes';
import { CSP_IDS } from '~/platform/user/authentication/constants';
import createMhvSigninCallToAction from '../createMhvSigninCTA';

describe('create MHV Signin Call To Action widget', () => {
  const mockStore = createMockStore([]);
  const state = {
    user: {
      login: {
        currentlyLoggedIn: true,
      },
      profile: {
        loa: {
          current: 3,
        },
        signIn: {
          serviceName: CSP_IDS.ID_ME,
        },
        loading: false,
        mhvAccount: {
          loading: false,
        },
      },
    },
  };
  const noAlertContent = `
  <span class="static-widget-content vads-u-display--none" aria-hidden="true">
    <a href="/health-care/order-hearing-aid-or-CPAP-supplies-form">
      Order hearing aid and CPAP supplies online
    </a>
  </span>`;
  const serviceDescription = 'a description';
  const headingLevel = '3';
  const divId = 'div1';

  beforeEach(() => {
    sinon.spy(ReactDOM, 'render');
  });

  afterEach(() => {
    // Clear the body contents instead of replacing it
    document.body.innerHTML = '';

    ReactDOM.render.restore();
  });

  it('no element to replace', async () => {
    const div = document.createElement('div');
    div.innerHTML = '<div data-widget-type="not-a-widget-class" />';
    document.body.appendChild(div);
    createMhvSigninCallToAction(mockStore(state), widgetTypes.MHV_SIGNIN_CTA);
    await waitFor(() => {
      expect(ReactDOM.render.notCalled).to.be.true;
    });
  });

  it('widget rendered with no content, no serviceDescription and no headingLevel', async () => {
    const div = document.createElement('div');
    div.innerHTML = `
    <div id="${divId}" data-widget-type=${widgetTypes.MHV_SIGNIN_CTA} />`;
    document.body.appendChild(div);
    createMhvSigninCallToAction(mockStore(state), widgetTypes.MHV_SIGNIN_CTA);
    await waitFor(() => {
      expect(ReactDOM.render.calledOnce).to.be.true;
      const components = ReactDOM.render.getCall(0).args[0].props.children;
      expect(components).to.exist;
      expect(components.props.headingLevel).to.eql(null);
      expect(components.props.serviceDescription).to.eql(null);
      expect(components.props.noAlertContent).to.not.exist;
      const replacedEl = ReactDOM.render.getCall(0).args[1];
      expect(replacedEl).to.exist;
      expect(replacedEl.id).to.eql(divId);
    });
  });

  it('widget rendered with content and data attributes', async () => {
    const div = document.createElement('div');
    div.innerHTML = `
    <div id="${divId}" data-widget-type=${widgetTypes.MHV_SIGNIN_CTA} 
     data-heading-level="${headingLevel}"
     data-service-description="${serviceDescription}">
      ${noAlertContent}
    </div>`;
    document.body.appendChild(div);
    createMhvSigninCallToAction(mockStore(state), widgetTypes.MHV_SIGNIN_CTA);
    await waitFor(() => {
      expect(ReactDOM.render.calledOnce).to.be.true;
      const components = ReactDOM.render.getCall(0).args[0].props.children;
      expect(components).to.exist;
      expect(components.props.headingLevel).to.eql(headingLevel);
      expect(components.props.serviceDescription).to.eql(serviceDescription);
      expect(components.props.noAlertContent).to.exist;
      expect(components.props.noAlertContent.innerHTML).to.include(
        'order-hearing-aid-or-CPAP-supplies-form',
      );
      const replacedEl = ReactDOM.render.getCall(0).args[1];
      expect(replacedEl).to.exist;
      expect(replacedEl.id).to.eql(divId);
    });
  });
});
