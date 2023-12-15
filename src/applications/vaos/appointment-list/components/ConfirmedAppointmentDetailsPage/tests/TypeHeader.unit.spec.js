import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '~/platform/testing/unit/react-testing-library-helpers';
import TypeHeader from '../TypeHeader';
import { formatHeader } from '../DetailsVA.util';

describe('TypeHeader component', () => {
  it('should create VA appointment details header', async () => {
    const appointment = {
      vaos: {
        isPastAppointment: true,
      },
    };
    const header = formatHeader(appointment);
    const wrapper = renderWithStoreAndRouter(
      <TypeHeader>{header}</TypeHeader>,
      {},
    );

    expect(
      wrapper.getByText('VA appointment', {
        exact: true,
        selector: 'h2',
      }),
    ).to.have.attribute('data-cy', 'va-appointment-details-header');
  });

  it('should create VA video appointment details header', async () => {
    const appointment = {
      vaos: {
        isPastAppointment: true,
      },
    };
    const header = formatHeader(appointment);
    const wrapper = renderWithStoreAndRouter(
      <TypeHeader isVideo>{header}</TypeHeader>,
      {},
    );

    expect(
      wrapper.getByText('VA appointment', {
        exact: true,
        selector: 'h2',
      }),
    ).to.have.attribute('data-cy', 'va-video-appointment-details-header');
  });

  it('should create Community care appointment details header', async () => {
    const appointment = {
      vaos: {
        isPastAppointment: true,
      },
    };
    const header = formatHeader(appointment);
    const wrapper = renderWithStoreAndRouter(
      <TypeHeader isCC>{header}</TypeHeader>,
      {},
    );

    expect(
      wrapper.getByText('VA appointment', {
        exact: true,
        selector: 'h2',
      }),
    ).to.have.attribute('data-cy', 'community-care-appointment-details-header');
  });
});
