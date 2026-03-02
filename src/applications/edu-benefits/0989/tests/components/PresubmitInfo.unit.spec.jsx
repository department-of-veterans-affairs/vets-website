import React from 'react';
import { expect } from 'chai';
import { render, waitFor, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import sinon from 'sinon';

import { BasePresubmitInfo as PresubmitInfo } from '../../components/PresubmitInfo';

const defaultProps = {
  formData: {
    statementOfTruthSignature: '',
    statementOfTruthCertified: false,
    applicantName: {
      first: 'John',
      last: 'Doe',
    },
  },
  preSubmitInfo: {
    error: 'Test error',
    statementOfTruth: {
      heading: 'Statement of truth',
      textInputLabel: 'Your full name',
      messageAriaDescribedby: 'test',
    },
  },
  showError: false,
  user: {
    profile: {
      userFullName: {
        first: 'John',
        last: 'Doe',
      },
    },
  },
};

const createMockStore = (isLoggedIn = false) => {
  return createStore(() => ({
    user: {
      login: {
        currentlyLoggedIn: isLoggedIn,
      },
    },
  }));
};

const renderWithStore = (component, store = createMockStore()) => {
  return render(<Provider store={store}>{component}</Provider>);
};

describe('<PresubmitInfo />', () => {
  it('should render statement of truth component', () => {
    const { container } = renderWithStore(<PresubmitInfo {...defaultProps} />);
    const statementOfTruth = container.querySelector('va-statement-of-truth');

    expect(statementOfTruth).to.exist;
    expect(statementOfTruth).to.have.attr('heading', 'Certification statement');

    expect(statementOfTruth.textContent).to.contain(
      'I confirm that the identifying information in this form is accurate and has been represented correctly.',
    );
  });

  it('handles text input correctly', async () => {
    const spy = sinon.spy();
    const props = {
      ...defaultProps,
      setPreSubmit: spy,
    };

    const { container } = renderWithStore(<PresubmitInfo {...props} />);
    const statementOfTruth = container.querySelector('va-statement-of-truth');

    fireEvent(
      statementOfTruth,
      new CustomEvent('vaInputChange', {
        detail: { value: 'John Doe' },
      }),
    );
    await waitFor(() => {
      expect(spy.called).to.be.true;
    });
  });

  it('handles checkbox input correctly', async () => {
    const spy = sinon.spy();
    const props = {
      ...defaultProps,
      setPreSubmit: spy,
    };

    const { container } = renderWithStore(<PresubmitInfo {...props} />);
    const statementOfTruth = container.querySelector('va-statement-of-truth');

    fireEvent(
      statementOfTruth,
      new CustomEvent('vaCheckboxChange', {
        detail: { checked: true },
      }),
    );
    await waitFor(() => {
      expect(spy.called).to.be.true;
    });
  });

  it('handles a completed state correctly', async () => {
    const completedSpy = sinon.spy();
    const props = {
      ...defaultProps,
      formData: {
        statementOfTruthSignature: 'John Doe',
        statementOfTruthCertified: true,
        applicantName: {
          first: 'John',
          last: 'Doe',
        },
      },
      onSectionComplete: completedSpy,
    };

    renderWithStore(<PresubmitInfo {...props} />);

    await waitFor(() => {
      expect(completedSpy.called).to.be.true;
    });
  });

  it('shows errors correctly', async () => {
    const props = {
      ...defaultProps,
      showError: true,
    };

    const { container } = renderWithStore(<PresubmitInfo {...props} />);
    const statementOfTruth = container.querySelector('va-statement-of-truth');
    expect(statementOfTruth).to.have.attr(
      'input-error',
      'Enter your name exactly as it appears on your application: John Doe',
    );

    expect(statementOfTruth).to.have.attr(
      'checkbox-error',
      'You must certify by checking the box',
    );
  });
});
