import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '~/platform/testing/unit/react-testing-library-helpers';
import FacilityPhone from './FacilityPhone';

describe('VAOS Component: FacilityPhone', () => {
  const initialState = {};

  it('should render contact number', () => {
    const screen = renderWithStoreAndRouter(
      <FacilityPhone contact="123-456-7890" />,
      {
        initialState,
      },
    );

    expect(screen.getByText(new RegExp(`Phone:`))).to.exist;

    const vaPhone = screen.getByTestId('facility-telephone');
    expect(vaPhone).to.exist;
    expect(vaPhone).to.have.attribute('contact', '123-456-7890');
    expect(vaPhone).not.to.have.attribute('extension');

    expect(screen.getByTestId('tty-telephone')).to.exist;
  });

  it('should render contact number with extension', () => {
    const screen = renderWithStoreAndRouter(
      <FacilityPhone contact="123-456-7890 x1234" />,
      {
        initialState,
      },
    );

    expect(screen.getByText(new RegExp(`Phone:`))).to.exist;

    const vaPhone = screen.getByTestId('facility-telephone');
    expect(vaPhone).to.exist;
    expect(vaPhone).to.have.attribute('contact', '123-456-7890');
    expect(vaPhone).to.have.attribute('extension', '1234');

    expect(screen.getByTestId('tty-telephone')).to.exist;
  });

  it('should render contact number and extension', () => {
    const screen = renderWithStoreAndRouter(
      <FacilityPhone contact="123-456-7890" extension="1111" />,
      {
        initialState,
      },
    );

    expect(screen.getByText(new RegExp(`Phone:`))).to.exist;

    const vaPhone = screen.getByTestId('facility-telephone');
    expect(vaPhone).to.exist;
    expect(vaPhone).to.have.attribute('contact', '123-456-7890');
    expect(vaPhone).to.have.attribute('extension', '1111');

    expect(screen.getByTestId('tty-telephone')).to.exist;
  });
});
