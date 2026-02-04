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
      'The information you provide in this application will help us determine if your application is accepted for the approval of a program ina foreign country.',
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
        authorizingOfficial: {
          fullName: {
            first: 'John',
            last: 'Doe',
          },
        },
      },
      onSectionComplete: completedSpy,
    };

    renderWithStore(<PresubmitInfo {...props} />);

    await waitFor(() => {
      expect(completedSpy.called).to.be.true;
    });
  });
});
