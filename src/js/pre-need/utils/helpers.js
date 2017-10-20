import React from 'react';
import { get, merge, set } from 'lodash/fp';

import fullNameUI from '../../common/schemaform/definitions/fullName';
import ssnUI from '../../common/schemaform/definitions/ssn';
import { transformForSubmit } from '../../common/schemaform/helpers';
import TextWidget from '../../common/schemaform/widgets/TextWidget';

export function isVeteran(item) {
  return get('claimant.relationshipToVet', item) === '1';
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

export const fullMaidenNameUI = merge(fullNameUI, {
  maiden: { 'ui:title': 'Maiden name' },
});

class SSNWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = { val: props.value };
  }

  handleChange = (val) => {
    // Insert dashes if they are missing.
    // Keep if value is valid and formatted with dashes.
    // Set empty value to undefined.
    const formattedSSN = (
      (val && /^\d{9}$/.test(val)) ?
        `${val.substr(0, 3)}-${val.substr(3, 2)}-${val.substr(5)}` :
        val
    ) || undefined;

    this.setState({ val }, () => {
      this.props.onChange(formattedSSN);
    });
  }

  render() {
    return <TextWidget {...this.props} value={this.state.val} onChange={this.handleChange}/>;
  }
}

// Modify default uiSchema for SSN to insert any missing dashes.
export const ssnDashesUI = merge(ssnUI, { 'ui:widget': SSNWidget });

export const veteranUI = {
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
    'ui:title': 'Current military status (You can add more service history information later in this application.)',
    'ui:widget': 'radio',
    'ui:options': {
      labels: {
        V: 'Veteran',
        R: 'Retired',
        A: 'Active Duty',
        E: 'Retired Active Duty',
        D: 'Died on Active Duty',
        S: 'Reserve/National Guard',
        O: 'Retired Reserve/National Guard',
        I: 'Death Related to Inactive Duty Training',
        X: 'Other'
      }
    }
  }
};
