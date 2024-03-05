import React from 'react';
import { expect } from 'chai';
import moment from 'moment';
import sinon from 'sinon';
import PastAppointmentsDateDropdown from '../PastAppointmentsDateDropdown';
import { getPastAppointmentDateRangeOptions } from '..';
import { renderWithStoreAndRouter } from '../../../../tests/mocks/setup';

const ranges = getPastAppointmentDateRangeOptions(moment('2020-02-02'));

describe('VAOS Component: PastAppointmentsDateDropDown', () => {
  it('should trigger spy when a new date range is selected', async () => {
    const initialState = {
      featureToggles: {
        vaOnlineSchedulingStatusImprovement: true,
      },
    };

    const callback = sinon.spy();

    const screen = renderWithStoreAndRouter(
      <PastAppointmentsDateDropdown
        currentRange={0}
        onChange={callback}
        options={ranges}
      />,
      {
        initialState,
      },
    );
    expect(screen.getAllByRole('option')).to.have.lengthOf(6);
    expect(screen.queryAllByRole('button')).to.have.lengthOf(0);
    // select a different date range
    const selectDate = screen.container
      .querySelector('#date-dropdown')
      .__events.vaSelect({
        detail: { value: '4' },
      });
    await selectDate;
    expect(callback.calledOnce).to.be.true;
  });
});
