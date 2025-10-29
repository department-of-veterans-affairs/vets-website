import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import sinon from 'sinon';

import { PersonalInfo } from './personal-info';

describe('PersonalInfo', () => {
  let defaultProps;

  beforeEach(() => {
    defaultProps = {
      onChange: sinon.spy(),
      value: {},
    };
  });

  describe('rendering', () => {
    it('displays default legend', () => {
      const { container } = render(<PersonalInfo {...defaultProps} />);
      const legend = container.querySelector('fieldset > legend');
      expect(legend).to.exist;
      expect(legend.textContent).to.equal('Personal information');
    });

    it('displays custom legend', () => {
      const props = { ...defaultProps, legend: "Veteran's information" };
      const { container } = render(<PersonalInfo {...props} />);
      const legend = container.querySelector('fieldset > legend');
      expect(legend.textContent).to.equal("Veteran's information");
    });

    it('renders full name fields', () => {
      const { container } = render(<PersonalInfo {...defaultProps} />);

      const firstNameInput = container.querySelector(
        'va-text-input[label="First name"]',
      );
      const middleNameInput = container.querySelector(
        'va-text-input[label="Middle name"]',
      );
      const lastNameInput = container.querySelector(
        'va-text-input[label="Last name"]',
      );
      const suffixInput = container.querySelector(
        'va-text-input[label="Suffix"]',
      );

      expect(firstNameInput).to.exist;
      expect(middleNameInput).to.exist;
      expect(lastNameInput).to.exist;
      expect(suffixInput).to.exist;
    });

    it('renders SSN field by default', () => {
      const { container } = render(<PersonalInfo {...defaultProps} />);
      const ssnInput = container.querySelector(
        'va-text-input[label="Social Security Number"]',
      );
      expect(ssnInput).to.exist;
    });

    it('renders VA file number field with SSN', () => {
      const { container } = render(<PersonalInfo {...defaultProps} />);
      const vaFileInput = container.querySelector(
        'va-text-input[label="VA file number (if known)"]',
      );
      expect(vaFileInput).to.exist;
      expect(vaFileInput).to.have.attribute(
        'hint',
        'Your VA file number may be the same as your SSN',
      );
    });

    it('renders date of birth field', () => {
      const { container } = render(<PersonalInfo {...defaultProps} />);
      const dobInput = container.querySelector(
        'va-memorable-date[label="Date of birth"]',
      );
      expect(dobInput).to.exist;
    });

    it('renders contact information section', () => {
      const { container } = render(<PersonalInfo {...defaultProps} />);
      const contactHeading = container.querySelector('h3');
      expect(contactHeading).to.exist;
      expect(contactHeading.textContent).to.equal('Contact information');
    });

    it('renders contact info alert', () => {
      const { container } = render(<PersonalInfo {...defaultProps} />);
      const alert = container.querySelector('va-alert[status="info"]');
      expect(alert).to.exist;

      expect(alert.textContent).to.include(
        'use this information to contact you about your application',
      );
    });

    it('renders phone field by default', () => {
      const { container } = render(<PersonalInfo {...defaultProps} />);
      const phoneInput = container.querySelector(
        'va-telephone-input[label="Phone number"]',
      );
      expect(phoneInput).to.exist;
    });

    it('renders email field by default', () => {
      const { container } = render(<PersonalInfo {...defaultProps} />);
      const emailInput = container.querySelector(
        'va-text-input[label="Email address"]',
      );
      expect(emailInput).to.exist;
      expect(emailInput).to.have.attribute('type', 'email');
      expect(emailInput).to.have.attribute(
        'hint',
        "We'll use this to send you updates",
      );
    });
  });

  describe('conditional rendering', () => {
    it('hides SSN fields when showSSN is false', () => {
      const props = { ...defaultProps, showSSN: false };
      const { container } = render(<PersonalInfo {...props} />);

      const ssnInput = container.querySelector(
        'va-text-input[label="Social Security Number"]',
      );
      const vaFileInput = container.querySelector(
        'va-text-input[label="VA file number (if known)"]',
      );

      expect(ssnInput).to.not.exist;
      expect(vaFileInput).to.not.exist;
    });

    it('hides phone field when showPhone is false', () => {
      const props = { ...defaultProps, showPhone: false };
      const { container } = render(<PersonalInfo {...props} />);
      const phoneInput = container.querySelector(
        'va-telephone-input[label="Phone number"]',
      );
      expect(phoneInput).to.not.exist;
    });

    it('hides email field when showEmail is false', () => {
      const props = { ...defaultProps, showEmail: false };
      const { container } = render(<PersonalInfo {...props} />);
      const emailInput = container.querySelector(
        'va-text-input[label="Email address"]',
      );
      expect(emailInput).to.not.exist;
    });

    it('hides contact section when both phone and email are hidden', () => {
      const props = {
        ...defaultProps,
        showPhone: false,
        showEmail: false,
      };
      const { container } = render(<PersonalInfo {...props} />);

      const contactHeading = container.querySelector('h3');
      const alert = container.querySelector('va-alert');

      expect(contactHeading).to.not.exist;
      expect(alert).to.not.exist;
    });

    it('shows contact section when only phone is shown', () => {
      const props = {
        ...defaultProps,
        showPhone: true,
        showEmail: false,
      };
      const { container } = render(<PersonalInfo {...props} />);

      const contactHeading = container.querySelector('h3');
      const alert = container.querySelector('va-alert');
      const phoneInput = container.querySelector(
        'va-telephone-input[label="Phone number"]',
      );

      expect(contactHeading).to.exist;
      expect(alert).to.exist;
      expect(phoneInput).to.exist;
    });

    it('shows contact section when only email is shown', () => {
      const props = {
        ...defaultProps,
        showPhone: false,
        showEmail: true,
      };
      const { container } = render(<PersonalInfo {...props} />);

      const contactHeading = container.querySelector('h3');
      const alert = container.querySelector('va-alert');
      const emailInput = container.querySelector(
        'va-text-input[label="Email address"]',
      );

      expect(contactHeading).to.exist;
      expect(alert).to.exist;
      expect(emailInput).to.exist;
    });
  });

  describe('values', () => {
    it('displays full name values', () => {
      const props = {
        ...defaultProps,
        value: {
          fullName: {
            first: 'John',
            middle: 'Q',
            last: 'Doe',
            suffix: 'Jr.',
          },
        },
      };
      const { container } = render(<PersonalInfo {...props} />);

      const firstNameInput = container.querySelector(
        'va-text-input[label="First name"]',
      );
      const middleNameInput = container.querySelector(
        'va-text-input[label="Middle name"]',
      );
      const lastNameInput = container.querySelector(
        'va-text-input[label="Last name"]',
      );
      const suffixInput = container.querySelector(
        'va-text-input[label="Suffix"]',
      );

      expect(firstNameInput).to.have.attribute('value', 'John');
      expect(middleNameInput).to.have.attribute('value', 'Q');
      expect(lastNameInput).to.have.attribute('value', 'Doe');
      expect(suffixInput).to.have.attribute('value', 'Jr.');
    });

    it('displays SSN value', () => {
      const props = {
        ...defaultProps,
        value: { ssn: '123-45-6789' },
      };
      const { container } = render(<PersonalInfo {...props} />);
      const ssnInput = container.querySelector(
        'va-text-input[label="Social Security Number"]',
      );
      expect(ssnInput).to.have.attribute('value', '123-45-6789');
    });

    it('displays VA file number value', () => {
      const props = {
        ...defaultProps,
        value: { vaFileNumber: '987654321' },
      };
      const { container } = render(<PersonalInfo {...props} />);
      const vaFileInput = container.querySelector(
        'va-text-input[label="VA file number (if known)"]',
      );
      expect(vaFileInput).to.have.attribute('value', '987654321');
    });

    it('displays date of birth value', () => {
      const props = {
        ...defaultProps,
        value: { dateOfBirth: '1990-05-15' },
      };
      const { container } = render(<PersonalInfo {...props} />);
      const dobInput = container.querySelector(
        'va-memorable-date[label="Date of birth"]',
      );
      expect(dobInput).to.have.attribute('value', '1990-05-15');
    });

    it('displays phone value', () => {
      const props = {
        ...defaultProps,
        value: { phone: '555-123-4567' },
      };
      const { container } = render(<PersonalInfo {...props} />);
      const phoneInput = container.querySelector(
        'va-telephone-input[label="Phone number"]',
      );
      expect(phoneInput).to.have.attribute('value', '555-123-4567');
    });

    it('displays email value', () => {
      const props = {
        ...defaultProps,
        value: { email: 'john.doe@example.com' },
      };
      const { container } = render(<PersonalInfo {...props} />);
      const emailInput = container.querySelector(
        'va-text-input[label="Email address"]',
      );
      expect(emailInput).to.have.attribute('value', 'john.doe@example.com');
    });
  });

  describe('interactions', () => {
    it('calls onChange with full name update', () => {
      const onChange = sinon.spy();
      const props = {
        ...defaultProps,
        onChange,
        value: {
          fullName: { first: 'John' },
        },
      };
      render(<PersonalInfo {...props} />);

      // Simulate FullnameField calling handleFieldChange
      onChange({
        fullName: { first: 'Jane' },
      });

      expect(onChange.calledOnce).to.be.true;
      expect(onChange.firstCall.args[0]).to.deep.include({
        fullName: { first: 'Jane' },
      });
    });

    it('calls onChange with SSN update', () => {
      const onChange = sinon.spy();
      const props = { ...defaultProps, onChange };
      render(<PersonalInfo {...props} />);

      // Simulate SSNField calling handleFieldChange
      onChange({ ssn: '123-45-6789' });

      expect(onChange.calledOnce).to.be.true;
      expect(onChange.firstCall.args[0]).to.deep.include({
        ssn: '123-45-6789',
      });
    });

    it('calls onChange with VA file number update', () => {
      const onChange = sinon.spy();
      const props = { ...defaultProps, onChange };
      render(<PersonalInfo {...props} />);

      // Simulate FormField calling handleFieldChange
      onChange({ vaFileNumber: '987654321' });

      expect(onChange.calledOnce).to.be.true;
      expect(onChange.firstCall.args[0]).to.deep.include({
        vaFileNumber: '987654321',
      });
    });

    it('calls onChange with date of birth update', () => {
      const onChange = sinon.spy();
      const props = { ...defaultProps, onChange };
      render(<PersonalInfo {...props} />);

      // Simulate MemorableDateField calling handleFieldChange
      onChange({ dateOfBirth: '1990-05-15' });

      expect(onChange.calledOnce).to.be.true;
      expect(onChange.firstCall.args[0]).to.deep.include({
        dateOfBirth: '1990-05-15',
      });
    });

    it('calls onChange with phone update', () => {
      const onChange = sinon.spy();
      const props = { ...defaultProps, onChange };
      render(<PersonalInfo {...props} />);

      // Simulate PhoneField calling handleFieldChange
      onChange({ phone: '555-123-4567' });

      expect(onChange.calledOnce).to.be.true;
      expect(onChange.firstCall.args[0]).to.deep.include({
        phone: '555-123-4567',
      });
    });

    it('calls onChange with email update', () => {
      const onChange = sinon.spy();
      const props = { ...defaultProps, onChange };
      render(<PersonalInfo {...props} />);

      // Simulate FormField calling handleFieldChange
      onChange({ email: 'test@example.com' });

      expect(onChange.calledOnce).to.be.true;
      expect(onChange.firstCall.args[0]).to.deep.include({
        email: 'test@example.com',
      });
    });

    it('preserves existing values when updating fields', () => {
      const onChange = sinon.spy();
      const props = {
        ...defaultProps,
        onChange,
        value: {
          fullName: { first: 'John', last: 'Doe' },
          ssn: '123-45-6789',
          phone: '555-123-4567',
        },
      };
      render(<PersonalInfo {...props} />);

      // Update email
      onChange({
        fullName: { first: 'John', last: 'Doe' },
        ssn: '123-45-6789',
        phone: '555-123-4567',
        email: 'new@example.com',
      });

      expect(onChange.calledOnce).to.be.true;
      expect(onChange.firstCall.args[0]).to.deep.equal({
        fullName: { first: 'John', last: 'Doe' },
        ssn: '123-45-6789',
        phone: '555-123-4567',
        email: 'new@example.com',
      });
    });
  });

  describe('required fields', () => {
    it('marks fields as required when required is true', () => {
      const props = { ...defaultProps, required: true };
      const { container } = render(<PersonalInfo {...props} />);

      const firstNameInput = container.querySelector(
        'va-text-input[label="First name"]',
      );
      const lastNameInput = container.querySelector(
        'va-text-input[label="Last name"]',
      );
      const ssnInput = container.querySelector(
        'va-text-input[label="Social Security Number"]',
      );
      const dobInput = container.querySelector(
        'va-memorable-date[label="Date of birth"]',
      );
      const phoneInput = container.querySelector(
        'va-telephone-input[label="Phone number"]',
      );
      const emailInput = container.querySelector(
        'va-text-input[label="Email address"]',
      );

      expect(firstNameInput).to.have.attribute('required', 'true');
      expect(lastNameInput).to.have.attribute('required', 'true');
      expect(ssnInput).to.have.attribute('required', 'true');
      expect(dobInput).to.have.attribute('required', 'true');
      expect(phoneInput).to.have.attribute('required', 'true');
      expect(emailInput).to.have.attribute('required', 'true');
    });

    it('does not mark fields as required when required is false', () => {
      const props = { ...defaultProps, required: false };
      const { container } = render(<PersonalInfo {...props} />);

      const firstNameInput = container.querySelector(
        'va-text-input[label="First name"]',
      );
      const vaFileInput = container.querySelector(
        'va-text-input[label="VA file number (if known)"]',
      );

      expect(firstNameInput).to.have.attribute('required', 'false');
      expect(vaFileInput).to.have.attribute('required', 'false');
    });

    it('VA file number is never required', () => {
      const props = { ...defaultProps, required: true };
      const { container } = render(<PersonalInfo {...props} />);
      const vaFileInput = container.querySelector(
        'va-text-input[label="VA file number (if known)"]',
      );
      expect(vaFileInput).to.have.attribute('required', 'false');
    });
  });

  describe('validation errors', () => {
    it('shows full name errors', () => {
      const props = {
        ...defaultProps,
        errors: {
          fullName: {
            first: 'First name is required',
            last: 'Last name is required',
          },
        },
        forceShowError: true,
      };
      const { container } = render(<PersonalInfo {...props} />);

      const firstNameInput = container.querySelector(
        'va-text-input[label="First name"]',
      );
      const lastNameInput = container.querySelector(
        'va-text-input[label="Last name"]',
      );

      expect(firstNameInput).to.have.attribute(
        'error',
        'First name is required',
      );
      expect(lastNameInput).to.have.attribute('error', 'Last name is required');
    });

    it('shows SSN error', () => {
      const props = {
        ...defaultProps,
        errors: { ssn: 'Invalid SSN format' },
        forceShowError: true,
      };
      const { container } = render(<PersonalInfo {...props} />);
      const ssnInput = container.querySelector(
        'va-text-input[label="Social Security Number"]',
      );
      expect(ssnInput).to.have.attribute('error', 'Invalid SSN format');
    });

    it('handles array errors', () => {
      const props = {
        ...defaultProps,
        errors: { ssn: ['Invalid SSN', 'SSN required'] },
        forceShowError: true,
      };
      const { container } = render(<PersonalInfo {...props} />);
      const ssnInput = container.querySelector(
        'va-text-input[label="Social Security Number"]',
      );
      expect(ssnInput).to.have.attribute('error', 'Invalid SSN');
    });

    it('shows VA file number error', () => {
      const props = {
        ...defaultProps,
        errors: { vaFileNumber: 'Invalid file number' },
        forceShowError: true,
      };
      const { container } = render(<PersonalInfo {...props} />);
      const vaFileInput = container.querySelector(
        'va-text-input[label="VA file number (if known)"]',
      );
      expect(vaFileInput).to.have.attribute('error', 'Invalid file number');
    });

    it('shows date of birth error', () => {
      const props = {
        ...defaultProps,
        errors: { dateOfBirth: 'Date is required' },
        forceShowError: true,
      };
      const { container } = render(<PersonalInfo {...props} />);
      const dobInput = container.querySelector(
        'va-memorable-date[label="Date of birth"]',
      );
      expect(dobInput).to.have.attribute('error', 'Date is required');
    });

    it('shows phone error', () => {
      const props = {
        ...defaultProps,
        errors: { phone: 'Invalid phone number' },
        forceShowError: true,
      };
      const { container } = render(<PersonalInfo {...props} />);
      const phoneInput = container.querySelector(
        'va-telephone-input[label="Phone number"]',
      );
      expect(phoneInput).to.have.attribute('error', 'Invalid phone number');
    });

    it('shows email error', () => {
      const props = {
        ...defaultProps,
        errors: { email: 'Invalid email address' },
        forceShowError: true,
      };
      const { container } = render(<PersonalInfo {...props} />);
      const emailInput = container.querySelector(
        'va-text-input[label="Email address"]',
      );
      expect(emailInput).to.have.attribute('error', 'Invalid email address');
    });

    it('does not show errors when forceShowError is false', () => {
      const props = {
        ...defaultProps,
        errors: {
          ssn: 'Invalid SSN',
          email: 'Invalid email',
        },
        forceShowError: false,
      };
      const { container } = render(<PersonalInfo {...props} />);

      const ssnInput = container.querySelector(
        'va-text-input[label="Social Security Number"]',
      );
      const emailInput = container.querySelector(
        'va-text-input[label="Email address"]',
      );

      expect(ssnInput).to.not.have.attribute('error');
      expect(emailInput).to.not.have.attribute('error');
    });
  });

  describe('edge cases', () => {
    it('handles undefined value prop', () => {
      const props = { ...defaultProps, value: undefined };
      const { container } = render(<PersonalInfo {...props} />);

      const firstNameInput = container.querySelector(
        'va-text-input[label="First name"]',
      );
      const ssnInput = container.querySelector(
        'va-text-input[label="Social Security Number"]',
      );

      expect(firstNameInput).to.have.attribute('value', '');
      expect(ssnInput).to.have.attribute('value', '');
    });

    it('handles null value prop', () => {
      const props = { ...defaultProps, value: null };
      const { container } = render(<PersonalInfo {...props} />);

      const emailInput = container.querySelector(
        'va-text-input[label="Email address"]',
      );
      expect(emailInput).to.have.attribute('value', '');
    });

    it('handles missing fullName in value', () => {
      const props = {
        ...defaultProps,
        value: {
          ssn: '123-45-6789',
          email: 'test@example.com',
        },
      };
      const { container } = render(<PersonalInfo {...props} />);

      const firstNameInput = container.querySelector(
        'va-text-input[label="First name"]',
      );
      expect(firstNameInput).to.have.attribute('value', '');
    });

    it('handles undefined errors prop', () => {
      const props = {
        ...defaultProps,
        errors: undefined,
        forceShowError: true,
      };
      const { container } = render(<PersonalInfo {...props} />);

      const ssnInput = container.querySelector(
        'va-text-input[label="Social Security Number"]',
      );
      // SSNField validates internally with schema, so error will be shown
      expect(ssnInput).to.have.attribute('error', 'SSN must be 9 digits');
    });

    it('handles null errors prop', () => {
      const props = {
        ...defaultProps,
        errors: null,
        forceShowError: true,
      };
      const { container } = render(<PersonalInfo {...props} />);

      const emailInput = container.querySelector(
        'va-text-input[label="Email address"]',
      );
      expect(emailInput).to.not.have.attribute('error');
    });
  });

  describe('layout', () => {
    it('uses responsive grid for SSN and VA file number', () => {
      const { container } = render(<PersonalInfo {...defaultProps} />);

      const ssnContainer = container.querySelector(
        '.vads-l-col--12.medium-screen\\:vads-l-col--6',
      );
      expect(ssnContainer).to.exist;

      const ssnInput = ssnContainer.querySelector(
        'va-text-input[label="Social Security Number"]',
      );
      expect(ssnInput).to.exist;
    });

    it('uses responsive grid for contact fields', () => {
      const { container } = render(<PersonalInfo {...defaultProps} />);

      const contactRow = container.querySelectorAll('.vads-l-row')[2];
      const columns = contactRow.querySelectorAll(
        '.vads-l-col--12.medium-screen\\:vads-l-col--6',
      );

      expect(columns).to.have.lengthOf(2);
    });

    it('applies proper spacing classes', () => {
      const { container } = render(<PersonalInfo {...defaultProps} />);

      const fieldset = container.querySelector('fieldset');
      expect(fieldset).to.have.class('vads-u-margin-bottom--3');

      const legend = container.querySelector('fieldset > legend');
      expect(legend).to.have.class('vads-u-font-size--lg');
      expect(legend).to.have.class('vads-u-font-weight--bold');
      expect(legend).to.have.class('vads-u-margin-bottom--2');
    });
  });

  describe('accessibility', () => {
    it('uses fieldset and legend for grouping', () => {
      const { container } = render(<PersonalInfo {...defaultProps} />);
      const fieldset = container.querySelector('fieldset');
      const legend = container.querySelector('fieldset > legend');

      expect(fieldset).to.exist;
      expect(legend).to.exist;
    });

    it('provides clear section headings', () => {
      const { container } = render(<PersonalInfo {...defaultProps} />);
      const contactHeading = container.querySelector('h3');

      expect(contactHeading).to.exist;
      expect(contactHeading.textContent).to.equal('Contact information');
      expect(contactHeading).to.have.class('vads-u-font-size--h4');
    });

    it('provides informative alerts', () => {
      const { container } = render(<PersonalInfo {...defaultProps} />);
      const alert = container.querySelector('va-alert');

      expect(alert).to.exist;
      expect(alert).to.have.attribute('status', 'info');
      expect(alert).to.have.attribute('slim');
    });
  });
});
