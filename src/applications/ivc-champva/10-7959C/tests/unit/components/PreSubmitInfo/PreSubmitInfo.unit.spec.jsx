import React from 'react';
import { Provider } from 'react-redux';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon-v20';
import PreSubmitInfo from '../../../../components/PreSubmitInfo';

const { CustomComponent } = PreSubmitInfo;

const DEFAULT_FULL_NAME = 'John Q Doe';

const completeSignatureBox = (component, signature = DEFAULT_FULL_NAME) => {
  component.__events.vaInputChange({ detail: { value: signature } });
  component.__events.vaCheckboxChange({ detail: { checked: true } });
  component.__events.vaInputBlur();
};

const subject = ({
  dispatch = () => {},
  onSectionComplete = () => {},
  role = 'applicant',
  showError = false,
  signature = '',
  status = false,
} = {}) => {
  const mockStore = {
    getState: () => ({
      form: { submission: { status } },
    }),
    subscribe: () => {},
    dispatch,
  };
  const props = {
    formData: {
      applicantName: { first: 'John', middle: 'Q', last: 'Doe' },
      certifierRole: role,
      signature,
    },
    showError,
    onSectionComplete,
  };
  const { container, unmount } = render(
    <Provider store={mockStore}>
      <CustomComponent {...props} />
    </Provider>,
  );
  return {
    element: container.querySelector('va-statement-of-truth'),
    textContent: container.textContent,
    unmount,
  };
};

describe('PreSubmitInfo', () => {
  afterEach(() => sinon.restore());

  context('statement text', () => {
    it('should render default statement text when certifier role is "applicant"', () => {
      const { textContent } = subject();
      expect(textContent).to.not.include(DEFAULT_FULL_NAME);
    });

    it('should render representative statement text when certifier role is "other"', () => {
      const { textContent } = subject({ role: 'other' });
      expect(textContent).to.include(DEFAULT_FULL_NAME);
    });
  });

  context('validation', () => {
    it('should show checkbox & input error when showError is true', () => {
      const { element } = subject({ showError: true });
      expect(element).to.have.attr('input-error');
      expect(element).to.have.attr('checkbox-error');
    });

    it('should not show errors when form has been submitted', () => {
      const { element } = subject({ showError: true, status: true });
      expect(element).to.not.have.attr('input-error');
      expect(element).to.not.have.attr('checkbox-error');
    });
  });

  context('name matching', () => {
    it('should validate exact name match for applicant', async () => {
      const onSectionComplete = sinon.spy();
      const { element } = subject({ onSectionComplete });
      await waitFor(() => completeSignatureBox(element));
      sinon.assert.calledWith(onSectionComplete, true);
    });

    it('should accept any signature for representative', async () => {
      const onSectionComplete = sinon.spy();
      const { element } = subject({
        onSectionComplete,
        role: 'other',
      });
      await waitFor(() => completeSignatureBox(element, 'Certifier Jones'));
      sinon.assert.calledWith(onSectionComplete, true);
    });
  });

  context('onSectionComplete', () => {
    it('should call onSectionComplete with false on unmount', async () => {
      const onSectionComplete = sinon.spy();
      const { unmount } = subject({ onSectionComplete });
      await waitFor(unmount);
      sinon.assert.calledWith(onSectionComplete, false);
    });

    it('should call onSectionComplete when completion state changes', async () => {
      const onSectionComplete = sinon.spy();
      const { element } = subject({ onSectionComplete });
      element.__events.vaCheckboxChange({
        detail: { checked: true },
      });
      await waitFor(() => sinon.assert.calledWith(onSectionComplete, false));
    });
  });

  context('signature state', () => {
    it('should initialize signature from formData', () => {
      const { element } = subject({ signature: 'Test Name' });
      expect(element).to.have.attr('input-value', 'Test Name');
    });

    it('should dispatch "setData" when signature changes', () => {
      const dispatch = sinon.spy();
      const { element } = subject({ dispatch });
      element.__events.vaInputChange({
        detail: { value: 'Test Name' },
      });
      sinon.assert.called(dispatch);
    });
  });
});
