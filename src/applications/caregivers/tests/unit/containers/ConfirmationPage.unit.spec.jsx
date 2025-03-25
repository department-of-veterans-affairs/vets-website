import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import ConfirmationPage from '../../../containers/ConfirmationPage';

describe('CG <ConfirmationPage>', () => {
  const subject = () => {
    const mockStore = {
      getState: () => ({
        form: {
          submission: {},
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
  });
});
