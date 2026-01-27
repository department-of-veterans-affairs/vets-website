import React from 'react';
import { expect } from 'chai';
import { render, fireEvent, waitFor } from '@testing-library/react';
import sinon from 'sinon-v20';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import Authorization, { content } from '../../../components/4142/Authorization';

describe('<Authorization>', () => {
  describe('array builder feature toggle off', () => {
    it('should render', () => {
      const { container } = render(<Authorization />);

      const checkbox = $('va-checkbox', container);
      expect(checkbox).to.exist;
    });

    it('should not submit page & show alert error when unchecked', () => {
      const goSpy = sinon.spy();
      const setFormDataSpy = sinon.spy();
      const { container } = render(
        <Authorization
          goForward={goSpy}
          data={{}}
          setFormData={setFormDataSpy}
        />,
      );

      $('#privacy-agreement', container).__events.vaChange({
        target: { checked: false },
      });

      fireEvent.click($('va-button[continue]', container));
      fireEvent.submit($('form', container)); // testing prevent default on form

      // testing onAnchorClick callback - scrolls to & focus on alert
      fireEvent.click($('#checkbox-anchor', container));

      const alert = $('va-alert[status="error"]', container);
      expect(alert).to.exist;
      expect(goSpy.called).to.be.false;
    });

    it('should update data & submit page when checked', async () => {
      const goSpy = sinon.spy();
      const setFormDataSpy = sinon.spy();
      const data = { privacyAgreementAccepted: true };
      const { container, rerender } = render(
        <Authorization
          goForward={goSpy}
          data={{}}
          setFormData={setFormDataSpy}
        />,
      );

      $('#privacy-agreement', container).__events.vaChange({
        target: { checked: true },
      });

      rerender(
        <Authorization
          goForward={goSpy}
          data={data}
          setFormData={setFormDataSpy}
        />,
      );

      fireEvent.click($('va-button[continue]', container));

      await waitFor(() => {
        expect(goSpy.called).to.be.true;
      });
    });

    it('should submit page when checked', () => {
      const goSpy = sinon.spy();
      const data = {
        privacyAgreementAccepted: true,
      };
      const { container } = render(
        <Authorization goForward={goSpy} data={data} />,
      );

      fireEvent.click($('va-button[continue]', container));
      expect(goSpy.called).to.be.true;
    });

    describe('Authorization Checkbox Validation', () => {
      it('should NOT show error immediately when unchecking checkbox', () => {
        const setFormDataSpy = sinon.spy();
        const { container } = render(
          <div>
            <Authorization setFormData={setFormDataSpy} />
          </div>,
        );

        $('#privacy-agreement', container).__events.vaChange({
          target: { checked: true },
        });

        $('#privacy-agreement', container).__events.vaChange({
          target: { checked: false },
        });

        const alert = $('va-alert[status="error"]', container);
        expect(alert).to.not.exist;
      });

      it('should show error ONLY when clicking Continue without checkbox checked', () => {
        const goSpy = sinon.spy();
        const setFormDataSpy = sinon.spy();
        const { container } = render(
          <Authorization
            goForward={goSpy}
            setFormData={setFormDataSpy}
            data={{ privacyAgreementAccepted: false }}
          />,
        );

        const alert = $('va-alert[status="error"]', container);
        expect(alert).to.not.exist;

        // Click Continue button - this SHOULD trigger error
        fireEvent.click($('va-button[continue]', container));

        const errorAlert = $('va-alert[status="error"]', container);
        expect(errorAlert).to.exist;
        expect(goSpy.called).to.be.false;
      });

      it('should clear error when checkbox is checked after error is shown', () => {
        const goSpy = sinon.spy();
        const setFormDataSpy = sinon.spy();
        const { container } = render(
          <Authorization
            goForward={goSpy}
            setFormData={setFormDataSpy}
            data={{ privacyAgreementAccepted: false }}
          />,
        );

        fireEvent.click($('va-button[continue]', container));

        expect($('va-alert[status="error"]', container)).to.exist;

        $('#privacy-agreement', container).__events.vaChange({
          target: { checked: true },
        });

        expect($('va-alert[status="error"]', container)).to.not.exist;
      });

      it('should allow multiple check/uncheck cycles without showing errors', () => {
        const setFormDataSpy = sinon.spy();
        const { container } = render(
          <Authorization setFormData={setFormDataSpy} />,
        );

        $('#privacy-agreement', container).__events.vaChange({
          target: { checked: true },
        });

        $('#privacy-agreement', container).__events.vaChange({
          target: { checked: false },
        });

        $('#privacy-agreement', container).__events.vaChange({
          target: { checked: true },
        });

        $('#privacy-agreement', container).__events.vaChange({
          target: { checked: false },
        });

        const alert = $('va-alert[status="error"]', container);
        expect(alert).to.not.exist;
      });
    });
  });

  describe('array builder feature toggle on', () => {
    const defaultProps = {
      data: {
        showArrayBuilder: true,
      },
      goBack: sinon.spy(),
      goForward: sinon.spy(),
      setFormData: sinon.spy(),
    };

    afterEach(() => {
      sinon.restore();
    });

    describe('renders correctly', () => {
      it('should render with title and main form elements', () => {
        const { container } = render(<Authorization {...defaultProps} />);
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
        const { container } = render(<Authorization {...defaultProps} />);
        const alert = container.querySelector('va-alert');

        expect(alert).to.not.exist;
      });
    });

    describe('modal functionality', () => {
      it('should show modal when first privacy button is clicked', () => {
        const { container } = render(<Authorization {...defaultProps} />);
        const button = container.querySelector('#privacy-modal-button-1');
        const modal = container.querySelector('va-modal');

        button.click();

        expect(modal.hasAttribute('visible')).to.be.true;
      });

      it('should show modal when second privacy button is clicked', () => {
        const { container } = render(<Authorization {...defaultProps} />);
        const button = container.querySelector('#privacy-modal-button-2');
        const modal = container.querySelector('va-modal');

        button.click();

        expect(modal.hasAttribute('visible')).to.be.true;
      });
    });

    describe('checkbox functionality', () => {
      it('should render checkbox with correct label', () => {
        const { container } = render(<Authorization {...defaultProps} />);
        const checkbox = container.querySelector('va-checkbox');

        expect(checkbox.getAttribute('label')).to.include(
          'I acknowledge and authorize this release of information',
        );
      });

      it('should render checkbox as checked when authorization is true', () => {
        const props = {
          ...defaultProps,
          data: {
            ...defaultProps.data,
            auth4142: true,
          },
        };

        const { container } = render(<Authorization {...props} />);
        const checkbox = container.querySelector('va-checkbox');

        expect(checkbox.hasAttribute('checked')).to.be.true;
      });

      it('should call setFormData when the checkbox is used', () => {
        const setFormData = sinon.spy();
        const { container } = render(
          <Authorization {...defaultProps} setFormData={setFormData} />,
        );

        const checkbox = container.querySelector('va-checkbox');

        checkbox.checked = true;
        checkbox.dispatchEvent(
          new CustomEvent('vaChange', {
            detail: { checked: true },
            bubbles: true,
          }),
        );

        expect(setFormData.called).to.be.true;
        expect(setFormData.firstCall.args[0].auth4142).to.be.true;
      });

      it('should preserve existing currentEvidenceData when checkbox changes', () => {
        const setFormData = sinon.spy();
        const props = {
          ...defaultProps,
          setFormData,
          data: {
            ...defaultProps.data,
            lcPrompt: 'Y',
            lcDetails: 'Some details',
            privateEvidence: [
              {
                providerName: 'Test Provider',
              },
            ],
          },
        };

        const { container } = render(<Authorization {...props} />);
        const checkbox = container.querySelector('va-checkbox');

        checkbox.checked = true;
        checkbox.dispatchEvent(
          new CustomEvent('vaChange', {
            detail: { checked: true },
            bubbles: true,
          }),
        );

        const callArgs = setFormData.firstCall.args[0];

        expect(setFormData.called).to.be.true;
        expect(callArgs.privateEvidence[0].providerName).to.equal(
          'Test Provider',
        );
        expect(callArgs.lcPrompt).to.equal('Y');
        expect(callArgs.lcDetails).to.equal('Some details');
        expect(callArgs.auth4142).to.be.true;
      });
    });

    describe('goForward validation', () => {
      it('should show checkbox error when authorization is not checked and Continue is clicked', () => {
        const { container, rerender } = render(
          <Authorization {...defaultProps} />,
        );

        const continueButton = container.querySelector(
          '.usa-button-primary, va-button:not([secondary])',
        );

        continueButton.click();

        rerender(<Authorization {...defaultProps} />);
        const alert = container.querySelector('va-alert');

        expect(alert).to.exist;
      });

      describe('answer to limited consent is "No"', () => {
        it('should call goForward when all required fields are filled', () => {
          const goForward = sinon.spy();
          const props = {
            ...defaultProps,
            goForward,
            data: {
              ...defaultProps.data,
              lcPrompt: 'N',
              auth4142: true,
            },
          };

          const { container } = render(<Authorization {...props} />);
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
            data: {
              ...defaultProps.data,
              auth4142: true,
              lcPrompt: 'Y',
              lcDetails: 'Some details',
            },
          };

          const { container } = render(<Authorization {...props} />);
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
            data: {
              ...defaultProps.data,
              auth4142: true,
              lcPrompt: 'Y',
            },
          };

          const { container } = render(<Authorization {...props} />);
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
            data: {
              ...defaultProps.data,
              auth4142: true,
              lcPrompt: 'Y',
              lcDetails: 'Some limitation details',
            },
          };

          const { container } = render(<Authorization {...props} />);
          const continueButton = container.querySelector(
            '.usa-button-primary, va-button:not([secondary])',
          );

          continueButton.click();

          expect(goForward.called).to.be.true;
        });
      });
    });

    describe('data handling', () => {
      it('should handle undefined data', () => {
        const props = {
          ...defaultProps,
          data: undefined,
        };

        const { container } = render(<Authorization {...props} />);
        const checkbox = container.querySelector('va-checkbox');

        expect(checkbox).to.exist;
      });
    });

    describe('error state clearing', () => {
      it('should clear checkbox error when checkbox is checked', async () => {
        const { container, rerender } = render(
          <Authorization {...defaultProps} />,
        );
        const continueButton = container.querySelector(
          '.usa-button-primary, va-button:not([secondary])',
        );

        // Trigger error
        continueButton.click();
        rerender(<Authorization {...defaultProps} />);

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
          <Authorization
            {...defaultProps}
            data={{
              ...defaultProps.data,
              privateEvidence: [{ authorization: true }],
            }}
          />,
        );

        alert = container.querySelector('va-alert');
        expect(alert).to.not.exist;
      });
    });

    describe('focusSection functionality', () => {
      it('should open accordion item when it is closed', () => {
        const { container } = render(<Authorization {...defaultProps} />);
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
        const { container } = render(<Authorization {...defaultProps} />);
        const accordionItem = container.querySelector('#section-two');

        // Accordion starts as open
        expect(accordionItem.hasAttribute('open')).to.be.true;

        // Click a link that calls focusSection
        const links = container.querySelectorAll(
          'va-link[href="#section-two"]',
        );
        links[0].click();

        // Should remain open
        expect(accordionItem.hasAttribute('open')).to.be.true;
      });
    });
  });
});
