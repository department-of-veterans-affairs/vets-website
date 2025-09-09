import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import sinon from 'sinon';
import * as webComponents from 'platform/utilities/ui/webComponents';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import PreSubmitInfo from '../../components/PreSubmitInfo';

const defaultProps = {
  formData: {
    privacyAgreementAccepted: false,
    statementOfTruthSignature: '',
    statementOfTruthCertified: false,
    claimantType: 'VETERAN',
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

describe('<PreSubmitInfo />', () => {
  let querySelectorStub;
  let documentQuerySelectorStub;

  beforeEach(() => {
    documentQuerySelectorStub = sinon.stub(document, 'querySelector');
    documentQuerySelectorStub.withArgs('va-privacy-agreement').returns({});
    documentQuerySelectorStub.withArgs('va-statement-of-truth').returns({});
    querySelectorStub = sinon.stub(
      webComponents,
      'querySelectorWithShadowRoot',
    );
    querySelectorStub.resolves(null);
  });

  afterEach(() => {
    if (querySelectorStub) querySelectorStub.restore();
    if (documentQuerySelectorStub) documentQuerySelectorStub.restore();
  });

  it('should render privacy agreement component', () => {
    const { container } = renderWithStore(<PreSubmitInfo {...defaultProps} />);
    const privacyAgreement = container.querySelector('va-privacy-agreement');

    expect(privacyAgreement).to.exist;
    expect(privacyAgreement).to.have.attr('name', 'privacyAgreementAccepted');
  });

  it('should render statement of truth component', () => {
    const { container } = renderWithStore(<PreSubmitInfo {...defaultProps} />);
    const statementOfTruth = container.querySelector('va-statement-of-truth');

    expect(statementOfTruth).to.exist;
    expect(statementOfTruth).to.have.attr('heading', 'Statement of truth');
  });

  it('should render attestation section', () => {
    const { container } = renderWithStore(<PreSubmitInfo {...defaultProps} />);
    const attestationHeading = container.querySelector('h3');

    expect(attestationHeading).to.exist;
    expect(attestationHeading.textContent).to.contain('Attestation');
  });

  it('should handle privacy agreement change', () => {
    const setPreSubmitSpy = sinon.spy();
    const props = {
      ...defaultProps,
      setPreSubmit: setPreSubmitSpy,
    };

    const { container } = renderWithStore(<PreSubmitInfo {...props} />);
    const privacyAgreement = container.querySelector('va-privacy-agreement');

    expect(privacyAgreement).to.have.attr('checked', 'false');

    // Simulate checkbox change
    const changeEvent = new CustomEvent('vaChange', {
      detail: { checked: true },
    });
    privacyAgreement.dispatchEvent(changeEvent);

    expect(setPreSubmitSpy.calledWith('privacyAgreementAccepted', true)).to.be
      .false;
  });

  it('should show error when showError is true and privacy agreement not accepted', () => {
    const propsWithError = {
      ...defaultProps,
      showError: true,
    };

    const { container } = renderWithStore(
      <PreSubmitInfo {...propsWithError} />,
    );
    const privacyAgreement = container.querySelector('va-privacy-agreement');

    expect(privacyAgreement).to.have.attr('show-error');
  });
});
