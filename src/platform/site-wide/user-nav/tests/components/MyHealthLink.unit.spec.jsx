import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import { $ } from 'platform/forms-system/src/js/utilities/ui';
import MyHealthLink from '../../components/MyHealthLink';
import MY_HEALTH_LINK from '~/platform/site-wide/mega-menu/constants/MY_HEALTH_LINK';
import { mhvUrl } from '~/platform/site-wide/mhv/utilities';

const store = ({ featureToggleOn = false } = {}) => ({
  getState: () => ({
    featureToggles: {
      // eslint-disable-next-line camelcase
      mhv_landing_page_enabled: featureToggleOn,
    },
  }),
  subscribe: () => {},
  dispatch: () => {},
});

describe('MyHealthLink', () => {
  describe('should render link when', () => {
    it('`mhv_landing_page_enabled`: false | isSSOe: true', async () => {
      const mockStore = store();
      const recordNavUserEventSpy = sinon.spy();
      const { container } = render(
        <Provider store={mockStore}>
          <MyHealthLink isSSOe recordNavUserEvent={recordNavUserEventSpy} />
        </Provider>,
      );
      expect($('.my-health-link', container).textContent).to.eql('My Health');
      expect($('.my-health-link', container).href).to.eql(mhvUrl(true, 'home'));
      $('.my-health-link', container).click();
      expect(recordNavUserEventSpy.calledOnce).to.be.true;
      expect(recordNavUserEventSpy.firstCall.args[0]).to.eql('my-health');
    });
    it('`mhv_landing_page_enabled`: false | isSSOe: false', async () => {
      const mockStore = store();
      const recordNavUserEventSpy = sinon.spy();
      const { container } = render(
        <Provider store={mockStore}>
          <MyHealthLink recordNavUserEvent={recordNavUserEventSpy} />
        </Provider>,
      );
      expect($('.my-health-link', container).textContent).to.eql('My Health');
      expect($('.my-health-link', container).href).to.eql(
        mhvUrl(false, 'home'),
      );
      $('.my-health-link', container).click();
      expect(recordNavUserEventSpy.calledOnce).to.be.true;
      expect(recordNavUserEventSpy.firstCall.args[0]).to.eql('my-health');
    });
    it('`mhv_landing_page_enabled`: true', async () => {
      const mockStore = store({ featureToggleOn: true });
      const recordNavUserEventSpy = sinon.spy();
      const { container } = render(
        <Provider store={mockStore}>
          <MyHealthLink recordNavUserEvent={recordNavUserEventSpy} />
        </Provider>,
      );
      expect($('.my-health-link', container).textContent).to.eql(
        MY_HEALTH_LINK.title,
      );
      expect($('.my-health-link', container).href).to.include(
        MY_HEALTH_LINK.href,
      );
      $('.my-health-link', container).click();
      expect(recordNavUserEventSpy.calledOnce).to.be.true;
      expect(recordNavUserEventSpy.firstCall.args[0]).to.eql('my-healthevet');
    });
  });
});
