import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import { PreSubmitInfo } from '../../components/PreSubmitInfo';

const statementOfTruthConfig = {
  heading: 'Declaration of intent',
  textInputLabel: 'Your full name',
  messageAriaDescribedby: 'I have read and accept the privacy policy.',
  fullNamePath: 'claimantPersonalInformation.fullName',
  body: () => <p>Privacy policy body</p>,
};

const defaultProps = {
  formData: {
    claimantPersonalInformation: {
      fullName: { first: 'John', middle: 'A', last: 'Doe' },
    },
    statementOfTruthSignature: '',
    statementOfTruthCertified: false,
  },
  preSubmitInfo: {
    statementOfTruth: statementOfTruthConfig,
  },
  showError: false,
  setPreSubmit: sinon.spy(),
  user: {},
};

const createMockStore = () =>
  createStore(() => ({
    user: { login: { currentlyLoggedIn: false } },
  }));

const renderWithStore = (component, store = createMockStore()) =>
  render(<Provider store={store}>{component}</Provider>);

describe('10278 <PreSubmitInfo />', () => {
  beforeEach(() => {
    if (defaultProps.setPreSubmit?.resetHistory) {
      defaultProps.setPreSubmit.resetHistory();
    }
  });

  it('renders va-statement-of-truth with heading from statementOfTruth', () => {
    const { container } = renderWithStore(<PreSubmitInfo {...defaultProps} />);
    const sot = container.querySelector('va-statement-of-truth');
    expect(sot).to.exist;
    expect(sot.getAttribute('heading')).to.equal('Declaration of intent');
  });

  it('shows signature error when showError is true and signature does not match', () => {
    const props = {
      ...defaultProps,
      showError: true,
      formData: {
        ...defaultProps.formData,
        statementOfTruthSignature: 'Wrong Name',
      },
    };
    const { container } = renderWithStore(<PreSubmitInfo {...props} />);
    const sot = container.querySelector('va-statement-of-truth');
    const inputError = sot.getAttribute('input-error');
    expect(inputError).to.include(
      'Enter your name exactly as it appears on your application',
    );
    expect(inputError).to.include('John A Doe');
  });

  it('does not show signature error when signature matches expected name', () => {
    const props = {
      ...defaultProps,
      showError: true,
      formData: {
        ...defaultProps.formData,
        statementOfTruthSignature: 'John A Doe',
      },
    };
    const { container } = renderWithStore(<PreSubmitInfo {...props} />);
    const sot = container.querySelector('va-statement-of-truth');
    expect(sot.getAttribute('input-error')).to.be.oneOf([null, '', undefined]);
  });

  it('shows checkbox error when showError is true and not certified', () => {
    const props = { ...defaultProps, showError: true };
    const { container } = renderWithStore(<PreSubmitInfo {...props} />);
    const sot = container.querySelector('va-statement-of-truth');
    expect(sot.getAttribute('checkbox-error')).to.equal(
      'You must certify by checking the box',
    );
  });

  it('does not show checkbox error when certified', () => {
    const props = {
      ...defaultProps,
      showError: true,
      formData: {
        ...defaultProps.formData,
        statementOfTruthCertified: true,
      },
    };
    const { container } = renderWithStore(<PreSubmitInfo {...props} />);
    const sot = container.querySelector('va-statement-of-truth');
    expect(sot.getAttribute('checkbox-error')).to.be.oneOf([
      null,
      '',
      undefined,
    ]);
  });

  it('calls setPreSubmit when signature input changes', () => {
    const setPreSubmitSpy = sinon.spy();
    const props = { ...defaultProps, setPreSubmit: setPreSubmitSpy };
    const { container } = renderWithStore(<PreSubmitInfo {...props} />);
    const sot = container.querySelector('va-statement-of-truth');
    sot.dispatchEvent(
      new CustomEvent('vaInputChange', { detail: { value: 'John A Doe' } }),
    );
    expect(
      setPreSubmitSpy.calledWith('statementOfTruthSignature', 'John A Doe'),
    ).to.be.true;
  });

  it('calls setPreSubmit when checkbox changes', () => {
    const setPreSubmitSpy = sinon.spy();
    const props = { ...defaultProps, setPreSubmit: setPreSubmitSpy };
    const { container } = renderWithStore(<PreSubmitInfo {...props} />);
    const sot = container.querySelector('va-statement-of-truth');
    sot.dispatchEvent(
      new CustomEvent('vaCheckboxChange', { detail: { checked: true } }),
    );
    expect(setPreSubmitSpy.calledWith('statementOfTruthCertified', true)).to.be
      .true;
  });
});
