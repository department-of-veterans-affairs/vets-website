/*
const blankChildInformation = {
  childBecameDependent: { // not found in ES
    month: null,
    day: null,
    year: null
  },
  childEducationExpenses: null, // not found in ES
};

const blankProvider = {
  // none of these fields are asked in the form.
  insuranceAddress: null,
  insuranceCity: null,
  insuranceCountry: null,
  insuranceState: null,
  insuranceZipcode: null,
  insurancePhone: null,
};

const store = {
  vaInformation: {
    compensableVaServiceConnected: null, // TODO - Mehedi claims this doesn't map to ES
    receivesVaPension: null, // TODO - Mehedi claims this doesn't map to ES
  },

  additionalInformation: {
    facilityState: null, // not used by ES
  },

  demographicInformation: {
  },

  veteranAddress: {
    emailConfirmation: null, // not used by ES
  },

  financialDisclosure: {
    provideFinancialInfo: false, // not used by ES
    understandsFinancialDisclosure: false, // not used by ES
  },

  spouseInformation: {
    dateOfMarriage: { // TODO not in ES
      month: null,
      day: null,
      year: null
    },
  },

  childInformation: {
    hasChildrenToReport: false, // not directly used by ES
    children: [blankChildInformation],
  },

  annualIncome: {
  },

  deductibleExpenses: {
  },

  insuranceInformation: {
    isCoveredByHealthInsurance: false, // not used by ES
  },

  medicareMedicaid: { // this and insuranceInformation.providers[] populates insuranceList
    isMedicaidEligible: false, // not used by ES
  },

  serviceInformation: {
  },

  militaryAdditionalInfo: {
    postNov111998Combat: false, // TODO awaiting info from ES
    disabledInLineOfDuty: false, // TODO awaiting info from ES
  }
};

*/

function makeDateString(dateMap) {
  return `${dateMap.month}/${dateMap.day}/${dateMap.year}`;
}

function makeSSN(ssn) {
  return ssn.replace('-', '');
}

function makeGender(gender) {
  // There are non-active gender classifications in VHA Standard Data Service but
  // M/F are the only active values as of early 2016
  return gender;
}

function makeRaces(demographicInformation) {
  // from VHA Standard Data Service (ADRDEV01) HL7 24 Race Map List
  const races = [];
  if (demographicInformation.isAmericanIndianOrAlaskanNative) races.push('1002-5');
  if (demographicInformation.isAsian) races.push('2028-9');
  if (demographicInformation.isBlackOrAfricanAmerican) races.push('2054-5');
  if (demographicInformation.isNativeHawaiianOrOtherPacificIslander) races.push('2076-8');
  if (demographicInformation.isWhite) races.push('2106-3');
  return races;
}

function makeEthnicity(demographicInformation) {
  // from VHA Standard Data Service (ADRDEV01) HL7 24 Ethnicity Map List
  switch (demographicInformation.isSpanishHispanicLatino) {
    case true:
      return '2135-2';
    case false:
      return '2186-5';
    default:
      return '0000-0';
  }
}

function makeMaritalStatus(maritalStatus) {
  // from VHA Standard Data Service (ADRDEV01) HL7 24 Marital Status Map List
  switch (maritalStatus) {
    case 'Married':
      return 'M';
    case 'Never Married':
      return 'S';
    case 'Separated':
      return 'A';
    case 'Widowed':
      return 'W';
    case 'Divorced':
      return 'D';
    default:
      return 'U';
  }
}

function makeSpouse(nameAndGeneralInformation, spouseInformation) {
  if (nameAndGeneralInformation.maritalStatus !== 'Never Married') {
    return {
      dob: makeDateString(spouseInformation.spouseDateOfBirth),
      givenName: spouseInformation.spouseFullName.first,
      middleName: spouseInformation.spouseFullName.middle,
      familyName: spouseInformation.spouseFullName.last,
      suffix: spouseInformation.spouseFullName.suffix,
      ssns: {
        ssnText: makeSSN(spouseInformation.spouseSocialSecurityNumber)
      },
      address: {
        city: spouseInformation.spouseAddress.city,
        country: spouseInformation.spouseAddress.country,
        line1: spouseInformation.spouseAddress.street,
        zipCode: spouseInformation.spouseAddress.zipcode
      },
      phoneNumber: spouseInformation.spousePhone
    };
  }
  return undefined;
}

function makeRelationship(childRelation) {
  // from VHA Standard Data Service (ADRDEV01) Relationship List
  switch (childRelation) {
    case 'Daughter':
      return 4;
    case 'Son':
      return 3;
    case 'Stepson':
      return 5;
    case 'Stepdaughter':
      return 6;
    default:
      return undefined;
  }
}

function makeDependent(child) {
  return {
    dob: makeDateString(child.childDateOfBirth),
    givenName: child.childFullName.first,
    middleName: child.childFullName.middle,
    familyName: child.childFullName.last,
    suffix: child.childFullName.suffix,
    relationship: makeRelationship(child.childRelation),
    ssns: {
      ssnText: makeSSN(child.childSocialSecurityNumber)
    }
  };
}

function makeDependentList(nameAndGeneralInformation, childInformation) {
  if (nameAndGeneralInformation.hasChildrenToReport) {
    return childInformation.children.map(makeDependent);
  }
  return undefined;
}

function makeProvider(provider) {
  return {
    companyName: provider.insuranceName,
    policyHolderName: provider.insurancePolicyHolderName,
    policyNumber: provider.insurancePolicyNumber,
    groupNumber: provider.insuranceGroupCode,
    insuranceMappingTypeName: 'PI', // TODO this code is from VHA Standard Data Service (ADRDEV01) Insurance Mapping List
  };
}

function makeProviders(medicareMedicaid, insuranceInformation) {
  // add private insurance to provider list
  const list = insuranceInformation.providers.map(makeProvider);
  if (medicareMedicaid.isEnrolledMedicarePartA) {
    // add medicare and medicaid to provider list
    list.push({
      companyName: 'Medicare',
      enrolledInPartA: medicareMedicaid.isEnrolledMedicarePartA,
      insuranceMappingTypeName: 'MDCR', // TODO this code is from VHA Standard Data Service (ADRDEV01) Insurance Mapping List
      partAEffectiveDate: makeDateString(medicareMedicaid.medicarePartAEffectiveDate),
    });
  }
  return insuranceInformation;
}

function makeServiceBranch(serviceBranch) {
  // TODO these codes are from VHA Standard Data Service (ADRDEV01) Service Branch List
  switch (serviceBranch) {
    case 'army':
      return 1;
    case 'air force':
      return 2;
    case 'navy':
      return 3;
    case 'marine corps':
      return 4;
    case 'coast guard':
      return 5;
    case 'merchant seaman':
      return 7;
    case 'noaa':
      return 10;
    case 'usphs':
      return 9;
    case 'f.commonwealth':
      return 11;
    case 'f.guerilla':
      return 12;
    case 'f.scouts new':
      return 13;
    case 'f.scouts old':
      return 14;
    default:
      return 6; // OTHER
  }
}

function makeDischargeType(dischargeType) {
  // TODO these codes are from VHA Standard Data Service (ADRDEV01) Service Discharge Code List
  switch (dischargeType) {
    case 'honorable':
      return 1;
    case 'general':
      return 3;
    case 'bad-conduct':
      return 6;
    case 'dishonorable':
      return 2;
    case 'undesirable':
      return 5;
    default:
      return '4'; // OTHER-THAN-HONORABLE
  }
}

function makeExpenses(deductibleExpenses) {
  // TODO these codes are from VHA Standard Data Service (ADRDEV01) Expense Type List
  const list = [];
  if (deductibleExpenses.deductibleEducationExpenses > 0) {
    list.put({
      expense: {
        amount: deductibleExpenses.deductibleEducationExpenses,
        expenseType: '3', // Veteran's Educational Expenses TODO is this right?
      }
    });
  }
  if (deductibleExpenses.deductibleFuneralExpenses > 0) {
    list.put({
      expense: {
        amount: deductibleExpenses.deductibleFuneralExpenses,
        expenseType: '19', // Funeral and Burial Expenses TODO is this right?
      }
    });
  }
  if (deductibleExpenses.deductibleMedicalExpenses > 0) {
    list.put({
      expense: {
        amount: deductibleExpenses.deductibleMedicalExpenses,
        expenseType: '18', // Total Non-Reimbursed Medical Expenses TODO is this right?
      }
    });
  }
  if (list.length > 0) {
    return list;
  }
  return undefined;
}

function makeVetIncomes(annualIncome) {
  // Income Type List
  const list = [];
  if (annualIncome.veteranGrossIncome > 0) {
    list.push({
      amount: annualIncome.veteranGrossIncome,
      type: 12, // Total Employment Income TODO is this right?
    });
  }
  if (annualIncome.veteranNetIncome > 0) {
    list.push({
      amount: annualIncome.veteranNetIncome,
      type: 13, // Net Income TODO is this right?
    });
  }
  if (annualIncome.veteranOtherIncome > 0) {
    list.push({
      ammount: annualIncome.veteranOtherIncome,
      type: 10, // All Other Income TODO is this right?
    });
  }
  if (list.length > 0) {
    return list;
  }
  return undefined;
}

function makeSpouseIncomes(annualIncome) {
  // Income Type List
  const list = [];
  if (annualIncome.spouseGrossIncome > 0) {
    list.push({
      amount: annualIncome.spouseGrossIncome,
      type: 12, // Total Employment Income TODO is this right?
    });
  }
  if (annualIncome.spouseNetIncome > 0) {
    list.push({
      amount: annualIncome.spouseNetIncome,
      type: 13, // Net Income TODO is this right?
    });
  }
  if (annualIncome.spouseOtherIncome > 0) {
    list.push({
      ammount: annualIncome.spouseOtherIncome,
      type: 10, // All Other Income TODO is this right?
    });
  }
  if (list.length > 0) {
    return list;
  }
  return undefined;
}

function makeDependentIncomes(annualIncome) {
  // Income Type List
  const list = [];
  if (annualIncome.childrenGrossIncome > 0) {
    list.push({
      amount: annualIncome.childrenGrossIncome,
      type: 12, // Total Employment Income TODO is this right?
    });
  }
  if (annualIncome.childrenNetIncome > 0) {
    list.push({
      amount: annualIncome.childrenNetIncome,
      type: 13, // Net Income TODO is this right?
    });
  }
  if (annualIncome.childrenOtherIncome > 0) {
    list.push({
      ammount: annualIncome.childrenOtherIncome,
      type: 10, // All Other Income TODO is this right?
    });
  }
  if (list.length > 0) {
    return list;
  }
  return undefined;
}

function makeEnrollmentSystemJSON(store) {
  return {
    form: {
      formIdentifier: {
        type: '100',
        value: '1010EZ'
      },
      summary: {
        demographics: {
          appointmentRequestResponse: store.additionalInformation.wantsInitialVaContact,
          contactInfo: {
            addresses: {
              address: {
                city: store.veteranAddress.city,
                country: store.veteranAddress.country,
                county: store.veteranAddress.county,
                line1: store.veteranAddress.street,
                phoneNumber: store.veteranAddress.homePhone,
                state: store.veteranAddress.startDate,
                zipCode: store.veteranAddress.zipcode,
                addressTypeCode: 'P' // TODO this code is from VHA Standard Data Service (ADRDEV01) Address Type List P==Permanent
              },
              emails: {
                email: store.veteranAddress.email,
              },
              phones: {
                phone: {
                  phoneNumber: store.veteranAddress.mobilePhone,
                  type: '4', // TODO this code is from VHA Standard Data Service (ADRDEV01) Phone Contact Type List
                }
              }
            }
          },
          ethnicity: makeEthnicity(store.demographicInformation),
          maritalStatus: makeMaritalStatus(store.nameAndGeneralInformation.maritalStatus),
          preferredFacility: store.additionalInformation.vaMedicalFacility,
          races: makeRaces(store.demographicInformation),
          acaIndicator: store.additionalInformation.isEssentialAcaCoverage
        },
        enrollmentDeterminationInfo: {
          eligibleForMedicaid: store.medicareMedicaid.isMedicaidEligible,
          noseThroatRadiumInfo: {
            receivingTreatment: store.militaryAdditionalInfo.radiumTreatments
          },
          serviceConnectionAward: {
            serviceConnectedIndicator: store.vaInformation.isVaServiceConnected
          },
          specialFactors: {
            agentOrangeInd: store.militaryAdditionalInfo.vietnamService,
            envContaminantsInd: store.militaryAdditionalInfo.swAsiaCombat,
            campLejeuneInd: store.militaryAdditionalInfo.campLejeune,
            radiationExposureInd: store.militaryAdditionalInfo.exposedToRadiation
          }
        },
        financialsInfo: {
          financialStatement: {
            expenses: makeExpenses(store.deductibleExpenses),
            incomes: makeVetIncomes(store.annualIncome),
            spouseFinancialsList: {
              spouseFinancials: {
                incomes: makeSpouseIncomes(store.annualIncome),
                spouse: makeSpouse(store.nameAndGeneralInformation, store.spouseInformation),
                contributedToSpouse: store.spouseInformation.provideSupportLastYear,
                marriedLastCalendarYear: store.nameAndGeneralInformation.maritalStatus === 'Married',
                livedWithPatient: store.spouseInformation.cohabitedLastYear,
              },
            },

            dependentFinancialsList: {
              dependentFinancials: {
                incomes: makeDependentIncomes(store.annualIncome),
                dependentInfo: makeDependentList(store.nameAndGeneralInformation, store.childInformation),
                /* TODO : these items are in the wrong place...
                livedWithPatient: store.childInformation.children[i].cohabitedLastYear,
                incapableOfSelfSupport: store.childInformation.children[i].childDisabledBefore18,
                attendedSchool: store.childInformation.children[i].childAttendedSchoolLastYear,
                contributedToSupport: store.childInformation.children[i].childReceivedSupportLastYear,
                */
              }
            },
            numberOfDependentChildren: store.childInformation.children.length,
          }
        },
        insuranceList: makeProviders(store.medicareMedicaid, store.insuranceInformation),
        militaryServiceInfo: {
          disabilityRetirementIndicator: 'false', // TODO
          dischargeDueToDisability: 'false', // TODO
          militaryServiceSiteRecords: {
            militaryServiceSiteRecord: {
              militaryServiceEpisodes: {
                militaryServiceEpisode: {
                  endDate: makeDateString(store.serviceInformation.lastDischargeDate),
                  serviceBranch: makeServiceBranch(store.serviceInformation.lastServiceBranch),
                  startDate: makeDateString(store.serviceInformation.lastEntryDate),
                  dischargeType: makeDischargeType(store.serviceInformation.dischargeType)
                }
              },
            }
          }
        },
        prisonerOfWarInfo: {
          powIndicator: store.militaryAdditionalInfo.isFormerPow
        },
        purpleHeart: {
          indicator: store.militaryAdditionalInfo.purpleHeart
        },
        personInfo: {
          firstName: store.nameAndGeneralInformation.fullName.first,
          middleName: store.nameAndGeneralInformation.fullName.middle,
          lastName: store.nameAndGeneralInformation.fullName.last,
          ssnText: makeSSN(store.nameAndGeneralInformation.socialSecurityNumber),
          gender: makeGender(store.nameAndGeneralInformation.gender),
          dob: makeDateString(store.nameAndGeneralInformation.dateOfBirth),
          mothersMaidenName: store.nameAndGeneralInformation.mothersMaidenName,
          placeOfBirthCity: store.nameAndGeneralInformation.cityOfBirth,
          placeOfBirthState: store.nameAndGeneralInformation.stateOfBirth
        }
      },
      applications: {
        applicationInfo: {
          appDate: '2015-12-21', // TODO get today's date
          appMethod: '1'
        }
      }
    },
    identity: {
      authenticationLevel: {
        type: '100',
        value: 'anonymous'
      }
    }
  };
}

export { makeEnrollmentSystemJSON };
