import { expect } from 'chai';
import sinon from 'sinon';

import { setSelectedAppointmentData } from '../index';

describe('health care questionnaire -- utils -- set selected appointment session storage', () => {
  it('window is defined', () => {
    const setItem = sinon.spy();
    const window = {
      sessionStorage: {
        setItem,
      },
    };
    setSelectedAppointmentData(window, { appointment: { id: '12345' } });
    expect(setItem.called).to.be.true;
    expect(
      setItem.calledWith(
        'health.care.questionnaire.selectedAppointmentData.12345',
        JSON.stringify({ appointment: { id: '12345' } }),
      ),
    ).to.be.true;
  });
});
