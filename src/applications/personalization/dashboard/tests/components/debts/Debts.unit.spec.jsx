import React from 'react';
// import { expect } from 'chai';
// import { format } from 'date-fns';
// import { render, fireEvent } from '@testing-library/react';
import { renderWithStoreAndRouter } from '~/platform/testing/unit/react-testing-library-helpers';

import BenefitPaymentsAndDebt from '../../../components/debts/Debts';

describe('Debts component', () => {
  let view;
  let initialState;

  describe('happy path render logic', () => {
    beforeEach(() => {
      initialState = {
        allDebts: {
          isLoading: false,
          isError: false,
          copays: [],
          debts: [],
        },
      };

      view = renderWithStoreAndRouter(<BenefitPaymentsAndDebt />, {
        initialState,
      });
    });

    it('renders correctly', () => {
      view.debug();
    });
  });
});
