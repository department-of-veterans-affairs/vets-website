import React from 'react';
import { expect } from 'chai';
import moment from 'moment';
import sinon from 'sinon';
import userEvent from '@testing-library/user-event';
import PastAppointmentsDateDropdown from '../PastAppointmentsDateDropdown';
import { getPastAppointmentDateRangeOptions } from '..';
import { renderWithStoreAndRouter } from '../../../../tests/mocks/setup';

const ranges = getPastAppointmentDateRangeOptions(moment('2020-02-02'));

describe('With Status Improvement flag on', () => {
  it('should trigger onChange when a new date range is selected', async () => {
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
    userEvent.selectOptions(screen.getByTestId('vaosSelect'), ['4']);
    // this is failing
    expect(callback.calledOnce).to.be.true;
  });
});

describe('When disabled Status Improvement flag', () => {
  it('should trigger spy when the button is clicked', async () => {
    const initialState = {
      featureToggles: { vaOnlineSchedulingStatusImprovement: false },
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
    expect(screen.getAllByRole('option')).to.have.length(6);
    expect(screen.getByRole('button', { name: /Update/ })).to.exist;
    userEvent.selectOptions(screen.getByTestId('vaosSelect'), ['4']);
    // this is failing
    expect(screen.getByTestId('vaosSelect')).to.have.value('4');
    userEvent.click(screen.getByRole('button'), { name: /Update/ });
    // this is failing
    expect(callback.calledOnce).to.be.true;
  });
});
