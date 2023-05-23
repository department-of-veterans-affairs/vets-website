import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import DependentDeclarationField from '../../../components/FormFields/DependentDeclarationField';

describe('hca <DependentDeclarationField>', () => {
  it('should render with default props', () => {
    const props = { error: false, hasList: false };
    const view = render(<DependentDeclarationField {...props} />);
    expect(view.container.querySelector('.schemaform-label')).to.contain.text(
      'Do you have any dependents to report?',
    );
    expect(view.container.querySelector('.usa-input-error-message')).to.not
      .exist;
  });
  it('should render with alternative question when `hasList` is set to `true`', () => {
    const props = { error: false, hasList: true };
    const view = render(<DependentDeclarationField {...props} />);
    expect(view.container.querySelector('.schemaform-label')).to.contain.text(
      'Do you have another dependent to report?',
    );
  });
  it('should render error message when `error` is set to `true`', () => {
    const props = { error: true, hasList: false };
    const view = render(<DependentDeclarationField {...props} />);
    expect(view.container.querySelector('.usa-input-error-message')).to.exist;
  });
});
