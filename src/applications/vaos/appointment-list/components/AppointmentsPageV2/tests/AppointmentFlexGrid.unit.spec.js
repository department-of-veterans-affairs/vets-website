import React from 'react';
import { renderWithStoreAndRouter } from '~/platform/testing/unit/react-testing-library-helpers';
import { expect } from 'chai';
import AppointmentFlexGrid from '../AppointmentFlexGrid';

const appointment = {
  id: '1234',
};

describe('CancelLink', () => {
  it('renders null when hideCanceledOrPast is true', async () => {
    const link = '#testLink';
    const idClickable = `id-${appointment.id.replace('.', '\\.')}`;

    const wrapper = renderWithStoreAndRouter(
      <AppointmentFlexGrid idClickable={idClickable} link={link} />,
      {},
    );
    expect(await wrapper.queryByText('Cancel appointment')).to.not.exist;
  });
});
