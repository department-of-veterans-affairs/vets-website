import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon-v20';
import LimitedConsent, {
  content,
} from '../../../components/4142/LimitedConsent';

describe('LimitedConsent', () => {
  const defaultProps = {
    onChange: sinon.spy(),
    setRadioError: sinon.spy(),
    setTextAreaError: sinon.spy(),
    radioError: false,
    textAreaError: false,
  };

  afterEach(() => {
    sinon.restore();
  });

  describe('renders correctly', () => {
    it('should render correctly with add mode label', () => {
      const { container } = render(
        <LimitedConsent {...defaultProps} addOrEditMode="add" />,
      );

      const options = container.querySelectorAll('va-radio-option');
      const radio = container.querySelector('va-radio');

      expect(options.length).to.equal(2);
      expect(radio.getAttribute('error')).to.be.null;
      expect(radio.getAttribute('label')).to.equal(content.prompt);
    });

    it('should render with edit mode label', () => {
      const { container } = render(
        <LimitedConsent {...defaultProps} addOrEditMode="edit" />,
      );

      const radio = container.querySelector('va-radio');

      expect(radio.getAttribute('label')).to.equal(content.editPrompt);
    });

    it('should render radio error when radioError is true', () => {
      const { container } = render(
        <LimitedConsent {...defaultProps} radioError />,
      );
      const radio = container.querySelector('va-radio');

      expect(radio.getAttribute('error')).to.equal(content.radioError);
    });
  });

  describe('textarea visibility', () => {
    it('should not show textarea when the component is first loaded', () => {
      const { container } = render(<LimitedConsent {...defaultProps} />);
      const textarea = container.querySelector('va-textarea');

      expect(textarea).to.not.exist;
    });

    it('should show textarea when the answer to the prompt is "Yes"', () => {
      const { container } = render(
        <LimitedConsent
          {...defaultProps}
          currentEvidenceData={{ lcPrompt: 'Y' }}
        />,
      );

      const textarea = container.querySelector('va-textarea');

      expect(textarea).to.exist;
    });

    it('should not show textarea when the answer to the prompt is "No"', () => {
      const { container } = render(
        <LimitedConsent
          {...defaultProps}
          currentEvidenceData={{ lcPrompt: 'N' }}
        />,
      );

      const textarea = container.querySelector('va-textarea');

      expect(textarea).to.not.exist;
    });
  });

  describe('textarea content', () => {
    it('should render textarea correctly', () => {
      const { container } = render(
        <LimitedConsent
          {...defaultProps}
          currentEvidenceData={{ lcPrompt: 'Y' }}
        />,
      );
      const textarea = container.querySelector('va-textarea');
      const hint = textarea.getAttribute('hint');

      expect(textarea.getAttribute('label')).to.equal(content.textareaLabel);
      expect(hint).to.include('If you choose to limit consent');
      expect(textarea.getAttribute('required')).to.equal('true');
      expect(textarea.getAttribute('value')).to.equal('');
      expect(textarea.getAttribute('error')).to.be.null;
    });

    it('should render textarea with details value when present', () => {
      const { container } = render(
        <LimitedConsent
          {...defaultProps}
          currentEvidenceData={{
            lcPrompt: 'Y',
            lcDetails: 'Only records from 2020-2023',
          }}
        />,
      );

      const textarea = container.querySelector('va-textarea');

      expect(textarea.getAttribute('value')).to.equal(
        'Only records from 2020-2023',
      );
    });

    it('should render textarea error when textAreaError is true', () => {
      const { container } = render(
        <LimitedConsent
          {...defaultProps}
          currentEvidenceData={{ lcPrompt: 'Y' }}
          textAreaError
        />,
      );
      const textarea = container.querySelector('va-textarea');

      expect(textarea.getAttribute('error')).to.equal(content.textareaError);
    });
  });

  describe('radioError clearing', () => {
    it('should clear radioError when the radio question has been answered', async () => {
      const setRadioError = sinon.spy();
      const props = {
        ...defaultProps,
        setRadioError,
        radioError: true,
        currentEvidenceData: { lcPrompt: 'Y' },
      };

      render(<LimitedConsent {...props} />);

      await waitFor(() => {
        expect(setRadioError.calledWith(false)).to.be.true;
      });
    });
  });

  describe('textAreaError clearing', () => {
    it('should clear textAreaError when the textarea has been filled out', async () => {
      const setTextAreaError = sinon.spy();
      const props = {
        ...defaultProps,
        setTextAreaError,
        textAreaError: true,
        currentEvidenceData: { lcDetails: 'Some details' },
      };

      render(<LimitedConsent {...props} />);

      await waitFor(() => {
        expect(setTextAreaError.calledWith(false)).to.be.true;
      });
    });
  });

  describe('onRadioChange handler', () => {
    describe('when the value is undefined', () => {
      it('should call onChange with correct value', () => {
        const onChange = sinon.spy();
        const { container } = render(
          <LimitedConsent {...defaultProps} onChange={onChange} />,
        );

        const radio = container.querySelector('va-radio');

        radio.dispatchEvent(
          new CustomEvent('vaValueChange', {
            detail: { value: '' },
          }),
        );

        expect(onChange.calledOnce).to.be.false;
      });
    });

    it('should call onChange with correct value', () => {
      const onChange = sinon.spy();
      const { container } = render(
        <LimitedConsent {...defaultProps} onChange={onChange} />,
      );

      const radio = container.querySelector('va-radio');

      radio.dispatchEvent(
        new CustomEvent('vaValueChange', {
          detail: { value: 'Y' },
        }),
      );

      expect(onChange.calledOnce).to.be.true;
      expect(onChange.firstCall.args[0]).to.deep.equal({ lcPrompt: 'Y' });
    });

    it('should call setRadioError(false) when radio changes', () => {
      const setRadioError = sinon.spy();
      const { container } = render(
        <LimitedConsent
          {...defaultProps}
          setRadioError={setRadioError}
          radioError
        />,
      );
      const radio = container.querySelector('va-radio');

      radio.dispatchEvent(
        new CustomEvent('vaValueChange', {
          detail: { value: 'Y' },
        }),
      );

      expect(setRadioError.calledWith(false)).to.be.true;
    });
  });

  describe('onInputChange handler', () => {
    it('should call onChange with lcDetails value', () => {
      const onChange = sinon.spy();
      const { container } = render(
        <LimitedConsent
          {...defaultProps}
          onChange={onChange}
          currentEvidenceData={{ lcPrompt: 'Y' }}
        />,
      );

      const textarea = container.querySelector('va-textarea');
      textarea.value = 'Only records from 2020';

      const inputEvent = new Event('input', { bubbles: true });
      textarea.dispatchEvent(inputEvent);

      expect(onChange.called).to.be.true;
      const callArgs = onChange.firstCall.args[0];
      expect(callArgs.lcDetails).to.equal('Only records from 2020');
    });
  });
});
