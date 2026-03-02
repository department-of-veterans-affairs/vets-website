import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import PreSubmitInfo from '../../components/PreSubmitInfo';

const defaultProps = {
  formData: {
    privacyAgreementAccepted: false,
    statementOfTruthSignature: '',
    statementOfTruthCertified: false,
  },
  preSubmitInfo: {
    error: 'Test error',
    statementOfTruth: {
      heading: 'Certification statement',
      textInputLabel: 'Your full name',
      messageAriaDescribedby: 'test',
    },
  },
  showError: false,
  setPreSubmit: sinon.spy(),
  user: {
    profile: {
      userFullName: {
        first: 'John',
        middle: 'A',
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

describe('22-10272 <PresubmitInfo />', () => {
  it('should render statement of truth note', () => {
    const { getByTestId } = renderWithStore(
      <PreSubmitInfo {...defaultProps} />,
    );
    const note = getByTestId('statement-of-truth-note');

    expect(note).to.exist;
    expect(note.innerHTML).to.contain('According to federal law');
  });

  it('should render statement of truth component', () => {
    const { container } = renderWithStore(<PreSubmitInfo {...defaultProps} />);
    const statementOfTruth = container.querySelector('va-statement-of-truth');

    expect(statementOfTruth).to.exist;
    expect(statementOfTruth).to.have.attr('heading', 'Certification statement');
  });

  it('should render signature and checkbox errors when applicable', () => {
    const customProps = {
      ...defaultProps,
      formData: {
        ...defaultProps.formData,
        statementOfTruthSignature: 'Incorrect Name',
      },
      showError: true,
    };
    const { container } = renderWithStore(<PreSubmitInfo {...customProps} />);

    const inputError = container.querySelector(
      'va-statement-of-truth[input-error]',
    );
    const checkboxError = container.querySelector(
      'va-statement-of-truth[checkbox-error]',
    );

    expect(inputError).to.exist;
    expect(checkboxError).to.exist;
  });
});
