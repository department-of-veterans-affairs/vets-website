import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';

import Insurance from '../Insurance';

describe('health care check in -- Insurance component -- ', () => {
  it('has a header', () => {
    const component = mount(<Insurance />);

    expect(component.find('h1').exists()).to.be.true;

    component.unmount();
  });
  it('button click calls router', () => {
    const push = sinon.spy();
    const mockRouter = {
      push,
      params: {
        token: 'token-123',
      },
    };

    const component = mount(<Insurance router={mockRouter} />);

    const checkInButton = component.find('[data-testid="check-in-button"]');
    expect(checkInButton.exists()).to.be.true;
    expect(checkInButton.props()).to.have.property('onClick');
    checkInButton.props().onClick();
    expect(push.called).to.be.true;
    expect(push.calledWith('/token-123/confirmed'));
    component.unmount();
  });
});
