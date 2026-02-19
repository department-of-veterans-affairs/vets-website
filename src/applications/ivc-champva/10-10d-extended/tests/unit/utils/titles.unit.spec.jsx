import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { toHash } from '../../../../shared/utilities';
import {
  arrayTitleWithNameUI,
  healthInsurancePageTitleUI,
  medicarePageTitleUI,
  titleWithNameUI,
  titleWithRoleUI,
} from '../../../utils/titles';

describe('1010d `healthInsurancePageTitleUI` util', () => {
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

describe('1010d `medicarePageTitleUI` util', () => {
  const DEFAULT_ITEM = { medicareParticipant: toHash('123123123') };

  const subject = ({ applicants, item = DEFAULT_ITEM } = {}) => {
    const uiSchema = medicarePageTitleUI('Medicare plan types');
    const TitleComponent = uiSchema['ui:title'];
    const mockStore = {
      getState: () => ({
        form: { data: { applicants } },
      }),
      subscribe: () => {},
      dispatch: () => {},
    };
    const { container } = render(
      <Provider store={mockStore}>
        <div>{TitleComponent({ formData: item })}</div>
      </Provider>,
    );
    return container.textContent;
  };

  it('should return a UI schema object with ui:title property', () => {
    const res = medicarePageTitleUI('Medicare plan types');
    expect(res).to.have.property('ui:title');
  });

  it('should generate title with participant name when applicant found', () => {
    const res = subject({
      applicants: [
        {
          applicantSsn: '123123123',
          applicantName: { first: 'John', last: 'Smith' },
        },
      ],
    });
    expect(res).to.equal('John Smith’s Medicare plan types');
  });

  it('should generate title with `Applicant` when no match found', () => {
    const res = subject({
      item: { medicareParticipant: toHash('321321321') },
      applicants: [
        {
          applicantSsn: '123123123',
          applicantName: { first: 'Jane', last: 'Doe' },
        },
      ],
    });
    expect(res).to.equal('Applicant’s Medicare plan types');
  });

  it('should generate title with `No participant` when item is null', () => {
    const res = subject({ item: null, applicants: [] });
    expect(res).to.equal('No participant’s Medicare plan types');
  });

  it('should include description when provided', () => {
    const res = medicarePageTitleUI('Medicare plan types', 'Test description');
    expect(res).to.have.property('ui:title');
    expect(typeof res['ui:title']).to.equal('function');
  });

  it('should generate title with over-65 applicant name when no participant match', () => {
    const res = subject({
      item: { medicareParticipant: toHash('999999999') },
      applicants: [
        {
          applicantSsn: '123123123',
          applicantDob: '1950-01-01',
          applicantName: { first: 'Elder', last: 'Applicant' },
        },
        {
          applicantSsn: '321321321',
          applicantDob: '2000-01-01',
          applicantName: { first: 'Younger', last: 'Applicant' },
        },
      ],
    });
    expect(res).to.equal('Elder Applicant’s Medicare plan types');
  });
});

describe('1010d `titleWithRoleUI` util', () => {
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

  it('should return `Veteran’s` when certifier role is not applicant', () => {
    const uiSchema = titleWithRoleUI('%s mailing address');
    const result = subject(uiSchema, { certifierRole: 'other' });
    expect(result).to.equal('Veteran’s mailing address');
  });

  it('should return `Veteran’s` when certifier role is missing', () => {
    const uiSchema = titleWithRoleUI('%s mailing address');
    const result = subject(uiSchema, {});
    expect(result).to.equal('Veteran’s mailing address');
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
    expect(result).to.equal('Veteran information');
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

describe('1010d `titleWithNameUI` util', () => {
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

  it('should fallback to `Veteran` when name object is empty', () => {
    const uiSchema = titleWithNameUI('%s information');
    const formData = {
      certifierRole: 'other',
      applicantName: {},
    };
    const result = subject(uiSchema, formData);
    expect(result).to.equal('Veteran’s information');
  });

  it('should fallback to `Veteran` when applicantName is missing', () => {
    const uiSchema = titleWithNameUI('%s information');
    const formData = {
      certifierRole: 'other',
    };
    const result = subject(uiSchema, formData);
    expect(result).to.equal('Veteran’s information');
  });

  it('should fallback to `Veteran` when first name is undefined', () => {
    const uiSchema = titleWithNameUI('%s information');
    const formData = {
      certifierRole: 'other',
      applicantName: { first: undefined, last: 'Smith' },
    };
    const result = subject(uiSchema, formData);
    expect(result).to.equal('Veteran’s information');
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

describe('1010d `arrayTitleWithNameUI` util', () => {
  const subject = (uiSchema, formData, urlParams = {}) => {
    const searchParams = new URLSearchParams(urlParams).toString();
    const TitleComponent = uiSchema['ui:title'];

    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        search: `?${searchParams}`,
      },
    });

    const { container } = render(<div>{TitleComponent({ formData })}</div>);
    return container.textContent;
  };

  it('should return title without `Edit` prefix when not in edit mode', () => {
    const uiSchema = arrayTitleWithNameUI('%s identification information');
    const result = subject(uiSchema, {
      certifierRole: 'other',
      applicantName: { first: 'John' },
    });
    expect(result).to.equal('John’s identification information');
  });

  it('should prepend `Edit` when in edit mode with lowercase option', () => {
    const uiSchema = arrayTitleWithNameUI('%s identification information');
    const result = subject(
      uiSchema,
      {
        certifierRole: 'other',
        applicantName: { first: 'John' },
      },
      { edit: 'true' },
    );
    expect(result).to.equal('Edit John’s identification information');
  });

  it('should prepend `Edit` without capitalizing the name value when the option is false', () => {
    const uiSchema = arrayTitleWithNameUI(
      '%s date of marriage to the Veteran',
      null,
      { capitalize: false },
    );
    const result = subject(
      uiSchema,
      {
        certifierRole: 'other',
        applicantName: { first: 'jane' },
      },
      { edit: 'true' },
    );
    expect(result).to.equal('Edit jane’s date of marriage to the Veteran');
  });

  it('should return `Your` when certifier role is `applicant`', () => {
    const uiSchema = arrayTitleWithNameUI('%s contact information');
    const result = subject(uiSchema, { certifierRole: 'applicant' });
    expect(result).to.equal('Your contact information');
  });

  it('should handle full name when firstNameOnly is false', () => {
    const uiSchema = arrayTitleWithNameUI('Contact information for %s', null, {
      firstNameOnly: false,
      possessive: false,
    });
    const result = subject(uiSchema, {
      certifierRole: 'other',
      applicantName: { first: 'John', last: 'Smith' },
    });
    expect(result).to.equal('Contact information for John Smith');
  });
});
