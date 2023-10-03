import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import ApplicantDescription from '../../../components/FormDescriptions/ApplicantDescription';

describe('hca <ApplicantDescription>', () => {
  const defaultProps = { formContext: { prefilled: false } };

  describe('when the component renders', () => {
    it('should render hint text', () => {
      const { container } = render(<ApplicantDescription {...defaultProps} />);
      const selector = container.querySelector('.hca-applicant-description');
      expect(selector).to.exist;
    });
  });

  describe('when the form is not being prefilled', () => {
    it('should not render prefill message', () => {
      const { container } = render(<ApplicantDescription {...defaultProps} />);
      const selector = container.querySelector('.schemaform-prefill-message');
      expect(selector).to.not.exist;
    });
  });

  describe('when the form is being prefilled', () => {
    it('should render prefill message', () => {
      const props = { formContext: { prefilled: true } };
      const { container } = render(<ApplicantDescription {...props} />);
      const selector = container.querySelector('.schemaform-prefill-message');
      expect(selector).to.exist;
    });
  });
});
