import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import { $ } from 'platform/forms-system/src/js/utilities/ui';
import MY_HEALTH_LINK from '~/platform/site-wide/mega-menu/constants/MY_HEALTH_LINK';
import MyHealthLink from '../../components/MyHealthLink';

const store = () => ({
  getState: () => {},
  subscribe: () => {},
  dispatch: () => {},
});

describe('MyHealthLink', () => {
  it('should render link', async () => {
    const mockStore = store();
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
