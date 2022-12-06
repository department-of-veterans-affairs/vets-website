import recordEvent from 'platform/monitoring/record-event';
import _ from 'lodash';

export default {
  applicantInformation: formData => {
    if (_.isEmpty(_.get(formData, 'applicantFullName.first', {}))) {
      recordEvent({
        event: 'edu-0994--response-missing',
        'missing-field-question':
          'Education - Form 22-0994 - Applicant Information - First Name',
      });
    }
    if (_.isEmpty(_.get(formData, 'applicantFullName.last', {}))) {
      recordEvent({
        event: 'edu-0994--response-missing',
        'missing-field-question':
          'Education - Form 22-0994 - Applicant Information - Last Name',
      });
    }
    if (_.isEmpty(_.get(formData, 'applicantSocialSecurityNumber', {}))) {
      recordEvent({
        event: 'edu-0994--response-missing',
        'missing-field-question':
          'Education - Form 22-0994 - Applicant Information - Social Security Number',
      });
    }
    if (_.isEmpty(_.get(formData, 'dateOfBirth', {}))) {
      recordEvent({
        event: 'edu-0994--response-missing',
        'missing-field-question':
          'Education - Form 22-0994 - Applicant Information - Date of Birth',
      });
    }
  },
  benefitsEligibility: formData => {
    if (!_.isBoolean(_.get(formData, 'appliedForVaEducationBenefits', {}))) {
      recordEvent({
        event: 'edu-0994--response-missing',
        'missing-field-question':
          'Education - Form 22-0994 - Submitted Previous Application',
      });
    }
  },
  militaryService: formData => {
    if (!_.isBoolean(_.get(formData, 'activeDuty', {}))) {
      recordEvent({
        event: 'edu-0994--response-missing',
        'missing-field-question':
          'Education - Form 22-0994 - Military Service - Active Duty',
      });
    }
  },
  highTechWorkExp: formData => {
    if (!_.isBoolean(_.get(formData, 'currentHighTechnologyEmployment', {}))) {
      recordEvent({
        event: 'edu-0994--response-missing',
        'missing-field-question':
          'Education - Form 22-0994 - High Tech Work Experience - Current High Tech Employment',
      });
    } else if (
      !_.get(formData, 'currentHighTechnologyEmployment', {}) &&
      !_.isBoolean(_.get(formData, 'pastHighTechnologyEmployment', {}))
    ) {
      recordEvent({
        event: 'edu-0994--response-missing',
        'missing-field-question':
          'Education - Form 22-0994 - High Tech Work Experience - Past High Tech Employment',
      });
    }
  },
  contactInformation: formData => {
    if (_.isEmpty(_.get(formData, 'view:phoneAndEmail.homePhone', {}))) {
      recordEvent({
        event: 'edu-0994--response-missing',
        'missing-field-question':
          'Education - Form 22-0994 - Contact Information - Phone Number',
      });
    }
    if (_.isEmpty(_.get(formData, 'view:phoneAndEmail.emailAddress', {}))) {
      recordEvent({
        event: 'edu-0994--response-missing',
        'missing-field-question':
          'Education - Form 22-0994 - Contact Information - Email Address',
      });
    }
    if (_.isEmpty(_.get(formData, 'mailingAddress.country', {}))) {
      recordEvent({
        event: 'edu-0994--response-missing',
        'missing-field-question':
          'Education - Form 22-0994 - Contact Information - Country',
      });
    }
    if (_.isEmpty(_.get(formData, 'mailingAddress.street', {}))) {
      recordEvent({
        event: 'edu-0994--response-missing',
        'missing-field-question':
          'Education - Form 22-0994 - Contact Information - Street',
      });
    }
    if (_.isEmpty(_.get(formData, 'mailingAddress.city', {}))) {
      recordEvent({
        event: 'edu-0994--response-missing',
        'missing-field-question':
          'Education - Form 22-0994 - Contact Information - City',
      });
    }
    if (_.isEmpty(_.get(formData, 'mailingAddress.state', {}))) {
      recordEvent({
        event: 'edu-0994--response-missing',
        'missing-field-question':
          'Education - Form 22-0994 - Contact Information - State',
      });
    }
    if (_.isEmpty(_.get(formData, 'mailingAddress.postalCode', {}))) {
      recordEvent({
        event: 'edu-0994--response-missing',
        'missing-field-question':
          'Education - Form 22-0994 - Contact Information - Postal Code',
      });
    }
  },
};
