import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { healthInsurancePageTitleUI } from '../../../utils/titles';

describe('10-7959c `healthInsurancePageTitleUI` util', () => {
  const DEFAULT_DATA = { provider: 'Cigna' };

  const subject = (uiSchema, formData = DEFAULT_DATA) => {
    const TitleComponent = uiSchema['ui:title'];
    const { container } = render(<div>{TitleComponent({ formData })}</div>);
    return container.textContent;
  };

  it('should return a UI schema object with ui:title property', () => {
    const res = healthInsurancePageTitleUI('prescription coverage');
    expect(res).to.have.property('ui:title');
  });

  it('should prepend provider name by default', () => {
    const uiSchema = healthInsurancePageTitleUI('prescription coverage');
    const result = subject(uiSchema);
    expect(result).to.equal('Cigna prescription coverage');
  });

  it('should return title only when provider is not present', () => {
    const uiSchema = healthInsurancePageTitleUI('prescription coverage');
    const result = subject(uiSchema, {});
    expect(result).to.equal('prescription coverage');
  });

  it('should replace %s placeholder with provider name', () => {
    const uiSchema = healthInsurancePageTitleUI('Type of insurance for %s');
    const result = subject(uiSchema);
    expect(result).to.equal('Type of insurance for Cigna');
  });

  it('should append provider name when position is suffix', () => {
    const uiSchema = healthInsurancePageTitleUI(
      'Upload health insurance card',
      null,
      { position: 'suffix' },
    );
    const result = subject(uiSchema);
    expect(result).to.equal('Upload health insurance card Cigna');
  });

  it('should prepend provider name when position is prefix', () => {
    const uiSchema = healthInsurancePageTitleUI(
      'health insurance information',
      null,
      { position: 'prefix' },
    );
    const result = subject(uiSchema);
    expect(result).to.equal('Cigna health insurance information');
  });
});
