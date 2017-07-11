import React from 'react';

import { validateBooleanGroup } from '../../common/schemaform/validation';

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

export const veteranUISchema = {
  militaryServiceNumber: {
    'ui:title': 'Military Service number (if you have one that\'s different than your Social Security number)'
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
