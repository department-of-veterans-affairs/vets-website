import { expect } from 'chai';
import sinon from 'sinon';

import { clearAllSelectedAppointments } from '../index';

describe('health care questionnaire -- utils -- clear all selected appointment in session storage', () => {
  it('should remove keys that match the pattern', () => {
    const removeItem = sinon.spy();
    const window = {
      sessionStorage: {
        removeItem,
        'health.care.questionnaire.selectedAppointmentData.test': true,
        'not-my-keys': true,
      },
    };
    clearAllSelectedAppointments(window);
    expect(removeItem.called).to.be.true;
    expect(
      removeItem.calledWith(
        'health.care.questionnaire.selectedAppointmentData.test',
      ),
    ).to.be.true;
    expect(removeItem.calledWith('not-my-keys')).to.be.false;
  });
  it('no keys found -- should not fail', () => {
    const removeItem = sinon.spy();
    const window = {
      sessionStorage: {
        removeItem,
        'other-data': true,
      },
    };
    clearAllSelectedAppointments(window);
    expect(removeItem.called).to.be.false;
  });
  it('nothing in storage -- should not fail', () => {
    const removeItem = sinon.spy();
    const window = {
      sessionStorage: {
        removeItem,
      },
    };
    clearAllSelectedAppointments(window);
    expect(removeItem.called).to.be.false;
  });
});
