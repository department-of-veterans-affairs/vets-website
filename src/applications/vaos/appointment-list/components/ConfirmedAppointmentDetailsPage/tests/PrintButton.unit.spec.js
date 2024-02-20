import React from 'react';
import { expect } from 'chai';
import { fireEvent } from '@testing-library/dom';
import { renderWithStoreAndRouter } from '~/platform/testing/unit/react-testing-library-helpers';
import PrintButton from '../PrintButton';

describe('VAOS Component: PrintButton', () => {
  const initialState = {
    featureToggles: {},
  };
  it('should record GA upon button click', () => {
    const screen = renderWithStoreAndRouter(<PrintButton />, {
      initialState,
    });

    expect(screen.getByRole('button', { name: /print/i })).to.exist;
    fireEvent.click(screen.getByRole('button', { name: /print/i }));
    expect(window.dataLayer[0]).to.deep.equal({
      event: 'vaos-print-list-clicked',
    });
  });
});
