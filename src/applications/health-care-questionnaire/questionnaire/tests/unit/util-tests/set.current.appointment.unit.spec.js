import { expect } from 'chai';
import sinon from 'sinon';

import { setCurrentAppointmentId } from '../../../utils';

describe('health care questionnaire -- utils -- set current id in session storage', () => {
  it('window is undefined', () => {
    const setItem = sinon.spy();
    const window = {
      sessionStorage: {
        setItem,
      },
    };
    setCurrentAppointmentId(window, '12345');
    expect(setItem.called).to.be.true;
    expect(
      setItem.calledWith(
        'currentHealthQuestionnaire',
        JSON.stringify({ appointmentId: '12345' }),
      ),
    ).to.be.true;
  });
});
