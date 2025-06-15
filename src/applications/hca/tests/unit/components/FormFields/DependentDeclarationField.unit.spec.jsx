import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import DependentDeclarationField from '../../../../components/FormFields/DependentDeclarationField';

describe('hca <DependentDeclarationField>', () => {
  const getData = ({ error = false, hasList = false }) => ({
    props: {
      error,
      hasList,
    },
  });

  context('when the component renders', () => {
    const { props } = getData({});

    it('should render with default question', () => {
      const { container } = render(<DependentDeclarationField {...props} />);
      const selector = container.querySelector('.schemaform-label');
      expect(selector).to.contain.text('Do you have any dependents to report?');
    });

    it('should not render error message', () => {
      const { container } = render(<DependentDeclarationField {...props} />);
      const selector = container.querySelector('.usa-input-error-message');
      expect(selector).to.not.exist;
    });
  });

  context('when dependents list is not empty', () => {
    const { props } = getData({ hasList: true });

    it('should render with alternative question', () => {
      const { container } = render(<DependentDeclarationField {...props} />);
      const selector = container.querySelector('.schemaform-label');
      expect(selector).to.contain.text(
        'Do you have another dependent to report?',
      );
    });
  });

  context('when fieldset has an error', () => {
    const { props } = getData({ error: true });

    it('should render error message when `error` is set to `true`', () => {
      const { container } = render(<DependentDeclarationField {...props} />);
      const selector = container.querySelector('.usa-input-error-message');
      expect(selector).to.exist;
    });
  });
});
