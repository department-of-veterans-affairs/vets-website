import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';

import CheckIn from '../CheckIn';

describe('health care check in -- CheckIn component -- ', () => {
  it('show appointment details progress', () => {
    const component = mount(<CheckIn />);

    expect(component.find('[data-testid="appointment-time"]').exists()).to.be
      .true;
    expect(component.find('[data-testid="clinic-name"]').exists()).to.be.true;

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

    const component = mount(<CheckIn router={mockRouter} />);

    const checkInButton = component.find('[data-testid="check-in-button"]');
    expect(checkInButton.exists()).to.be.true;
    expect(checkInButton.props()).to.have.property('onClick');
    checkInButton.props().onClick();
    expect(push.called).to.be.true;
    expect(push.calledWith('/token-123/confirmed'));
    component.unmount();
  });
});
