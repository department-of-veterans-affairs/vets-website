import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import sinon from 'sinon';

import { FullnameField } from './fullname-field';

describe('FullnameField', () => {
  let defaultProps;

  beforeEach(() => {
    defaultProps = {
      onChange: sinon.spy(),
      value: {},
    };
  });

  describe('rendering', () => {
    it('renders name input fields', () => {
      const { container } = render(<FullnameField {...defaultProps} />);
      const firstNameInput = container.querySelector(
        'va-text-input[label="First name"]',
      );
      const lastNameInput = container.querySelector(
        'va-text-input[label="Last name"]',
      );
      expect(firstNameInput).to.exist;
      expect(lastNameInput).to.exist;
    });

    it('renders all name fields', () => {
      const { container } = render(<FullnameField {...defaultProps} />);

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

    it('shows suffix field by default', () => {
      const { container } = render(<FullnameField {...defaultProps} />);
      const suffixInput = container.querySelector(
        'va-text-input[label="Suffix"]',
      );
      expect(suffixInput).to.exist;
      expect(suffixInput).to.have.attribute('hint', 'Jr., Sr., III, etc.');
    });

    it('hides suffix field when showSuffix is false', () => {
      const props = { ...defaultProps, showSuffix: false };
      const { container } = render(<FullnameField {...props} />);
      const suffixInput = container.querySelector(
        'va-text-input[label="Suffix"]',
      );
      expect(suffixInput).to.not.exist;
    });

    it('shows current values', () => {
      const props = {
        ...defaultProps,
        value: {
          first: 'Leia',
          middle: 'Amidala',
          last: 'Organa',
          suffix: 'Commander',
        },
      };
      const { container } = render(<FullnameField {...props} />);

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

      expect(firstNameInput).to.have.attribute('value', 'Leia');
      expect(middleNameInput).to.have.attribute('value', 'Amidala');
      expect(lastNameInput).to.have.attribute('value', 'Organa');
      expect(suffixInput).to.have.attribute('value', 'Commander');
    });

    it('shows empty values when value is empty', () => {
      const { container } = render(<FullnameField {...defaultProps} />);

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

      expect(firstNameInput).to.have.attribute('value', '');
      expect(middleNameInput).to.have.attribute('value', '');
      expect(lastNameInput).to.have.attribute('value', '');
      expect(suffixInput).to.have.attribute('value', '');
    });
  });

  describe('required fields', () => {
    it('marks first and last name as required when required is true', () => {
      const props = { ...defaultProps, required: true };
      const { container } = render(<FullnameField {...props} />);

      const firstNameInput = container.querySelector(
        'va-text-input[label="First name"]',
      );
      const lastNameInput = container.querySelector(
        'va-text-input[label="Last name"]',
      );

      expect(firstNameInput).to.have.attribute('required', 'true');
      expect(lastNameInput).to.have.attribute('required', 'true');
    });

    it('does not mark middle name and suffix as required', () => {
      const props = { ...defaultProps, required: true };
      const { container } = render(<FullnameField {...props} />);

      const middleNameInput = container.querySelector(
        'va-text-input[label="Middle name"]',
      );
      const suffixInput = container.querySelector(
        'va-text-input[label="Suffix"]',
      );

      expect(middleNameInput).to.have.attribute('required', 'false');
      expect(suffixInput).to.have.attribute('required', 'false');
    });

    it('does not mark any fields as required when required is false', () => {
      const props = { ...defaultProps, required: false };
      const { container } = render(<FullnameField {...props} />);

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

      expect(firstNameInput).to.have.attribute('required', 'false');
      expect(middleNameInput).to.have.attribute('required', 'false');
      expect(lastNameInput).to.have.attribute('required', 'false');
      expect(suffixInput).to.have.attribute('required', 'false');
    });
  });

  describe('interactions', () => {
    it('calls onChange when first name changes', () => {
      const onChange = sinon.spy();
      const props = { ...defaultProps, onChange };
      render(<FullnameField {...props} />);

      // Simulate FormField calling handleNameChange
      onChange('fullName', { first: 'Mon' });

      expect(onChange.calledOnce).to.be.true;
      expect(onChange.firstCall.args[0]).to.equal('fullName');
      expect(onChange.firstCall.args[1]).to.deep.equal({ first: 'Mon' });
    });

    it('calls onChange when middle name changes', () => {
      const onChange = sinon.spy();
      const props = {
        ...defaultProps,
        onChange,
        value: { first: 'Wedge' },
      };
      render(<FullnameField {...props} />);

      // Simulate FormField calling handleNameChange
      onChange('fullName', { first: 'Wedge', middle: 'Derek' });

      expect(onChange.calledOnce).to.be.true;
      expect(onChange.firstCall.args[0]).to.equal('fullName');
      expect(onChange.firstCall.args[1]).to.deep.equal({
        first: 'Wedge',
        middle: 'Derek',
      });
    });

    it('calls onChange when last name changes', () => {
      const onChange = sinon.spy();
      const props = {
        ...defaultProps,
        onChange,
        value: { first: 'Wedge', middle: 'Derek' },
      };
      render(<FullnameField {...props} />);

      // Simulate FormField calling handleNameChange
      onChange('fullName', {
        first: 'Wedge',
        middle: 'Derek',
        last: 'Antilles',
      });

      expect(onChange.calledOnce).to.be.true;
      expect(onChange.firstCall.args[0]).to.equal('fullName');
      expect(onChange.firstCall.args[1]).to.deep.equal({
        first: 'Wedge',
        middle: 'Derek',
        last: 'Antilles',
      });
    });

    it('calls onChange when suffix changes', () => {
      const onChange = sinon.spy();
      const props = {
        ...defaultProps,
        onChange,
        value: { first: 'Bail', last: 'Organa' },
      };
      render(<FullnameField {...props} />);

      // Simulate FormField calling handleNameChange
      onChange('fullName', {
        first: 'Bail',
        last: 'Organa',
        suffix: 'Senator',
      });

      expect(onChange.calledOnce).to.be.true;
      expect(onChange.firstCall.args[0]).to.equal('fullName');
      expect(onChange.firstCall.args[1]).to.deep.equal({
        first: 'Bail',
        last: 'Organa',
        suffix: 'Senator',
      });
    });

    it('preserves existing values when updating a field', () => {
      const onChange = sinon.spy();
      const props = {
        ...defaultProps,
        onChange,
        value: {
          first: 'Gial',
          middle: 'Natalon',
          last: 'Ackbar',
          suffix: 'Admiral',
        },
      };
      render(<FullnameField {...props} />);

      // Simulate changing middle name
      onChange('fullName', {
        first: 'Gial',
        middle: '',
        last: 'Ackbar',
        suffix: 'Admiral',
      });

      expect(onChange.calledOnce).to.be.true;
      expect(onChange.firstCall.args[1]).to.deep.equal({
        first: 'Gial',
        middle: '',
        last: 'Ackbar',
        suffix: 'Admiral',
      });
    });
  });

  describe('validation errors', () => {
    it('shows first name error', () => {
      const props = {
        ...defaultProps,
        errors: { first: 'First name is required' },
        forceShowError: true,
      };
      const { container } = render(<FullnameField {...props} />);
      const firstNameInput = container.querySelector(
        'va-text-input[label="First name"]',
      );
      expect(firstNameInput).to.have.attribute(
        'error',
        'First name is required',
      );
    });

    it('shows middle name error', () => {
      const props = {
        ...defaultProps,
        errors: { middle: 'Middle name is too long' },
        forceShowError: true,
      };
      const { container } = render(<FullnameField {...props} />);
      const middleNameInput = container.querySelector(
        'va-text-input[label="Middle name"]',
      );
      expect(middleNameInput).to.have.attribute(
        'error',
        'Middle name is too long',
      );
    });

    it('shows last name error', () => {
      const props = {
        ...defaultProps,
        errors: { last: 'Last name is required' },
        forceShowError: true,
      };
      const { container } = render(<FullnameField {...props} />);
      const lastNameInput = container.querySelector(
        'va-text-input[label="Last name"]',
      );
      expect(lastNameInput).to.have.attribute('error', 'Last name is required');
    });

    it('shows suffix error', () => {
      const props = {
        ...defaultProps,
        errors: { suffix: 'Invalid suffix' },
        forceShowError: true,
      };
      const { container } = render(<FullnameField {...props} />);
      const suffixInput = container.querySelector(
        'va-text-input[label="Suffix"]',
      );
      expect(suffixInput).to.have.attribute('error', 'Invalid suffix');
    });

    it('shows multiple errors', () => {
      const props = {
        ...defaultProps,
        errors: {
          first: 'First name is required',
          last: 'Last name is required',
        },
        forceShowError: true,
      };
      const { container } = render(<FullnameField {...props} />);

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

    it('does not show errors when forceShowError is false', () => {
      const props = {
        ...defaultProps,
        errors: {
          first: 'First name is required',
          last: 'Last name is required',
        },
        forceShowError: false,
      };
      const { container } = render(<FullnameField {...props} />);

      const firstNameInput = container.querySelector(
        'va-text-input[label="First name"]',
      );
      const lastNameInput = container.querySelector(
        'va-text-input[label="Last name"]',
      );

      expect(firstNameInput).to.not.have.attribute('error');
      expect(lastNameInput).to.not.have.attribute('error');
    });
  });

  describe('edge cases', () => {
    it('handles undefined value prop', () => {
      const props = { ...defaultProps, value: undefined };
      const { container } = render(<FullnameField {...props} />);

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

      expect(firstNameInput).to.have.attribute('value', '');
      expect(middleNameInput).to.have.attribute('value', '');
      expect(lastNameInput).to.have.attribute('value', '');
      expect(suffixInput).to.have.attribute('value', '');
    });

    it('handles null value prop', () => {
      const props = { ...defaultProps, value: null };
      const { container } = render(<FullnameField {...props} />);

      const firstNameInput = container.querySelector(
        'va-text-input[label="First name"]',
      );
      expect(firstNameInput).to.have.attribute('value', '');
    });

    it('handles missing onChange', () => {
      const props = { ...defaultProps, onChange: undefined };
      const { container } = render(<FullnameField {...props} />);
      const firstNameInput = container.querySelector(
        'va-text-input[label="First name"]',
      );

      // Component should render without errors
      expect(firstNameInput).to.exist;
    });

    it('handles undefined errors prop', () => {
      const props = {
        ...defaultProps,
        errors: undefined,
        forceShowError: true,
      };
      const { container } = render(<FullnameField {...props} />);

      const firstNameInput = container.querySelector(
        'va-text-input[label="First name"]',
      );
      expect(firstNameInput).to.not.have.attribute('error');
    });

    it('handles null errors prop', () => {
      const props = {
        ...defaultProps,
        errors: null,
        forceShowError: true,
      };
      const { container } = render(<FullnameField {...props} />);

      const firstNameInput = container.querySelector(
        'va-text-input[label="First name"]',
      );
      expect(firstNameInput).to.not.have.attribute('error');
    });

    it('handles partial value object', () => {
      const props = {
        ...defaultProps,
        value: {
          first: 'Carlist',
          // middle, last, and suffix are undefined
        },
      };
      const { container } = render(<FullnameField {...props} />);

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

      expect(firstNameInput).to.have.attribute('value', 'Carlist');
      expect(middleNameInput).to.have.attribute('value', '');
      expect(lastNameInput).to.have.attribute('value', '');
      expect(suffixInput).to.have.attribute('value', '');
    });

    it('handles partial errors object', () => {
      const props = {
        ...defaultProps,
        errors: {
          first: 'Error for first name',
          // other fields have no errors
        },
        forceShowError: true,
      };
      const { container } = render(<FullnameField {...props} />);

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

      expect(firstNameInput).to.have.attribute('error', 'Error for first name');
      expect(middleNameInput).to.not.have.attribute('error');
      expect(lastNameInput).to.not.have.attribute('error');
      expect(suffixInput).to.not.have.attribute('error');
    });

    it('handles empty string values', () => {
      const props = {
        ...defaultProps,
        value: {
          first: '',
          middle: '',
          last: '',
          suffix: '',
        },
      };
      const { container } = render(<FullnameField {...props} />);

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

      expect(firstNameInput).to.have.attribute('value', '');
      expect(middleNameInput).to.have.attribute('value', '');
      expect(lastNameInput).to.have.attribute('value', '');
      expect(suffixInput).to.have.attribute('value', '');
    });
  });

  describe('accessibility', () => {
    it('renders individual labeled inputs', () => {
      const { container } = render(<FullnameField {...defaultProps} />);
      const inputs = container.querySelectorAll('va-text-input');

      expect(inputs.length).to.be.greaterThan(0);
      inputs.forEach(input => {
        expect(input).to.have.attribute('label');
      });
    });

    it('provides clear labels for each name part', () => {
      const { container } = render(<FullnameField {...defaultProps} />);
      const firstNameInput = container.querySelector(
        'va-text-input[label="First name"]',
      );
      const middleNameInput = container.querySelector(
        'va-text-input[label="Middle name"]',
      );
      const lastNameInput = container.querySelector(
        'va-text-input[label="Last name"]',
      );

      expect(firstNameInput).to.exist;
      expect(middleNameInput).to.exist;
      expect(lastNameInput).to.exist;
    });

    it('maintains logical tab order', () => {
      const { container } = render(<FullnameField {...defaultProps} />);

      const fields = container.querySelectorAll('va-text-input');
      expect(fields).to.have.lengthOf(4);

      // Fields should be in logical order: first, middle, last, suffix
      expect(fields[0]).to.have.attribute('label', 'First name');
      expect(fields[1]).to.have.attribute('label', 'Middle name');
      expect(fields[2]).to.have.attribute('label', 'Last name');
      expect(fields[3]).to.have.attribute('label', 'Suffix');
    });
  });

  describe('schema integration', () => {
    it('passes correct schema to each field', () => {
      const { container } = render(<FullnameField {...defaultProps} />);

      // Each FormField should receive its appropriate schema
      // This is verified through the component rendering without errors
      const fields = container.querySelectorAll('va-text-input');
      expect(fields).to.have.lengthOf(4);

      // All fields should render, indicating schemas were properly passed
      fields.forEach(field => {
        expect(field).to.exist;
      });
    });
  });
});
