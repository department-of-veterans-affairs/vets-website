import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon-v20';
import AuthorizationNew, {
  content,
} from '../../../components/4142/AuthorizationNew';

describe('AuthorizationNew', () => {
  const defaultProps = {
    addOrEditMode: 'add',
    goBack: sinon.spy(),
    goForward: sinon.spy(),
    onChange: sinon.spy(),
    fullData: {},
    pagePerItemIndex: 0,
  };

  afterEach(() => {
    sinon.restore();
  });

  describe('renders correctly', () => {
    it('should render with title and main form elements', () => {
      const { container } = render(<AuthorizationNew {...defaultProps} />);
      const form = container.querySelector('form');
      const heading = container.querySelector('h3');
      const checkbox = container.querySelector('va-checkbox');
      const modal = container.querySelector('va-modal');
      const accordion = container.querySelector('va-accordion');

      expect(form).to.exist;
      expect(heading.textContent).to.equal(content.title);
      expect(checkbox).to.exist;
      expect(modal).to.exist;
      expect(accordion).to.exist;
    });

    it('should not render AuthorizationAlert initially', () => {
      const { container } = render(<AuthorizationNew {...defaultProps} />);
      const alert = container.querySelector('va-alert');

      expect(alert).to.not.exist;
    });
  });

  describe('modal functionality', () => {
    it('should show modal when first privacy button is clicked', () => {
      const { container } = render(<AuthorizationNew {...defaultProps} />);
      const button = container.querySelector('#privacy-modal-button-1');
      const modal = container.querySelector('va-modal');

      button.click();

      expect(modal.hasAttribute('visible')).to.be.true;
    });

    it('should show modal when second privacy button is clicked', () => {
      const { container } = render(<AuthorizationNew {...defaultProps} />);
      const button = container.querySelector('#privacy-modal-button-2');
      const modal = container.querySelector('va-modal');

      button.click();

      expect(modal.hasAttribute('visible')).to.be.true;
    });
  });

  describe('checkbox functionality', () => {
    it('should render checkbox with correct label', () => {
      const { container } = render(<AuthorizationNew {...defaultProps} />);
      const checkbox = container.querySelector('va-checkbox');

      expect(checkbox.getAttribute('label')).to.include(
        'I acknowledge and authorize this release of information',
      );
    });

    it('should render checkbox as checked when authorization is true', () => {
      const props = {
        ...defaultProps,
        fullData: {
          privateEvidence: [{ authorization: true }],
        },
      };

      const { container } = render(<AuthorizationNew {...props} />);
      const checkbox = container.querySelector('va-checkbox');

      expect(checkbox.hasAttribute('checked')).to.be.true;
    });

    it('should call onChange when the checkbox is used', () => {
      const onChange = sinon.spy();
      const { container } = render(
        <AuthorizationNew {...defaultProps} onChange={onChange} />,
      );

      const checkbox = container.querySelector('va-checkbox');

      checkbox.checked = true;
      checkbox.dispatchEvent(
        new CustomEvent('vaChange', {
          detail: { checked: true },
          bubbles: true,
        }),
      );

      expect(onChange.called).to.be.true;
      expect(onChange.firstCall.args[0].authorization).to.be.true;
    });

    it('should preserve existing currentEvidenceData when checkbox changes', () => {
      const onChange = sinon.spy();
      const props = {
        ...defaultProps,
        onChange,
        fullData: {
          privateEvidence: [
            {
              providerName: 'Test Provider',
              lcPrompt: 'Y',
              lcDetails: 'Some details',
            },
          ],
        },
      };

      const { container } = render(<AuthorizationNew {...props} />);
      const checkbox = container.querySelector('va-checkbox');

      checkbox.checked = true;
      checkbox.dispatchEvent(
        new CustomEvent('vaChange', {
          detail: { checked: true },
          bubbles: true,
        }),
      );

      expect(onChange.called).to.be.true;
      const callArgs = onChange.firstCall.args[0];
      expect(callArgs.providerName).to.equal('Test Provider');
      expect(callArgs.lcPrompt).to.equal('Y');
      expect(callArgs.lcDetails).to.equal('Some details');
      expect(callArgs.authorization).to.be.true;
    });
  });

  describe('goForward validation', () => {
    it('should show checkbox error when authorization is not checked and Continue is clicked', () => {
      const { container, rerender } = render(
        <AuthorizationNew {...defaultProps} />,
      );

      const continueButton = container.querySelector(
        '.usa-button-primary, va-button:not([secondary])',
      );

      continueButton.click();

      rerender(<AuthorizationNew {...defaultProps} />);
      const alert = container.querySelector('va-alert');

      expect(alert).to.exist;
    });

    describe('answer to limited consent is "No"', () => {
      it('should call goForward when all required fields are filled', () => {
        const goForward = sinon.spy();
        const props = {
          ...defaultProps,
          goForward,
          fullData: {
            privateEvidence: [
              {
                authorization: true,
                lcPrompt: 'N',
              },
            ],
          },
        };

        const { container } = render(<AuthorizationNew {...props} />);
        const continueButton = container.querySelector(
          '.usa-button-primary, va-button:not([secondary])',
        );

        continueButton.click();

        expect(goForward.called).to.be.true;
      });
    });

    describe('answer to limited consent is "Yes"', () => {
      it('should call goForward when all required fields are filled', () => {
        const goForward = sinon.spy();
        const props = {
          ...defaultProps,
          goForward,
          fullData: {
            privateEvidence: [
              {
                authorization: true,
                lcPrompt: 'Y',
                lcDetails: 'Some details',
              },
            ],
          },
        };

        const { container } = render(<AuthorizationNew {...props} />);
        const continueButton = container.querySelector(
          '.usa-button-primary, va-button:not([secondary])',
        );

        continueButton.click();

        expect(goForward.called).to.be.true;
      });

      it('should require details when the answer to the limited consent prompt is "Yes"', () => {
        const goForward = sinon.spy();
        const props = {
          ...defaultProps,
          goForward,
          fullData: {
            privateEvidence: [
              {
                authorization: true,
                lcPrompt: 'Y',
              },
            ],
          },
        };

        const { container } = render(<AuthorizationNew {...props} />);
        const continueButton = container.querySelector(
          '.usa-button-primary, va-button:not([secondary])',
        );

        continueButton.click();

        expect(goForward.called).to.be.false;
      });

      it('should allow submission when the answer to the limited consent prompt answer is "Yes" and details are provided', () => {
        const goForward = sinon.spy();
        const props = {
          ...defaultProps,
          goForward,
          fullData: {
            privateEvidence: [
              {
                authorization: true,
                lcPrompt: 'Y',
                lcDetails: 'Some limitation details',
              },
            ],
          },
        };

        const { container } = render(<AuthorizationNew {...props} />);
        const continueButton = container.querySelector(
          '.usa-button-primary, va-button:not([secondary])',
        );

        continueButton.click();

        expect(goForward.called).to.be.true;
      });
    });
  });

  describe('currentEvidenceData handling', () => {
    it('should handle undefined fullData', () => {
      const props = {
        ...defaultProps,
        fullData: undefined,
      };

      const { container } = render(<AuthorizationNew {...props} />);
      const checkbox = container.querySelector('va-checkbox');

      expect(checkbox).to.exist;
    });

    it('should handle null fullData', () => {
      const props = {
        ...defaultProps,
        fullData: null,
      };

      const { container } = render(<AuthorizationNew {...props} />);
      const checkbox = container.querySelector('va-checkbox');

      expect(checkbox).to.exist;
    });
  });

  describe('error state clearing', () => {
    it('should clear checkbox error when checkbox is checked', async () => {
      const { container, rerender } = render(
        <AuthorizationNew {...defaultProps} />,
      );
      const continueButton = container.querySelector(
        '.usa-button-primary, va-button:not([secondary])',
      );

      // Trigger error
      continueButton.click();
      rerender(<AuthorizationNew {...defaultProps} />);

      let alert = container.querySelector('va-alert');
      expect(alert).to.exist;

      // Check checkbox
      const checkbox = container.querySelector('va-checkbox');
      checkbox.checked = true;
      checkbox.dispatchEvent(
        new CustomEvent('vaChange', {
          detail: { checked: true },
          bubbles: true,
        }),
      );

      rerender(
        <AuthorizationNew
          {...defaultProps}
          fullData={{ privateEvidence: [{ authorization: true }] }}
        />,
      );

      alert = container.querySelector('va-alert');
      expect(alert).to.not.exist;
    });
  });

  describe('focusSection functionality', () => {
    it('should open accordion item when it is closed', () => {
      const { container } = render(<AuthorizationNew {...defaultProps} />);
      const accordionItem = container.querySelector('#section-one');

      // Set accordion to closed
      accordionItem.setAttribute('open', 'false');
      expect(accordionItem.getAttribute('open')).to.equal('false');

      // Click a link that calls focusSection
      const link = container.querySelector('va-link[href="#section-one"]');
      link.click();

      // Should set open to true
      expect(accordionItem.getAttribute('open')).to.equal('true');
    });

    it('should handle accordion item that is already open', () => {
      const { container } = render(<AuthorizationNew {...defaultProps} />);
      const accordionItem = container.querySelector('#section-two');

      // Accordion starts as open
      expect(accordionItem.hasAttribute('open')).to.be.true;

      // Click a link that calls focusSection
      const links = container.querySelectorAll('va-link[href="#section-two"]');
      links[0].click();

      // Should remain open
      expect(accordionItem.hasAttribute('open')).to.be.true;
    });
  });
});
