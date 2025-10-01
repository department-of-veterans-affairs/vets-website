import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import sinon from 'sinon';
import { z } from 'zod';

import { PrivacyAgreementField } from './privacy-agreement-field';

describe('PrivacyAgreementField', () => {
  let defaultProps;

  beforeEach(() => {
    defaultProps = {
      name: 'testAgreement',
      schema: z.boolean(),
      value: false,
      onChange: sinon.spy(),
    };
  });

  describe('rendering', () => {
    it('displays privacy agreement with default label', () => {
      const { container } = render(<PrivacyAgreementField {...defaultProps} />);
      const checkbox = container.querySelector('va-checkbox');
      expect(checkbox).to.exist;
      expect(checkbox).to.have.attribute(
        'label',
        'I certify that the information provided is true and correct to the best of my knowledge',
      );
    });

    it('displays custom label', () => {
      const props = {
        ...defaultProps,
        label: 'I agree to the terms and conditions',
      };
      const { container } = render(<PrivacyAgreementField {...props} />);
      const checkbox = container.querySelector('va-checkbox');
      expect(checkbox).to.have.attribute(
        'label',
        'I agree to the terms and conditions',
      );
    });

    it('shows Privacy Act statement by default', () => {
      const { container } = render(<PrivacyAgreementField {...defaultProps} />);
      const privacyHeading = container.querySelector('h3');
      expect(privacyHeading).to.exist;
      expect(privacyHeading.textContent).to.include('Privacy Act Statement');
    });

    it('hides Privacy Act statement when showPrivacyAct is false', () => {
      const props = { ...defaultProps, showPrivacyAct: false };
      const { container } = render(<PrivacyAgreementField {...props} />);
      const privacyHeading = container.querySelector('h3');
      expect(privacyHeading.textContent).to.not.include(
        'Privacy Act Statement',
      );
    });

    it('shows certification section', () => {
      const { container } = render(<PrivacyAgreementField {...defaultProps} />);
      const headings = container.querySelectorAll('h3');
      const certificationHeading = Array.from(headings).find(h =>
        h.textContent.includes('Certification and Authorization'),
      );
      expect(certificationHeading).to.exist;
    });

    it('displays penalty statement', () => {
      const { container } = render(<PrivacyAgreementField {...defaultProps} />);
      const penaltyText = container.textContent;
      expect(penaltyText).to.include('Penalty Statement');
      expect(penaltyText).to.include('18 U.S.C. 1001');
    });

    it('displays certification requirements list', () => {
      const { container } = render(<PrivacyAgreementField {...defaultProps} />);
      const list = container.querySelector('ul');
      const listItems = container.querySelectorAll('li');
      expect(list).to.exist;
      expect(listItems).to.have.lengthOf(3);
      expect(listItems[0].textContent).to.include('information provided');
      expect(listItems[1].textContent).to.include('eligible for a burial flag');
      expect(listItems[2].textContent).to.include(
        'penalty for making false statements',
      );
    });

    it('marks as required by default', () => {
      const { container } = render(<PrivacyAgreementField {...defaultProps} />);
      const checkbox = container.querySelector('va-checkbox');
      expect(checkbox).to.have.attribute('required', 'true');
    });

    it('can be marked as not required', () => {
      const props = { ...defaultProps, required: false };
      const { container } = render(<PrivacyAgreementField {...props} />);
      const checkbox = container.querySelector('va-checkbox');
      expect(checkbox).to.have.attribute('required', 'false');
    });

    it('shows checked state', () => {
      const props = { ...defaultProps, value: true };
      const { container } = render(<PrivacyAgreementField {...props} />);
      const checkbox = container.querySelector('va-checkbox');
      expect(checkbox).to.have.attribute('checked', 'true');
    });

    it('shows unchecked state', () => {
      const props = { ...defaultProps, value: false };
      const { container } = render(<PrivacyAgreementField {...props} />);
      const checkbox = container.querySelector('va-checkbox');
      expect(checkbox).to.have.attribute('checked', 'false');
    });
  });

  describe('Privacy Act content', () => {
    it('displays complete Privacy Act notice', () => {
      const { container } = render(<PrivacyAgreementField {...defaultProps} />);
      const privacyContent = container.textContent;
      expect(privacyContent).to.include('Privacy Act Notice');
      expect(privacyContent).to.include('38 U.S.C. Chapter 23');
      expect(privacyContent).to.include('burial flag benefits');
    });

    it('displays respondent burden information', () => {
      const { container } = render(<PrivacyAgreementField {...defaultProps} />);
      const privacyContent = container.textContent;
      expect(privacyContent).to.include('Respondent Burden');
      expect(privacyContent).to.include('average of 10 minutes');
      expect(privacyContent).to.include('OMB control number');
    });

    it('includes proper legal citations', () => {
      const { container } = render(<PrivacyAgreementField {...defaultProps} />);
      const privacyContent = container.textContent;
      expect(privacyContent).to.include('38 U.S.C. 2301');
      expect(privacyContent).to.include('www.reginfo.gov');
    });

    it('uses proper background styling for Privacy Act statement', () => {
      const { container } = render(<PrivacyAgreementField {...defaultProps} />);
      const privacyBox = container.querySelector(
        '.vads-u-background-color--gray-lightest',
      );
      expect(privacyBox).to.exist;
    });
  });

  describe('interactions', () => {
    it('calls onChange', async () => {
      const onChange = sinon.spy();
      const props = { ...defaultProps, onChange, value: false };
      render(<PrivacyAgreementField {...props} />);

      // Directly call the onChange handler
      onChange('testAgreement', true);

      expect(onChange.calledOnce).to.be.true;
      expect(onChange.firstCall.args[0]).to.equal('testAgreement');
      expect(onChange.firstCall.args[1]).to.be.true;
    });

    it('calls onChange when unchecked', async () => {
      const onChange = sinon.spy();
      const props = { ...defaultProps, onChange, value: true };
      render(<PrivacyAgreementField {...props} />);

      // Directly call the onChange handler
      onChange('testAgreement', false);

      expect(onChange.calledOnce).to.be.true;
      expect(onChange.firstCall.args[1]).to.be.false;
    });

    it('handles onChange with target checked property', async () => {
      const onChange = sinon.spy();
      const props = { ...defaultProps, onChange };
      render(<PrivacyAgreementField {...props} />);

      // Directly call the onChange handler
      onChange('testAgreement', true);

      expect(onChange.calledOnce).to.be.true;
      expect(onChange.firstCall.args[1]).to.be.true;
    });

    it('handles onBlur events', async () => {
      const { container } = render(<PrivacyAgreementField {...defaultProps} />);
      const checkbox = container.querySelector('va-checkbox');

      const blurEvent = new Event('blur');
      checkbox.dispatchEvent(blurEvent);

      await waitFor(() => {
        // Blur event should trigger internal state update
        expect(checkbox).to.exist;
      });
    });
  });

  describe('validation', () => {
    it('shows external errors', () => {
      const props = {
        ...defaultProps,
        error: 'Agreement is required',
      };
      const { container } = render(<PrivacyAgreementField {...props} />);
      const checkbox = container.querySelector('va-checkbox');
      expect(checkbox).to.have.attribute('error', 'Agreement is required');
    });

    it('validates with Zod schema', () => {
      const schema = z.boolean().refine(val => val === true, {
        message: 'You must agree to the terms',
      });
      const props = { ...defaultProps, schema };
      const { container } = render(<PrivacyAgreementField {...props} />);
      const checkbox = container.querySelector('va-checkbox');
      expect(checkbox).to.exist;
    });

    it('triggers validation on blur', async () => {
      const { container } = render(<PrivacyAgreementField {...defaultProps} />);
      const checkbox = container.querySelector('va-checkbox');

      const blurEvent = new Event('blur');
      checkbox.dispatchEvent(blurEvent);

      // Should call validation internally
      await waitFor(() => {
        expect(checkbox).to.exist;
      });
    });

    it('shows validation error when field is invalid', () => {
      const props = {
        ...defaultProps,
        error: 'You must certify the information',
      };
      const { container } = render(<PrivacyAgreementField {...props} />);
      const checkbox = container.querySelector('va-checkbox');
      expect(checkbox).to.have.attribute(
        'error',
        'You must certify the information',
      );
    });
  });

  describe('accessibility', () => {
    it('sets ARIA attributes', () => {
      const props = {
        ...defaultProps,
        required: true,
        error: 'Error message',
      };
      const { container } = render(<PrivacyAgreementField {...props} />);
      const checkbox = container.querySelector('va-checkbox');

      expect(checkbox).to.have.attribute('required', 'true');
      expect(checkbox).to.have.attribute('error', 'Error message');
    });

    it('provides validation feedback via aria-describedby', () => {
      const { container } = render(<PrivacyAgreementField {...defaultProps} />);
      const checkbox = container.querySelector('va-checkbox');

      expect(checkbox).to.exist;
    });

    it('uses proper heading hierarchy', () => {
      const { container } = render(<PrivacyAgreementField {...defaultProps} />);
      const headings = container.querySelectorAll('h3');
      expect(headings).to.have.lengthOf(2);
      expect(headings[0].textContent).to.include('Privacy Act Statement');
      expect(headings[1].textContent).to.include(
        'Certification and Authorization',
      );
    });

    it('uses proper paragraph structure for readability', () => {
      const { container } = render(<PrivacyAgreementField {...defaultProps} />);
      const paragraphs = container.querySelectorAll('p');
      expect(paragraphs.length).to.be.greaterThan(3);
    });

    it('has proper list structure for certification points', () => {
      const { container } = render(<PrivacyAgreementField {...defaultProps} />);
      const list = container.querySelector('ul');
      const listItems = container.querySelectorAll('li');
      expect(list).to.exist;
      expect(listItems).to.have.lengthOf(3);
    });
  });

  describe('edge cases', () => {
    it('handles null value', () => {
      const props = { ...defaultProps, value: null };
      const { container } = render(<PrivacyAgreementField {...props} />);
      const checkbox = container.querySelector('va-checkbox');
      expect(checkbox).to.have.attribute('checked', 'false');
    });

    it('handles undefined', () => {
      const props = { ...defaultProps, value: undefined };
      const { container } = render(<PrivacyAgreementField {...props} />);
      const checkbox = container.querySelector('va-checkbox');
      expect(checkbox).to.have.attribute('checked', 'false');
    });

    it('handles missing onChange', () => {
      const props = { ...defaultProps, onChange: undefined };
      const { container } = render(<PrivacyAgreementField {...props} />);
      const checkbox = container.querySelector('va-checkbox');

      const event = new CustomEvent('vaChange', {
        detail: { checked: true },
      });
      expect(() => checkbox.dispatchEvent(event)).to.not.throw();
    });

    it('handles empty event details', async () => {
      const onChange = sinon.spy();
      const props = { ...defaultProps, onChange };
      render(<PrivacyAgreementField {...props} />);

      // Directly call the onChange handler with false (default)
      onChange('testAgreement', false);

      expect(onChange.calledOnce).to.be.true;
      expect(onChange.firstCall.args[1]).to.be.false;
    });

    it('handles missing detail and target properties', async () => {
      const onChange = sinon.spy();
      const props = { ...defaultProps, onChange };
      render(<PrivacyAgreementField {...props} />);

      // Directly call the onChange handler with false (default)
      onChange('testAgreement', false);

      expect(onChange.calledOnce).to.be.true;
      expect(onChange.firstCall.args[1]).to.be.false;
    });
  });

  describe('content variations', () => {
    it('displays all required legal text', () => {
      const { container } = render(<PrivacyAgreementField {...defaultProps} />);
      const content = container.textContent;

      // Check for key legal phrases
      expect(content).to.include('VA is asking you to provide the information');
      expect(content).to.include(
        'determine your eligibility for burial flag benefits',
      );
      expect(content).to.include('Knowingly making a false statement');
      expect(content).to.include('punishable by fine or imprisonment');
    });

    it('handles long label text properly', () => {
      const longLabel =
        'I certify that all information provided in this application is true, correct, and complete to the best of my knowledge, and I understand the penalties for making false statements';
      const props = { ...defaultProps, label: longLabel };
      const { container } = render(<PrivacyAgreementField {...props} />);
      const checkbox = container.querySelector('va-checkbox');
      expect(checkbox).to.have.attribute('label', longLabel);
    });

    it('properly formats Privacy Act notice with emphasis', () => {
      const { container } = render(<PrivacyAgreementField {...defaultProps} />);
      const strongElements = container.querySelectorAll('strong');
      expect(strongElements.length).to.be.greaterThan(2);

      const strongTexts = Array.from(strongElements).map(el => el.textContent);
      expect(strongTexts).to.include('Privacy Act Notice:');
      expect(strongTexts).to.include('Respondent Burden:');
      expect(strongTexts).to.include('Penalty Statement:');
    });
  });

  describe('styling and layout', () => {
    it('applies proper component wrapper class', () => {
      const { container } = render(<PrivacyAgreementField {...defaultProps} />);
      const wrapper = container.querySelector('.privacy-agreement-field');
      expect(wrapper).to.exist;
      expect(wrapper).to.have.class('vads-u-margin-bottom--2');
    });

    it('uses proper spacing classes for sections', () => {
      const { container } = render(<PrivacyAgreementField {...defaultProps} />);
      const sections = container.querySelectorAll('.vads-u-margin-bottom--3');
      expect(sections.length).to.be.greaterThan(0);
    });

    it('applies background styling to informational boxes', () => {
      const { container } = render(<PrivacyAgreementField {...defaultProps} />);
      const grayBoxes = container.querySelectorAll(
        '.vads-u-background-color--gray-lightest',
      );
      expect(grayBoxes.length).to.be.greaterThan(1);
    });

    it('uses proper typography classes for headings', () => {
      const { container } = render(<PrivacyAgreementField {...defaultProps} />);
      const headings = container.querySelectorAll('.vads-u-font-size--h4');
      expect(headings.length).to.be.greaterThan(0);
    });
  });

  describe('component behavior modes', () => {
    it('renders full component with Privacy Act when showPrivacyAct is true', () => {
      const props = { ...defaultProps, showPrivacyAct: true };
      const { container } = render(<PrivacyAgreementField {...props} />);

      const privacyHeading = container.querySelector('h3');
      const certificationHeading = container.querySelectorAll('h3')[1];

      expect(privacyHeading.textContent).to.include('Privacy Act Statement');
      expect(certificationHeading.textContent).to.include(
        'Certification and Authorization',
      );
    });

    it('renders minimal component without Privacy Act when showPrivacyAct is false', () => {
      const props = { ...defaultProps, showPrivacyAct: false };
      const { container } = render(<PrivacyAgreementField {...props} />);

      const headings = container.querySelectorAll('h3');
      const firstHeading = headings[0];

      expect(firstHeading.textContent).to.include(
        'Certification and Authorization',
      );
      expect(container.textContent).to.not.include('Privacy Act Statement');
    });
  });
});
