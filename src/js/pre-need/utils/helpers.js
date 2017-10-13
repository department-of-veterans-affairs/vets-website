import React from 'react';
import set from 'lodash/fp/set';

import { validateBooleanGroup } from '../../common/schemaform/validation';
import { transformForSubmit } from '../../common/schemaform/helpers';

export function isVeteran(item) {
  return item.claimant.relationshipToVet.type === 1;
}

export function requiresSponsorInfo(item) {
  const sponsor = item['view:sponsor'];
  return sponsor === undefined || sponsor === 'Other';
}

export function formatName(name) {
  const { first, middle, last, suffix } = name;
  return `${first} ${middle ? `${middle} ` : ''}${last}${suffix ? `, ${suffix}` : ''}`;
}

export function claimantHeader({ formData }) {
  const name = formatName(formData.claimant.name);
  return (
    <h4 className="highlight">{name}</h4>
  );
}


export function transform(formConfig, form) {
  const matchClaimant = name => a => formatName(a.claimant.name) === name;
  const formCopy = Object.assign({}, form);

  // Fill in veteran info in each application
  // where the sponsor is another claimant.
  formCopy.applications = formCopy.applications.map(application => {
    const sponsorName = application['view:sponsor'];
    if (sponsorName !== 'Other') {
      const veteranApplication = form.applications.find(matchClaimant(sponsorName));
      return set('veteran', veteranApplication.veteran, application);
    }

    return application;
  });

  // Fill in applicant info in each application
  // if the applicant is another claimant.
  const applicantName = form['view:preparer'];
  if (applicantName !== 'Other') {
    const applicantApplication = form.applications.find(matchClaimant(applicantName));
    const { address, email, name, phoneNumber } = applicantApplication.claimant;
    formCopy.applications = formCopy.applications.map(application => set('applicant',  {
      applicantEmail: email,
      applicantPhoneNumber: phoneNumber,
      applicantRelationshipToClaimant: application.claimant.ssn === applicantApplication.claimant.ssn ? 'Self' : 'Authorized Agent/Rep',
      completingReason: '',
      mailingAddress: address,
      name
    }, application));
  }

  const formData = transformForSubmit(formConfig, formCopy);

  return JSON.stringify({
    preNeedClaim: {
      form: formData
    },
  });
}

export const veteranUISchema = {
  militaryServiceNumber: {
    'ui:title': 'Military Service number (if you have one that’s different than your Social Security number)'
  },
  vaClaimNumber: {
    'ui:title': 'VA claim number (if known)'
  },
  gender: {
    'ui:title': 'Gender',
    'ui:widget': 'radio'
  },
  placeOfBirth: {
    'ui:title': 'Place of birth'
  },
  maritalStatus: {
    'ui:title': 'Marital status',
    'ui:widget': 'radio',
    'ui:options': {
      labels: {
        single: 'Single',
        separated: 'Separated',
        married: 'Married',
        divorced: 'Divorced',
        widowed: 'Widowed'
      }
    }
  },
  militaryStatus: {
    'ui:title': 'Military status to determine if you qualify for burial. Please check all that apply.',
    veteran: {
      'ui:title': 'Veteran'
    },
    retiredActiveDuty: {
      'ui:title': 'Retired Active Duty'
    },
    diedOnActiveDuty: {
      'ui:title': 'Died on Active Duty'
    },
    retiredReserve: {
      'ui:title': 'Retired Reserve'
    },
    retiredNationalGuard: {
      'ui:title': 'Retired National Guard'
    },
    deathInactiveDuty: {
      'ui:title': 'Death Related to Inactive Duty Training'
    },
    other: {
      'ui:title': 'Other'
    },
    'ui:validations': [
      validateBooleanGroup
    ],
    'ui:options': {
      showFieldLabel: true
    }
  }
};
