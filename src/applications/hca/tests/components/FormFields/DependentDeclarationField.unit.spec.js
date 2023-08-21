import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import DependentDeclarationField from '../../../components/FormFields/DependentDeclarationField';

describe('hca <DependentDeclarationField>', () => {
  describe('when the component renders', () => {
    it('should render with default question', () => {
      const props = { error: false, hasList: false };
      const { container } = render(<DependentDeclarationField {...props} />);
      const selector = container.querySelector('.schemaform-label');
      expect(selector).to.contain.text('Do you have any dependents to report?');
    });

    it('should not render error message', () => {
      const props = { error: false, hasList: false };
      const { container } = render(<DependentDeclarationField {...props} />);
      const selector = container.querySelector('.usa-input-error-message');
      expect(selector).to.not.exist;
    });
  });

  describe('when dependents list is not empty', () => {
    it('should render with alternative question', () => {
      const props = { error: false, hasList: true };
      const { container } = render(<DependentDeclarationField {...props} />);
      const selector = container.querySelector('.schemaform-label');
      expect(selector).to.contain.text(
        'Do you have another dependent to report?',
      );
    });
  });

  describe('when fieldset has an error', () => {
    it('should render error message when `error` is set to `true`', () => {
      const props = { error: true, hasList: false };
      const { container } = render(<DependentDeclarationField {...props} />);
      const selector = container.querySelector('.usa-input-error-message');
      expect(selector).to.exist;
    });
  });
});
