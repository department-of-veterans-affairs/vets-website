import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import ConfirmationPage from '../../../containers/ConfirmationPage';

describe('CG <ConfirmationPage>', () => {
  const mockStore = {
    getState: () => ({
      form: {
        submission: {
          response: {
            id: '60740',
            type: 'saved_claim_caregivers_assistance_claims',
          },
          timestamp: 1666887649663,
        },
        data: {
          veteranFullName: {
            first: 'John',
            middle: 'Marjorie',
            last: 'Smith',
            suffix: 'Sr.',
          },
        },
      },
    }),
    subscribe: () => {},
    dispatch: () => {},
  };

  it('should render with Veterans name and the submission timestamp', () => {
    const view = render(
      <Provider store={mockStore}>
        <ConfirmationPage />
      </Provider>,
    );
    const selectors = {
      wrapper: view.container.querySelector('.caregiver-confirmation'),
      name: view.container.querySelector('[data-testid="cg-veteranfullname"]'),
      timestamp: view.container.querySelector('[data-testid="cg-timestamp"]'),
    };
    expect(selectors.wrapper).to.not.be.empty;
    expect(selectors.name).to.contain.text('John Marjorie Smith Sr.');
    expect(selectors.timestamp).to.contain.text('Oct. 27, 2022');
  });

  it('should contain sections that will not be displayed in print view', () => {
    const view = render(
      <Provider store={mockStore}>
        <ConfirmationPage />
      </Provider>,
    );
    const selector = view.container.querySelectorAll('.no-print');
    expect(selector).to.have.lengthOf(3);
  });
});
