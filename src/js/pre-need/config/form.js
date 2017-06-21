import React from 'react';
import _ from 'lodash/fp';

import fullSchemaPreNeed from './schema.json';

// import { transform } from '../helpers';
import IntroductionPage from '../components/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import * as address from '../../common/schemaform/definitions/address';
import fullNameUI from '../../common/schemaform/definitions/fullName';
import currentOrPastDateUI from '../../common/schemaform/definitions/currentOrPastDate';
import ssnUI from '../../common/schemaform/definitions/ssn';
import { validateBooleanGroup } from '../../common/schemaform/validation';

const {
  relationship,
  veteranFullName,
  veteranMaidenName,
  veteranSocialSecurityNumber,
  veteranDateOfBirth,
  sponsorFullName,
  sponsorSocialSecurityNumber,
  sponsorMilitaryServiceNumber,
  sponsorVAClaimNumber,
  sponsorDateOfBirth,
  sponsorPlaceOfBirth,
  sponsorDeceased,
  sponsorDateOfDeath,
  sponsorGender,
  sponsorMaritalStatus,
  sponsorMilitaryStatus
} = fullSchemaPreNeed.properties;

const {
  fullName,
  ssn,
  date,
  gender,
  usaPhone
} = fullSchemaPreNeed.definitions;

const formConfig = {
  urlPrefix: '/',
  submitUrl: '/v0/preneed',
  trackingPrefix: 'preneed-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  disableSave: true,
  title: 'Apply online for pre-need determination of eligibility in a VA National Cemetary',
  subTitle: 'Form 40-10007',
  defaultDefinitions: {
    fullName,
    ssn,
    date,
    gender,
    usaPhone
  },
  chapters: {
    veteranInformation: {
      title: 'Applicant Information',
      pages: {
        applicantInformation1: {
          title: 'Applicant information',
          path: 'applicant-information-1',
          uiSchema: {
            relationship: {
              type: {
                'ui:title': 'What\'s your relationship to the Servicemember whose benefit you are claiming?',
                'ui:widget': 'radio',
                'ui:options': {
                  labels: {
                    servicemember: 'I am the Servicemember',
                    spouseOrChild: 'Spouse, surviving spouse, or unmarried adult child',
                    other: 'Other'
                  }
                }
              },
              other: {
                'ui:title': 'Please specify your relationship',
                // 'ui:required': (form) => _.get('relationship.type', form) === 'other',
                'ui:options': {
                  hideIf: (form) => _.get('relationship.type', form) !== 'other'
                }
              }
            },
          },
          schema: {
            type: 'object',
            required: ['relationship'],
            properties: {
              relationship
            }
          }
        },
        applicantInformation2: {
          title: 'Applicant information',
          path: 'applicant-information-2',
          uiSchema: {
            'ui:description': <p>You aren’t required to fill in <strong>all</strong> fields, but VA can evaluate your claim faster if you provide more information.</p>,
            veteranFullName: fullNameUI,
            veteranMaidenName: {
              'ui:title': 'Maiden name (if applicable)'
            },
            veteranSocialSecurityNumber: ssnUI,
            veteranDateOfBirth: currentOrPastDateUI('Date of birth')
          },
          schema: {
            type: 'object',
            required: [
              'veteranSocialSecurityNumber',
              'veteranDateOfBirth'
            ],
            properties: {
              veteranFullName,
              veteranMaidenName,
              veteranSocialSecurityNumber,
              veteranDateOfBirth
            }
          }
        },
        sponsorInformation: {
          title: 'Sponsor information',
          path: 'sponsor-information',
          uiSchema: {
            sponsorFullName: fullNameUI,
            sponsorSocialSecurityNumber: _.merge(ssnUI, {
              'ui:title': 'Sponsor Social Security number'
            }),
            sponsorMilitaryServiceNumber: {
              'ui:title': 'Sponsor Military Service number (if different from Social Security number)'
            },
            sponsorVAClaimNumber: {
              'ui:title': 'Sponsor VA claim number (if known)'
            },
            sponsorDateOfBirth: currentOrPastDateUI('Sponsor date of birth'),
            sponsorPlaceOfBirth: {
              'ui:title': 'Sponsor place of birth'
            },
            sponsorDeceased: {
              'ui:title': 'Is the Sponsor deceased?',
              'ui:widget': 'radio',
              'ui:options': {
                labels: {
                  Y: 'Yes',
                  N: 'No',
                  U: 'I don\'t know'
                }
              }
            },
            sponsorDateOfDeath: _.merge(currentOrPastDateUI('Sponsor date of death'), {
              'ui:options': {
                expandUnder: 'sponsorDeceased',
                expandUnderCondition: 'Y'
              }
            }),
            sponsorAddress: _.merge(address.uiSchema(), {
              'ui:title': 'Sponsor address',
              'ui:options': {
                expandUnder: 'sponsorDeceased',
                expandUnderCondition: 'N'
              }
            }),
            sponsorGender: {
              'ui:title': 'Sponsor gender',
              'ui:widget': 'radio',
              'ui:options': {
                labels: {
                  F: 'Female',
                  M: 'Male'
                }
              }
            },
            sponsorMaritalStatus: {
              'ui:title': 'Sponsor marital status',
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
            sponsorMilitaryStatus: {
              'ui:title': 'Sponsor military status to determine eligibility. Check all that apply.',
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
          },
          schema: {
            type: 'object',
            required: [
              'sponsorSocialSecurityNumber',
              'sponsorDeceased',
              'sponsorGender',
              'sponsorMaritalStatus',
              'sponsorMilitaryStatus'
            ],
            properties: {
              sponsorFullName,
              sponsorSocialSecurityNumber,
              sponsorMilitaryServiceNumber,
              sponsorVAClaimNumber,
              sponsorDateOfBirth,
              sponsorPlaceOfBirth,
              sponsorDeceased,
              sponsorDateOfDeath,
              sponsorAddress: address.schema(fullSchemaPreNeed),
              sponsorGender,
              sponsorMaritalStatus,
              sponsorMilitaryStatus
            }
          }
        }
      }
    },
  }
};

export default formConfig;
