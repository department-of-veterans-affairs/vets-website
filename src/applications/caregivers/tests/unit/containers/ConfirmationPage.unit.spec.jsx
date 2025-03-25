import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
<<<<<<< HEAD

import ConfirmationPage from '../../../containers/ConfirmationPage';

describe('CG <ConfirmationPage>', () => {
  const getData = ({ submission = {} }) => ({
    mockStore: {
      getState: () => ({
        form: {
          submission,
=======
import ConfirmationPage from '../../../containers/ConfirmationPage';

describe('CG <ConfirmationPage>', () => {
  const subject = () => {
    const mockStore = {
      getState: () => ({
        form: {
          submission: {},
>>>>>>> main
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
<<<<<<< HEAD
    },
  });
  const subject = ({ mockStore }) =>
    render(
      <Provider store={mockStore}>
        <ConfirmationPage />
      </Provider>,
    );

  it('should render with Veterans name when submission response is omitted', () => {
    const { mockStore } = getData({});
    const { container } = subject({ mockStore });
    const selectors = {
      wrapper: container.querySelector('.caregiver-confirmation'),
      name: container.querySelector('[data-testid="cg-veteranfullname"]'),
      timestamp: container.querySelector('[data-testid="cg-timestamp"]'),
    };
    expect(selectors.wrapper).to.not.be.empty;
    expect(selectors.name).to.contain.text('John Marjorie Smith Sr.');
    expect(selectors.timestamp).to.not.exist;
  });

  it('should render with Veterans name and submission timestamp when submission response is present', () => {
    const submission = {
      response: {
        id: '60740',
        type: 'saved_claim_caregivers_assistance_claims',
      },
      timestamp: 1666887649663,
    };
    const { mockStore } = getData({ submission });
    const { container } = subject({ mockStore });
    const selectors = {
      wrapper: container.querySelector('.caregiver-confirmation'),
      name: container.querySelector('[data-testid="cg-veteranfullname"]'),
      timestamp: container.querySelector('[data-testid="cg-timestamp"]'),
    };
    expect(selectors.wrapper).to.not.be.empty;
    expect(selectors.name).to.contain.text('John Marjorie Smith Sr.');
    expect(selectors.timestamp).to.contain.text('Oct. 27, 2022');
  });

  it('should contain sections that will not be displayed in print view', () => {
    const { mockStore } = getData({});
    const { container } = subject({ mockStore });
    const selector = container.querySelectorAll('.no-print');
    expect(selector).to.have.length;
=======
    };
    const { container } = render(
      <Provider store={mockStore}>
        <ConfirmationPage route={{ formConfig: {} }} />
      </Provider>,
    );
    const selectors = () => ({
      wrapper: container.querySelector('.caregiver-confirmation'),
      printContainers: container.querySelectorAll('.no-print'),
    });
    return { selectors };
  };

  it('should contain sections that will not be displayed in print view', () => {
    const { selectors } = subject();
    const { wrapper, printContainers } = selectors();
    expect(wrapper).to.not.be.empty;
    expect(printContainers).to.have.length;
>>>>>>> main
  });
});
