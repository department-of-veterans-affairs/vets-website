import { expect } from 'chai';
import sinon from 'sinon';

import { clearSelectedAppointmentData } from '../index';

describe('health care questionnaire -- utils -- clear selected appointment in session storage', () => {
  it('should called removeItem', () => {
    const removeItem = sinon.spy();
    const window = {
      sessionStorage: {
        removeItem,
      },
    };
    clearSelectedAppointmentData(window, '12345');
    expect(removeItem.called).to.be.true;
    expect(
      removeItem.calledWith(
        'health.care.questionnaire.selectedAppointmentData.12345',
      ),
    ).to.be.true;
  });
});
