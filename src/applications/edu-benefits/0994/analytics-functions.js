import recordEvent from '../../../platform/monitoring/record-event';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import isBoolean from 'lodash/isBoolean';

export default {
  applicantInformation: formData => {
    if (isEmpty(get(formData, 'applicantFullName.first', {}))) {
      recordEvent({
        event: 'edu-0994--response-missing',
        'missing-field-question':
          'Education - Form 22-0994 - Applicant Information - First Name',
      });
    }
    if (isEmpty(get(formData, 'applicantFullName.last', {}))) {
      recordEvent({
        event: 'edu-0994--response-missing',
        'missing-field-question':
          'Education - Form 22-0994 - Applicant Information - Last Name',
      });
    }
    if (isEmpty(get(formData, 'applicantSocialSecurityNumber', {}))) {
      recordEvent({
        event: 'edu-0994--response-missing',
        'missing-field-question':
          'Education - Form 22-0994 - Applicant Information - Social Security Number',
      });
    }
    if (isEmpty(get(formData, 'dateOfBirth', {}))) {
      recordEvent({
        event: 'edu-0994--response-missing',
        'missing-field-question':
          'Education - Form 22-0994 - Applicant Information - Date of Birth',
      });
    }
  },
  benefitsEligibility: formData => {
    if (!isBoolean(get(formData, 'appliedForVaEducationBenefits', {}))) {
      recordEvent({
        event: 'edu-0994--response-missing',
        'missing-field-question':
          'Education - Form 22-0994 - Submitted Previous Application',
      });
    }
  },
  militaryService: formData => {
    if (!isBoolean(get(formData, 'activeDuty', {}))) {
      recordEvent({
        event: 'edu-0994--response-missing',
        'missing-field-question':
          'Education - Form 22-0994 - Military Service - Active Duty',
      });
    }
  },
  highTechWorkExp: formData => {
    if (!isBoolean(get(formData, 'currentHighTechnologyEmployment', {}))) {
      recordEvent({
        event: 'edu-0994--response-missing',
        'missing-field-question':
          'Education - Form 22-0994 - High Tech Work Experience - Current High Tech Employment',
      });
    } else if (!get(formData, 'currentHighTechnologyEmployment', {})) {
      if (!isBoolean(get(formData, 'pastHighTechnologyEmployment', {}))) {
        recordEvent({
          event: 'edu-0994--response-missing',
          'missing-field-question':
            'Education - Form 22-0994 - High Tech Work Experience - Past High Tech Employment',
        });
      }
    }
  },
  contactInformation: formData => {
    if (isEmpty(get(formData, 'view:phoneAndEmail.dayTimePhone', {}))) {
      recordEvent({
        event: 'edu-0994--response-missing',
        'missing-field-question':
          'Education - Form 22-0994 - Contact Information - Phone Number',
      });
    }
    if (isEmpty(get(formData, 'view:phoneAndEmail.emailAddress', {}))) {
      recordEvent({
        event: 'edu-0994--response-missing',
        'missing-field-question':
          'Education - Form 22-0994 - Contact Information - Email Address',
      });
    }
    if (isEmpty(get(formData, 'mailingAddress.country', {}))) {
      recordEvent({
        event: 'edu-0994--response-missing',
        'missing-field-question':
          'Education - Form 22-0994 - Contact Information - Country',
      });
    }
    if (isEmpty(get(formData, 'mailingAddress.street', {}))) {
      recordEvent({
        event: 'edu-0994--response-missing',
        'missing-field-question':
          'Education - Form 22-0994 - Contact Information - Street',
      });
    }
    if (isEmpty(get(formData, 'mailingAddress.city', {}))) {
      recordEvent({
        event: 'edu-0994--response-missing',
        'missing-field-question':
          'Education - Form 22-0994 - Contact Information - City',
      });
    }
    if (isEmpty(get(formData, 'mailingAddress.state', {}))) {
      recordEvent({
        event: 'edu-0994--response-missing',
        'missing-field-question':
          'Education - Form 22-0994 - Contact Information - State',
      });
    }
    if (isEmpty(get(formData, 'mailingAddress.postalCode', {}))) {
      recordEvent({
        event: 'edu-0994--response-missing',
        'missing-field-question':
          'Education - Form 22-0994 - Contact Information - Postal Code',
      });
    }
  },
};
