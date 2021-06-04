import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect } from 'chai';

import { FormSignature } from '../../../src/js/components/FormSignature';

describe('Forms library - Forms signature component', () => {
  const signatureProps = {
    formData: {},
    onSectionComplete: () => {},
    setFormData: () => {},
    showError: true,
    required: false,
  };

  describe('signature input', () => {
    it('should render input with default label', () => {
      const { getByLabelText } = render(<FormSignature {...signatureProps} />);
      expect(getByLabelText('Veteran’s full name')).to.exist;
    });

    it('should render input with custom string label', () => {
      const { getByLabelText } = render(
        <FormSignature
          {...signatureProps}
          signatureLabel={'Custom text here'}
        />,
      );
      expect(getByLabelText('Custom text here')).to.exist;
    });

    it('should render input input with custom React element label', () => {
      const customLabel = <span>Custom text here</span>;
      const { getByLabelText } = render(
        <FormSignature {...signatureProps} signatureLabel={customLabel} />,
      );
      expect(getByLabelText('Custom text here')).to.exist;
    });
  });

  describe('certification checkbox', () => {
    it('should render with default label', () => {
      const { getByLabelText } = render(<FormSignature {...signatureProps} />);
      expect(
        getByLabelText(
          'I certify the information above is correct and true to the best of my knowledge and belief.',
        ),
      ).to.exist;
    });

    it('should render with custom string label', () => {
      const { getByLabelText } = render(
        <FormSignature {...signatureProps} checkboxLabel="LGTM" />,
      );
      expect(getByLabelText('LGTM')).to.exist;
    });

    it('should render with custom React element label', () => {
      const customLabel = <span>Custom text here</span>;
      const { getByLabelText } = render(
        <FormSignature {...signatureProps} checkboxLabel={customLabel} />,
      );
      expect(getByLabelText('Custom text here')).to.exist;
    });
  });

  describe('validation', () => {
    it('should require signature and certification', () => {
      const { getByText } = render(
        <FormSignature {...signatureProps} required />,
      );
      expect(getByText(/Your signature must match/)).to.exist;
      expect(getByText(/Must certify by checking box/)).to.exist;
    });

    it('should not show validation errors when showErrors is false', () => {
      const { queryByText } = render(
        <FormSignature {...signatureProps} showError={false} required />,
      );
      expect(queryByText(/Your signature must match/)).to.not.exist;
      expect(queryByText(/Must certify by checking box/)).to.not.exist;
    });

    it('should dismiss validation errors after resolution', () => {
      const { queryByText } = render(
        <FormSignature {...signatureProps} required />,
      );
      userEvent.type(queryByText(/Veteran’s full name/), 'Curious George');
      userEvent.click(
        queryByText(/I certify the information above is correct/),
      );
      expect(queryByText(/Your signature must match/)).to.not.exist;
      expect(queryByText(/Must certify by checking box/)).to.not.exist;
    });
    it('should perform data validations if present', () => {});
  });

  describe('behavior', () => {
    it('should call onSectionComplete when the signature is valid', () => {
      // "Valid" here means:
      //   - There are no validation errors
      //   - The checkbox has been checked
    });

    it('should call setFormData when the name is entered', () => {});
  });
});
