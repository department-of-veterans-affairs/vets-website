import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import PresubmitInfo from '../../components/PresubmitInfo';

const defaultProps = {
  formData: {
    privacyAgreementAccepted: false,
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

describe('<PresubmitInfo />', () => {
  it('should render statement of truth component', () => {
    const { container } = renderWithStore(<PresubmitInfo {...defaultProps} />);
    const statementOfTruth = container.querySelector('va-statement-of-truth');

    expect(statementOfTruth).to.exist;
    expect(statementOfTruth).to.have.attr('heading', 'Certification statement');

    expect(statementOfTruth.textContent).to.contain(
      'Willfully false statements as to a material fact in a claim for education benefits payable by VA may result in a fine',
    );
  });
});
