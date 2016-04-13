import React from 'react';
import { connect } from 'react-redux';

import { veteranOverwrite } from '../../actions';

const completeVeteran = {
  nameAndGeneralInformation: {
    fullName: {
      first: 'Firstname',
      middle: 'MiddleName',
      last: 'LastName',
      suffix: 'Jr.',
    },
    mothersMaidenName: 'Maiden',
    socialSecurityNumber: '000-11-1234',
    dateOfBirth: {
      month: 1,
      day: 2,
      year: 1700,
    },
    maritalStatus: null
  },

  vaInformation: {
    isVaServiceConnected: false,
    compensableVaServiceConnected: false,
    receivesVaPension: false
  },

  additionalInformation: {
    isEssentialAcaCoverage: false,
    facilityState: '',
    vaMedicalFacility: '',
    wantsInitialVaContact: false
  },

  demographicInformation: {
    isSpanishHispanicLatino: false,
    isAmericanIndianOrAlaskanNative: false,
    isBlackOrAfricanAmerican: false,
    isNativeHawaiianOrOtherPacificIslander: false,
    isAsian: false,
    isWhite: false
  },

  veteranAddress: {
    address: {
      street: '123 N 45 st',
      city: 'Springfield',
      country: null,
      state: null,
      zipcode: null,
    },
    county: null,
    email: null,
    emailConfirmation: null,
    homePhone: null,
    mobilePhone: null
  },

  financialDisclosure: {
    provideFinancialInfo: false,
    understandsFinancialDisclosure: false
  },

  spouseInformation: {
    spouseFullName: {
      first: null,
      middle: null,
      last: null,
      suffix: null,
    },
    spouseSocialSecurityNumber: null,
    spouseDateOfBirth: {
      month: null,
      day: null,
      year: null,
    },
    dateOfMarriage: {
      month: null,
      day: null,
      year: null
    },
    sameAddress: false,
    cohabitedLastYear: false,
    provideSupportLastYear: false,
    spouseAddress: {
      street: null,
      city: null,
      country: null,
      state: null,
      zipcode: null,
    },
    spousePhone: null
  },

  childInformation: {
    hasChildrenToReport: false,
    children: []
  },

  annualIncome: {
    veteranGrossIncome: null,
    veteranNetIncome: null,
    veteranOtherIncome: null,
    spouseGrossIncome: null,
    spouseNetIncome: null,
    spouseOtherIncome: null,
    childrenGrossIncome: null,
    childrenNetIncome: null,
    childrenOtherIncome: null
  },

  deductibleExpenses: {
    deductibleMedicalExpenses: null,
    deductibleFuneralExpenses: null,
    deductibleEducationExpenses: null
  },

  insuranceInformation: {
    isCoveredByHealthInsurance: false,
    providers: []
  },

  medicareMedicaid: {
    isMedicaidEligible: false,
    isEnrolledMedicarePartA: false,
    medicarePartAEffectiveDate: {
      month: null,
      day: null,
      year: null
    }
  },

  serviceInformation: {
    lastServiceBranch: null,
    lastEntryDate: {
      month: null,
      day: null,
      year: null
    },
    lastDischargeDate: {
      month: null,
      day: null,
      year: null
    },
    dischargeType: null
  },

  militaryAdditionalInfo: {
    purpleHeartRecipient: false,
    isFormerPow: false,
    postNov111998Combat: false,
    disabledInLineOfDuty: false,
    swAsiaCombat: false,
    vietnamService: false,
    exposedToRadiation: false,
    radiumTreatments: false,
    campLejeune: false
  }
};

/**
 * Button to auto-populate every field in the model with valid data.
 */
class PopulateVeteranButton extends React.Component {
  render() {
    return (
      <button
          className="usa-button-primary"
          onClick={this.props.onClick}>Populate Veteran</button>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onClick: () => {
      dispatch(veteranOverwrite(completeVeteran));
    }
  };
}

export default connect(undefined, mapDispatchToProps)(PopulateVeteranButton);
