import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import PreSubmitInfo from '../../components/PreSubmitInfo';

describe('<PreSubmitInfo />', () => {
  let sandbox;
  let setPreSubmitSpy;
  let onSectionCompleteSpy;
  const mockStore = configureStore([]);
  const store = mockStore({});

  const defaultProps = {
    formData: {
      statementOfTruthSignature: {
        value: '',
        dirty: false,
      },
    },
    showError: false,
    onSectionComplete: () => {},
    setPreSubmit: () => {},
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    setPreSubmitSpy = sandbox.spy();
    onSectionCompleteSpy = sandbox.spy();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should render the component', () => {
    const { container } = render(
      <Provider store={store}>
        <PreSubmitInfo
          {...defaultProps}
          setPreSubmit={setPreSubmitSpy}
          onSectionComplete={onSectionCompleteSpy}
        />
      </Provider>,
    );

    expect(container).to.exist;
  });

  it('should display federal law note', () => {
    const { container } = render(
      <Provider store={store}>
        <PreSubmitInfo
          {...defaultProps}
          setPreSubmit={setPreSubmitSpy}
          onSectionComplete={onSectionCompleteSpy}
        />
        ,
      </Provider>,
    );

    const federalLawNote = container.querySelector('.vads-u-margin-bottom--3');
    expect(federalLawNote).to.exist;
    expect(federalLawNote.textContent).to.contain(
      'According to federal law, there are criminal penalties, including a fine and/or imprisonment for up to 5 years, for withholding information or for providing incorrect information',
    );
    expect(federalLawNote.textContent).to.contain('18 U.S.C. 1001');
  });

  it('should display certification content', () => {
    const { container } = render(
      <Provider store={store}>
        <PreSubmitInfo
          {...defaultProps}
          setPreSubmit={setPreSubmitSpy}
          onSectionComplete={onSectionCompleteSpy}
        />
        ,
      </Provider>,
    );

    const paragraphs = container.querySelectorAll('p');

    expect(paragraphs[0].textContent).to.contain(
      `The information you provide in this application will help us determine if you're eligible for the High Technology Program. We may audit this information to make sure it's accurate.`,
    );

    expect(paragraphs[1].textContent).to.equal(
      `By checking the box below, you're confirming that:`,
    );
  });

  it('should render privacy policy link', () => {
    const { container, getByTestId } = render(
      <Provider store={store}>
        <PreSubmitInfo
          {...defaultProps}
          setPreSubmit={setPreSubmitSpy}
          onSectionComplete={onSectionCompleteSpy}
        />
        ,
      </Provider>,
    );

    expect(getByTestId('privacy-policy-text')).to.exist;

    const vaLink = container.querySelector('va-link');
    expect(vaLink).to.exist;
    expect(vaLink.getAttribute('text')).to.equal('privacy policy.');
    expect(vaLink.getAttribute('aria-label')).to.equal(
      'View the privacy policy',
    );
    expect(vaLink.getAttribute('role')).to.equal('button');
    expect(vaLink.getAttribute('tabIndex')).to.equal('0');
  });

  it('should open modal when privacy policy link is clicked', () => {
    const { container } = render(
      <Provider store={store}>
        <PreSubmitInfo
          {...defaultProps}
          setPreSubmit={setPreSubmitSpy}
          onSectionComplete={onSectionCompleteSpy}
        />
        ,
      </Provider>,
    );

    const vaLink = container.querySelector('va-link');
    fireEvent.click(vaLink);

    const vaModal = container.querySelector('va-modal');
    expect(vaModal).to.exist;
    expect(vaModal.getAttribute('visible')).to.equal('true');
    expect(vaModal.getAttribute('modal-title')).to.equal(
      'Privacy Act Statement',
    );
    expect(vaModal.getAttribute('large')).to.equal('true');
  });

  it('should open modal when Enter key is pressed on privacy policy link', () => {
    const { container } = render(
      <Provider store={store}>
        <PreSubmitInfo
          {...defaultProps}
          setPreSubmit={setPreSubmitSpy}
          onSectionComplete={onSectionCompleteSpy}
        />
      </Provider>,
    );

    const vaLink = container.querySelector('va-link');
    fireEvent.keyDown(vaLink, { key: 'Enter', code: 'Enter', charCode: 13 });

    const vaModal = container.querySelector('va-modal');
    expect(vaModal).to.exist;
    expect(vaModal.getAttribute('visible')).to.equal('true');
  });

  it('should render PrivacyActStatement component in modal', () => {
    const { container } = render(
      <Provider store={store}>
        <PreSubmitInfo
          {...defaultProps}
          setPreSubmit={setPreSubmitSpy}
          onSectionComplete={onSectionCompleteSpy}
        />
        ,
      </Provider>,
    );

    const vaLink = container.querySelector('va-link');
    fireEvent.click(vaLink);

    const privacyActStatement = container.querySelector(
      '[data-testid="privacy-act-statement"]',
    );
    expect(privacyActStatement).to.exist;
  });

  it('should render FormSignature component', () => {
    const { container } = render(
      <Provider store={store}>
        <PreSubmitInfo
          {...defaultProps}
          setPreSubmit={setPreSubmitSpy}
          onSectionComplete={onSectionCompleteSpy}
        />
        ,
      </Provider>,
    );

    const vaTextInput = container.querySelector('va-text-input');
    expect(vaTextInput).to.exist;
  });

  describe('signature validation', () => {
    const formDataWithName = {
      applicantFullName: {
        first: 'John',
        last: 'Doe',
      },
      statementOfTruthSignature: {
        value: '',
        dirty: false,
      },
    };

    it('should validate signature matches applicant full name', () => {
      const { container } = render(
        <Provider store={store}>
          <PreSubmitInfo
            {...defaultProps}
            formData={formDataWithName}
            setPreSubmit={setPreSubmitSpy}
            onSectionComplete={onSectionCompleteSpy}
          />
        </Provider>,
      );

      const vaTextInput = container.querySelector('va-text-input');
      expect(vaTextInput).to.exist;
      expect(vaTextInput.getAttribute('label')).to.equal('Your full name');
    });

    it('should handle applicant name with only first and last name', () => {
      const formDataWithFirstLastOnly = {
        applicantFullName: {
          first: 'Jane',
          middle: '',
          last: 'Smith',
        },
        statementOfTruthSignature: {
          value: '',
          dirty: false,
        },
      };

      const { container } = render(
        <Provider store={store}>
          <PreSubmitInfo
            {...defaultProps}
            formData={formDataWithFirstLastOnly}
            setPreSubmit={setPreSubmitSpy}
            onSectionComplete={onSectionCompleteSpy}
          />
        </Provider>,
      );

      const vaTextInput = container.querySelector('va-text-input');
      expect(vaTextInput).to.exist;
    });
  });
});
