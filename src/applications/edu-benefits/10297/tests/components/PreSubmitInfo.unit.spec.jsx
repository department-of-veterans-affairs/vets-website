import React from 'react';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';
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

const makeElement = () => ({
  setAttribute: sinon.spy(),
  innerHTML: '',
});

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
    expect(statementOfTruth).to.have.attr('heading', 'Certification statement');
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

  it('hides clarifying text and rewrites labels; applies nowrap on wide screens', async () => {
    const originalInnerWidth = window.innerWidth;
    Object.defineProperty(window, 'innerWidth', {
      value: 1024,
      configurable: true,
    });

    const privacyRoot = {};
    const statementRoot = {};
    documentQuerySelectorStub
      .withArgs('va-privacy-agreement')
      .returns(privacyRoot);
    documentQuerySelectorStub
      .withArgs('va-statement-of-truth')
      .returns(statementRoot);

    const clarifyingText = makeElement();
    const statementCheckbox = makeElement();
    const statementLabelEl = makeElement();
    const privacyCheckbox = makeElement();
    const privacyLabelEl = makeElement();
    const statementLabelStyle = makeElement();

    querySelectorStub.callsFake((selector, root) => {
      if (root === statementRoot && selector === 'p:has(va-link)') {
        return Promise.resolve(clarifyingText);
      }
      if (root === statementRoot && selector === 'va-checkbox') {
        return Promise.resolve(statementCheckbox);
      }
      if (root === privacyRoot && selector === 'va-checkbox') {
        return Promise.resolve(privacyCheckbox);
      }
      if (root === statementCheckbox && selector === 'span[part="label"]') {
        return Promise.resolve(statementLabelEl);
      }
      if (
        root === statementCheckbox &&
        selector === 'label[for="checkbox-element"]'
      ) {
        return Promise.resolve(statementLabelStyle);
      }
      if (root === privacyCheckbox && selector === 'span[part="label"]') {
        return Promise.resolve(privacyLabelEl);
      }
      return Promise.resolve(null);
    });

    renderWithStore(<PreSubmitInfo {...defaultProps} />);

    await waitFor(() => {
      sinon.assert.calledWith(
        clarifyingText.setAttribute,
        'style',
        'display: none;',
      );

      expect(statementLabelEl.innerHTML).to.equal(
        'Yes, I have read and acknowledge this statement.',
      );
      expect(privacyLabelEl.innerHTML).to.equal(
        'Yes, I have read and acknowledge these statements.',
      );

      expect(privacyCheckbox.innerHTML).to.equal('please check');

      sinon.assert.calledWith(
        statementLabelStyle.setAttribute,
        'style',
        'white-space: nowrap;',
      );
    });

    Object.defineProperty(window, 'innerWidth', { value: originalInnerWidth });
  });

  it('applies break-spaces on privacy label for small screens', async () => {
    const originalInnerWidth = window.innerWidth;
    Object.defineProperty(window, 'innerWidth', {
      value: 480,
      configurable: true,
    });

    const privacyRoot = {};
    const statementRoot = {};
    documentQuerySelectorStub
      .withArgs('va-privacy-agreement')
      .returns(privacyRoot);
    documentQuerySelectorStub
      .withArgs('va-statement-of-truth')
      .returns(statementRoot);

    const statementCheckbox = makeElement();
    const privacyCheckbox = makeElement();
    const privacyLabelStyle = makeElement();

    querySelectorStub.callsFake((selector, root) => {
      if (root === statementRoot && selector === 'va-checkbox')
        return Promise.resolve(statementCheckbox);
      if (root === privacyRoot && selector === 'va-checkbox')
        return Promise.resolve(privacyCheckbox);
      if (
        root === privacyCheckbox &&
        selector === 'label[for="checkbox-element"]'
      ) {
        return Promise.resolve(privacyLabelStyle);
      }
      return Promise.resolve(null);
    });

    renderWithStore(<PreSubmitInfo {...defaultProps} />);

    await waitFor(() => {
      sinon.assert.calledWith(
        privacyLabelStyle.setAttribute,
        'style',
        'white-space: break-spaces;',
      );
    });

    Object.defineProperty(window, 'innerWidth', { value: originalInnerWidth });
  });
  it('on small screens, formats the privacy error message and rewrites its text', async () => {
    const originalInnerWidth = window.innerWidth;
    Object.defineProperty(window, 'innerWidth', {
      value: 480,
      configurable: true,
    });

    const privacyRoot = {};
    const statementRoot = {};
    documentQuerySelectorStub
      .withArgs('va-privacy-agreement')
      .returns(privacyRoot);
    documentQuerySelectorStub
      .withArgs('va-statement-of-truth')
      .returns(statementRoot);

    const privacyCheckbox = makeElement();
    const errorMessage = makeElement();
    errorMessage.innerHTML = 'Some other message';

    querySelectorStub.callsFake((selector, root) => {
      if (root === privacyRoot && selector === 'va-checkbox')
        return Promise.resolve(privacyCheckbox);
      if (
        root === privacyCheckbox &&
        selector === '[class="usa-error-message"]'
      ) {
        return Promise.resolve(errorMessage);
      }
      return Promise.resolve(null);
    });

    const propsWithError = { ...defaultProps, showError: true };
    renderWithStore(<PreSubmitInfo {...propsWithError} />);

    await waitFor(() => {
      sinon.assert.calledWith(
        errorMessage.setAttribute,
        'style',
        'white-space: break-spaces;',
      );
      expect(errorMessage.innerHTML).to.equal(
        'You must read and acknowledge these statements',
      );
    });

    Object.defineProperty(window, 'innerWidth', { value: originalInnerWidth });
  });
});
