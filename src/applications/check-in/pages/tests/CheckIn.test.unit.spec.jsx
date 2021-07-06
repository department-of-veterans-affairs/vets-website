import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import { axeCheck } from 'platform/forms-system/test/config/helpers';

import {
  mockFetch,
  setFetchJSONResponse,
} from 'platform/testing/unit/helpers.js';

import { createMockSuccessResponse } from '../../api/local-mock-api/mocks/check.in.response';
import CheckIn from '../CheckIn';

describe('health care check in -- CheckIn component -- ', () => {
  beforeEach(() => mockFetch());
  it('show appointment details progress', () => {
    const mockRouter = {
      params: {
        token: 'token-123',
      },
    };
    const component = mount(<CheckIn router={mockRouter} />);

    expect(component.find('[data-testid="appointment-time"]').exists()).to.be
      .true;
    expect(component.find('[data-testid="clinic-name"]').exists()).to.be.true;

    component.unmount();
  });
  it('passes axeCheck', () => {
    const mockRouter = {
      params: {
        token: 'token-123',
      },
    };
    axeCheck(<CheckIn router={mockRouter} />);
  });
  it('button click calls router', async () => {
    setFetchJSONResponse(global.fetch.onCall(0), createMockSuccessResponse({}));

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
    await checkInButton.props().onClick();
    expect(push.called).to.be.true;
    expect(push.calledWith('/token-123/confirmed')).to.be.true;
    component.unmount();
  });
});
