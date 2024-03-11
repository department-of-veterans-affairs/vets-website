import React from 'react';
import { expect } from 'chai';
import { fireEvent } from '@testing-library/dom';
import { renderWithStoreAndRouter } from '~/platform/testing/unit/react-testing-library-helpers';
import PrintLink from '../PrintLink';

describe('VAOS Component: PrintLink', () => {
  const initialState = {
    featureToggles: {},
  };
  const appointmentData = {
    status: 'booked',
  };

  it('should display print link', () => {
    const screen = renderWithStoreAndRouter(
      <PrintLink appointment={appointmentData} />,
      {
        initialState,
      },
    );

    expect(screen.queryByRole('button', { name: /print/i })).to.exist;
    fireEvent.click(screen.getByRole('button', { name: /print/i }));
  });
  it('should not display print link for cancelled appointment', () => {
    const appointment = {
      ...appointmentData,
      status: 'cancelled',
    };

    const screen = renderWithStoreAndRouter(
      <PrintLink appointment={appointment} />,
      {
        initialState,
      },
    );

    expect(screen.queryByRole('button', { name: /print/i })).to.be.null;
  });
});
