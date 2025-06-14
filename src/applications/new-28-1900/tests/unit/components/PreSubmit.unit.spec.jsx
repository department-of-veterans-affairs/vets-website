import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import PreSubmit from '../../../components/PreSubmit';

describe('<PreSubmit>', () => {
  const subject = ({ status = false } = {}) => {
    const props = {
      onSectionComplete: f => f,
      formData: {
        veteranFullName: {
          first: 'John',
          middle: '',
          last: 'Smith',
        },
      },
      showError: false,
    };
    const mockStore = {
      getState: () => ({
        form: { submission: { status } },
      }),
      subscribe: () => {},
    };
    const { container } = render(
      <Provider store={mockStore}>
        <PreSubmit.CustomComponent {...props} />
      </Provider>,
    );
    const selectors = () => ({
      vaTextInputs: container.querySelectorAll('va-text-input'),
    });
    return { container, selectors };
  };

  context('when it renders', () => {
    it('should display the statement of truth signature field', () => {
      const { selectors } = subject({});
      const { vaTextInputs } = selectors();
      expect(vaTextInputs[0]).to.have.attr('label', 'Your full name');
    });
  });
});
