import { expect } from 'chai';
import React from 'react';
import sinon from 'sinon';
import { getMaximumPastAppointmentDateRange } from '.';
import { renderWithStoreAndRouter } from '../../../tests/mocks/setup';
import PastAppointmentsDateDropdown from './PastAppointmentsDateDropdown';

describe('VAOS Component: PastAppointmentsDateDropDown', () => {
  it('getMaximumPastAppointmentDateRange: should trigger spy when date range is selected', async () => {
    const ranges = getMaximumPastAppointmentDateRange();

    const initialState = {
      featureToggles: {},
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
    expect(screen.getAllByRole('option')).to.have.lengthOf(4);
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
