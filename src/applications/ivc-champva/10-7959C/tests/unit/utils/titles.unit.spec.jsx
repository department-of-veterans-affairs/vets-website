import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import {
  healthInsurancePageTitleUI,
  titleWithNameUI,
  titleWithRoleUI,
} from '../../../utils/titles';

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

  it('should replace %s placeholder with provider name', () => {
    const uiSchema = healthInsurancePageTitleUI('%s prescription coverage');
    const result = subject(uiSchema);
    expect(result).to.equal('Cigna prescription coverage');
  });

  it('should return title text when provider is not present', () => {
    const uiSchema = healthInsurancePageTitleUI('%s prescription coverage');
    const result = subject(uiSchema, {});
    expect(result).to.equal('%s prescription coverage');
  });

  it('should use custom placeholder token', () => {
    const uiSchema = healthInsurancePageTitleUI('Upload [%p] card', null, {
      placeholder: '%p',
    });
    const result = subject(uiSchema);
    expect(result).to.equal('Upload [Cigna] card');
  });
});

describe('10-7959c `titleWithRoleUI` util', () => {
  const subject = (uiSchema, formData) => {
    const TitleComponent = uiSchema['ui:title'];
    const { container } = render(<div>{TitleComponent({ formData })}</div>);
    return container.textContent;
  };

  it('should return `Your` when certifier role is `applicant`', () => {
    const uiSchema = titleWithRoleUI('%s mailing address');
    const result = subject(uiSchema, { certifierRole: 'applicant' });
    expect(result).to.equal('Your mailing address');
  });

  it('should return `Beneficiary’s` when certifier role is not applicant', () => {
    const uiSchema = titleWithRoleUI('%s mailing address');
    const result = subject(uiSchema, { certifierRole: 'other' });
    expect(result).to.equal('Beneficiary’s mailing address');
  });

  it('should return `Beneficiary’s` when certifier role is missing', () => {
    const uiSchema = titleWithRoleUI('%s mailing address');
    const result = subject(uiSchema, {});
    expect(result).to.equal('Beneficiary’s mailing address');
  });

  it('should handle capitalization option', () => {
    const uiSchema = titleWithRoleUI('%s contact info', null, {
      capitalize: false,
      self: 'your',
      other: 'their',
    });
    const result = subject(uiSchema, { certifierRole: 'applicant' });
    expect(result).to.equal('your contact info');
  });

  it('should handle possessive option set to false', () => {
    const uiSchema = titleWithRoleUI('%s information', null, {
      possessive: false,
    });
    const result = subject(uiSchema, { certifierRole: 'other' });
    expect(result).to.equal('Beneficiary information');
  });

  it('should use custom roleKey and matchRole', () => {
    const uiSchema = titleWithRoleUI('%s preferences', null, {
      roleKey: 'relationship',
      matchRole: 'self',
      self: 'My',
    });
    const result = subject(uiSchema, { relationship: 'self' });
    expect(result).to.equal('My preferences');
  });

  it('should return empty string when title is empty', () => {
    const uiSchema = titleWithRoleUI('');
    const result = subject(uiSchema, { certifierRole: 'applicant' });
    expect(result).to.equal('');
  });
});

describe('10-7959c `titleWithNameUI` util', () => {
  const subject = (uiSchema, formData) => {
    const TitleComponent = uiSchema['ui:title'];
    const { container } = render(<div>{TitleComponent({ formData })}</div>);
    return container.textContent;
  };

  it('should return `Your` when certifier role is `applicant`', () => {
    const uiSchema = titleWithNameUI('%s identification information');
    const result = subject(uiSchema, { certifierRole: 'applicant' });
    expect(result).to.equal('Your identification information');
  });

  it('should return first name with possessive when certifier role is not `applicant`', () => {
    const uiSchema = titleWithNameUI('%s identification information');
    const formData = {
      certifierRole: 'other',
      applicantName: { first: 'John', last: 'Smith' },
    };
    const result = subject(uiSchema, formData);
    expect(result).to.equal('John’s identification information');
  });

  it('should return full name when `firstNameOnly` option is `false`', () => {
    const uiSchema = titleWithNameUI('%s contact info', null, {
      firstNameOnly: false,
    });
    const formData = {
      certifierRole: 'other',
      applicantName: {
        first: 'John',
        last: 'Smith',
      },
    };
    const result = subject(uiSchema, formData);
    expect(result).to.equal('John Smith’s contact info');
  });

  it('should return name without possessive when `possessive` option is false', () => {
    const uiSchema = titleWithNameUI('Contact information for %s', null, {
      possessive: false,
    });
    const formData = {
      certifierRole: 'other',
      applicantName: { first: 'John' },
    };
    const result = subject(uiSchema, formData);
    expect(result).to.equal('Contact information for John');
  });

  it('should fallback to `Beneficiary` when name object is empty', () => {
    const uiSchema = titleWithNameUI('%s information');
    const formData = {
      certifierRole: 'other',
      applicantName: {},
    };
    const result = subject(uiSchema, formData);
    expect(result).to.equal('Beneficiary’s information');
  });

  it('should fallback to `Beneficiary` when applicantName is missing', () => {
    const uiSchema = titleWithNameUI('%s information');
    const formData = {
      certifierRole: 'other',
    };
    const result = subject(uiSchema, formData);
    expect(result).to.equal('Beneficiary’s information');
  });

  it('should fallback to `Beneficiary` when first name is undefined', () => {
    const uiSchema = titleWithNameUI('%s information');
    const formData = {
      certifierRole: 'other',
      applicantName: { first: undefined, last: 'Smith' },
    };
    const result = subject(uiSchema, formData);
    expect(result).to.equal('Beneficiary’s information');
  });

  it('should use custom nameKey option', () => {
    const uiSchema = titleWithNameUI('%s medical history', null, {
      nameKey: 'patientName',
      other: 'Patient',
    });
    const formData = {
      certifierRole: 'other',
      patientName: { first: 'Jane' },
    };
    const result = subject(uiSchema, formData);
    expect(result).to.equal('Jane’s medical history');
  });

  it('should use custom placeholder token', () => {
    const uiSchema = titleWithNameUI('Review %p information', null, {
      placeholder: '%p',
    });
    const formData = {
      certifierRole: 'other',
      applicantName: { first: 'John' },
    };
    const result = subject(uiSchema, formData);
    expect(result).to.equal('Review John’s information');
  });

  it('should return empty title when title is empty', () => {
    const uiSchema = titleWithNameUI('');
    const result = subject(uiSchema, { certifierRole: 'applicant' });
    expect(result).to.equal('');
  });
});
