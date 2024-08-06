import React from 'react';

import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';

// In a real app this would not be imported directly; instead the schema you
// imported above would import and use these common definitions:
import commonDefinitions from 'vets-json-schema/dist/definitions.json';

// Example of an imported schema:
// In a real app this would be imported from `vets-json-schema`:
// import fullSchema from 'vets-json-schema/dist/22-5490-schema.json';
import environment from 'platform/utilities/environment';
import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import emailUI from 'platform/forms-system/src/js/definitions/email';
import {
  addressSchema,
  addressUI,
} from 'platform/forms-system/src/js/web-component-patterns';
// import fullSchema from '../22-5490-schema.json';

import manifest from '../manifest.json';
import PersonalInformation from '../components/PersonalInformation';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import DuplicateContactInfoModal from '../components/DuplicateContactInfoModal';

// const { } = fullSchema.properties;

// const { } = fullSchema.definitions;

// pages
import directDeposit from '../pages/directDeposit';
// import serviceHistory from '../pages/serviceHistory';
// import { uiSchema } from '../../../edu-benefits/1990s/pages/directDeposit';

import { prefillTransformer } from '../helpers';
import { transform5490Form } from '../utils/form-submit-transform';
import CustomEmailField from '../components/CustomEmailField';
import CustomPhoneNumberField from '../components/CustomPhoneNumberField';

const { fullName, ssn, date, dateRange, usaPhone } = commonDefinitions;

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/meb_api/v0/forms_submit_claim`,
  transformForSubmit: transform5490Form,
  trackingPrefix: 'edu-22-5490',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '22-5490',
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your DEPENDENTS&#39; APPLICATION FOR VA EDUCATION BENEFITS  application (22-5490) is in progress.',
    //   expired: 'Your saved DEPENDENTS&#39; APPLICATION FOR VA EDUCATION BENEFITS  application (22-5490) has expired. If you want to apply for DEPENDENTS&#39; APPLICATION FOR VA EDUCATION BENEFITS , please start a new application.',
    //   saved: 'Your DEPENDENTS&#39; APPLICATION FOR VA EDUCATION BENEFITS  application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  prefillTransformer,
  savedFormMessages: {
    notFound:
      'Please start over to apply for DEPENDENTS&#39; APPLICATION FOR VA EDUCATION BENEFITS .',
    noAuth:
      'Please sign in again to continue your application for DEPENDENTS&#39; APPLICATION FOR VA EDUCATION BENEFITS .',
  },
  title: 'Apply for education benefits as an eligible dependent',
  subTitle:
    'Equal to VA Form 22-5490 (Dependents’ Application for VA Education Benefits)',
  defaultDefinitions: {
    fullName,
    ssn,
    date,
    dateRange,
    usaPhone,
  },
  chapters: {
    applicantInformationChapter: {
      title: 'Veteran or Service Member Information',
      pages: {
        applicantInformation: {
          path: 'veteran-or-service-member-information',
          title: 'Veteran or Service Member Information',
          uiSchema: {
            relationShipToMember: {
              'ui:title':
                "What's your relationship to the Veteran or service member whose benefits you'd like to use?",
              'ui:widget': 'radio',
              'ui:options': {
                labels: {
                  spouse: 'Spouse',
                  child: 'Child',
                },
              },
            },
            fullName: {
              ...fullNameUI,
              'ui:title': 'Veteran or service member information',
            },
            ssn: ssnUI,
          },
          schema: {
            type: 'object',
            required: ['relationShipToMember', 'fullName', 'ssn'],
            properties: {
              relationShipToMember: {
                type: 'string',
                enum: ['spouse', 'child'],
              },
              fullName,
              ssn,
            },
          },
        },
      },
    },
    benefitSelectionChapter: {
      title: 'Benefit selection',
      pages: {
        benefitSelection: {
          path: 'benefit-selection',
          title: 'Benefit selection',
          uiSchema: {
            'view:subHeading': {
              'ui:description': (
                <>
                  <div>
                    <h3>Choose the benefit you’d like to apply for</h3>
                    <p>
                      <strong>Note:</strong> If you are eligible for both the
                      Fry Scholarship and Survivors’ and Dependents’ Educational
                      Assistance benefits, you’ll need to choose which one to
                      use. Once you make this choice, you can’t switch to the
                      other program.
                    </p>
                  </div>
                </>
              ),
            },
            'view:fry': {
              'ui:description': (
                <>
                  <div className="usa-alert background-color-only">
                    <h5 className="vads-u-font-size--base vads-u-font-family--sans vads-u-font-weight--normal vads-u-margin-y--0">
                      CHAPTER 33
                    </h5>
                    <h4 className="vads-u-font-size--h3 vads-u-margin-top--0 vads-u-margin-bottom--2">
                      Fry Scholarship
                    </h4>

                    <h4 className="vads-u-font-size--h5 vads-u-margin-top--0 vads-u-margin-bottom--2">
                      Receive up to 36 months of benefits, including:
                    </h4>
                    <ul className="fry-dea-benefits-list vads-u-margin--0 vads-u-padding--0 vads-u-margin-bottom--3">
                      <li>
                        <i
                          className="fas fa-school fry-dea-benefit-selection-icon"
                          aria-hidden="true"
                        />{' '}
                        Tuition &amp; fees
                      </li>
                      <li>
                        <i
                          className="fas fa-home fry-dea-benefit-selection-icon"
                          aria-hidden="true"
                        />{' '}
                        Money for housing
                      </li>
                      <li>
                        <i
                          className="fas fa-book fry-dea-benefit-selection-icon"
                          aria-hidden="true"
                        />{' '}
                        Money for books &amp; supplies
                      </li>
                    </ul>
                  </div>
                </>
              ),
            },
            'view:dea': {
              'ui:description': (
                <>
                  <div className="usa-alert background-color-only">
                    <h5 className="vads-u-font-size--base vads-u-font-family--sans vads-u-font-weight--normal vads-u-margin-y--0">
                      DEA, CHAPTER 35
                    </h5>
                    <h4 className="vads-u-font-size--h3 vads-u-margin-top--0 vads-u-margin-bottom--2">
                      Survivors' and Dependents' Educational Assistance
                    </h4>

                    <h4 className="vads-u-font-size--h5 vads-u-margin-top--0 vads-u-margin-bottom--2">
                      Receive up to 36 months of benefits, including:
                    </h4>
                    <ul className="fry-dea-benefits-list vads-u-margin--0 vads-u-padding--0 vads-u-margin-bottom--3">
                      <li>
                        <i
                          className="fas fa-money-bill fry-dea-benefit-selection-icon"
                          aria-hidden="true"
                        />{' '}
                        Monthly stipened
                      </li>
                    </ul>
                  </div>
                  <div>
                    <br />
                    <va-additional-info trigger="Which benefit should I choose?">
                      <p>
                        For each benefit, you should consider the amount you can
                        receive, how payments are made, and when they expire.
                      </p>
                    </va-additional-info>
                  </div>
                </>
              ),
            },
            benefitToChoose: {
              'ui:title': (
                <>
                  <span className="fry-dea-labels_label--main vads-u-padding-left--1">
                    Which education benefit would you like to apply for?
                  </span>
                  <span className="fry-dea-labels_label--secondary fry-dea-input-message fry-dea-review-view-hidden vads-u-background-color--primary-alt-lightest vads-u-padding--1 vads-u-margin-top--1">
                    <i
                      className="fas fa-info-circle vads-u-margin-right--1"
                      aria-hidden="true"
                    />{' '}
                    <span className="sr-only">information</span> If you’re the
                    child of a veteran or service member who died in the line of
                    duty before August 1, 2011 you can use both Fry Scholarship
                    and DEA and get up to 81 months of benefits. You’ll need to
                    apply separately and use one program at a time.
                  </span>
                </>
              ),
              'ui:errorMessages': {
                required: 'Please select an education benefit',
              },
              'ui:widget': 'radio',
              'ui:options': {
                labels: {
                  fry: 'Fry Scholarship (Chapter 33)',
                  dea:
                    'Survivors’ and Dependents’ Educational Assistance (DEA, Chapter 35)',
                },
                widgetProps: {
                  fry: { 'data-info': 'fry' },
                  dea: { 'data-info': 'dea' },
                },
                selectedProps: {
                  fry: { 'aria-describedby': 'fry' },
                  dea: { 'aria-describedby': 'dea' },
                },
              },
            },
          },
          schema: {
            type: 'object',
            required: ['benefitToChoose'],
            properties: {
              'view:subHeading': {
                type: 'object',
                properties: {},
              },
              'view:fry': {
                type: 'object',
                properties: {},
              },
              'view:dea': {
                type: 'object',
                properties: {},
              },
              benefitToChoose: {
                type: 'string',
                enum: ['fry', 'dea'],
              },
            },
          },
        },
      },
    },
    yourInformationChapter: {
      title: 'Your information',
      pages: {
        reviewPersonalInformation: {
          path: 'review-personal-information',
          title: 'Review your Personal Information',
          uiSchema: {
            'view:subHeadings': {
              'ui:description': (
                <>
                  <h3>Review your personal information</h3>
                  <p>
                    We have this personal information on file for you. If you
                    notice any errors, please correct them now. Any updates you
                    make will change the information for your education benefits
                    only.
                  </p>
                  <p>
                    <strong>Note:</strong> If you want to make changes to your
                    personal information for other VA benefits, update your
                    information on your profile.
                  </p>
                  <p>
                    <a href="/profile/personal-information">
                      Go to your profile
                    </a>
                  </p>
                </>
              ),
            },
            'view:personalInformation': {
              'ui:description': <PersonalInformation />,
            },
            highSchoolDiploma: {
              'ui:title':
                'Did you earn a high school or equivalency certificate?',
              'ui:widget': 'radio',
              'ui:options': {
                labels: {
                  yes: 'Yes',
                  no: 'No',
                },
              },
            },
            graduationDate: {
              ...currentOrPastDateUI(
                'When did you earn your high school diploma or equivalency?',
              ),
              'ui:options': {
                hideIf: formData => {
                  return formData?.highSchoolDiploma !== 'yes';
                },
                'ui:required': formData => {
                  return formData?.highSchoolDiploma === 'yes';
                },
              },
            },
          },
          schema: {
            type: 'object',
            required: ['highSchoolDiploma', 'graduationDate'],
            properties: {
              'view:subHeadings': {
                type: 'object',
                properties: {},
              },
              'view:personalInformation': {
                type: 'object',
                properties: {},
              },
              highSchoolDiploma: {
                type: 'string',
                enum: ['yes', 'no'],
              },
              graduationDate: date,
            },
          },
        },
      },
    },
    additionalConsiderationsChapter: {
      title: 'Additional considerations',
      pages: {
        marriageInformation: {
          title: 'Additional considerations',
          subTitle: 'Marriage Information',
          path: 'marriage-information',
          uiSchema: {
            marriageStatus: {
              'ui:title':
                "What's the status of your marriage with your chosen Veteran or service member?",
              'ui:widget': 'radio',
              'ui:options': {
                labels: {
                  married: 'Married',
                  divorced: 'Divorced (or divorce in progress)',
                  anulled:
                    'Marriage was annulled (or an annullment in progress',
                  widowed: 'Widowed',
                },
              },
            },
          },
          schema: {
            type: 'object',
            required: ['marriageStatus'],
            properties: {
              marriageStatus: {
                type: 'string',
                enum: ['married', 'divorced', 'anulled', 'widowed'],
              },
            },
          },
        },
        marriageDate: {
          path: 'marriage-date',
          title: 'Marriage Date',
          uiSchema: {
            marriageDate: {
              ...currentOrPastDateUI(
                'When did you get married to your chosen Veteran or service member?',
              ),
            },
          },
          schema: {
            type: 'object',
            required: ['marriageDate'],
            properties: {
              marriageDate: date,
            },
          },
        },
        remarriageInformation: {
          path: 'remarriage-information',
          title: 'Remarriage Information',
          depends: formData => {
            return formData.marriageStatus !== 'married';
          },
          uiSchema: {
            remarriageStatus: {
              'ui:title': 'Have you been remarried since your divorce?',
              'ui:widget': 'radio',
              'ui:options': {
                labels: {
                  yes: 'Yes',
                  no: 'No',
                },
              },
            },
          },
          schema: {
            type: 'object',
            required: ['remarriageStatus'],
            properties: {
              remarriageStatus: {
                type: 'string',
                enum: ['yes', 'no'],
              },
            },
          },
        },
        remarriageDate: {
          path: 'remarriage-date',
          title: 'Remarriage Date',
          depends: formData => {
            return formData.marriageStatus !== 'married';
          },
          uiSchema: {
            remarriageDate: {
              ...currentOrPastDateUI('When did you get remarried?'),
            },
          },
          schema: {
            type: 'object',
            required: ['remarriageDate'],
            properties: {
              remarriageDate: date,
            },
          },
        },
        outstandingFelony: {
          path: 'outstanding-felony',
          title: 'Outstanding Felony',
          uiSchema: {
            felonyOrWarrant: {
              'ui:title':
                'Do you or your chosen Veteran or service member have an outstanding felony or warrant?',
              'ui:widget': 'radio',
              'ui:options': {
                labels: {
                  yes: 'Yes',
                  no: 'No',
                },
              },
            },
          },
          schema: {
            type: 'object',
            required: ['felonyOrWarrant'],
            properties: {
              felonyOrWarrant: {
                type: 'string',
                enum: ['yes', 'no'],
              },
            },
          },
        },
      },
    },
    contactInformationChapter: {
      title: 'Contact Information',
      pages: {
        contactInformation: {
          path: 'contact-information',
          title: 'Review your phone numbers and email address',
          uiSchema: {
            'view:EmailAndphoneNumbers': {
              'ui:description': (
                <>
                  <h4>We’ll use this information to:</h4>
                  <ul>
                    <li>
                      Contact you if we have questions about your application
                    </li>
                    <li>Tell you important information about your benefits</li>
                  </ul>
                  <p>
                    We have this contact information on file for you. If you
                    notice any errors, please correct them now. Any updates you
                    make will change the information for your education benefits
                    only.
                  </p>
                  <p>
                    <strong>Note:</strong> If you want to make changes to your
                    contact information for other VA benefits, update your
                    information on your profile.
                  </p>
                </>
              ),
            },
            mobilePhone: {
              ...phoneUI('Mobile phone number'),
              'ui:widget': CustomPhoneNumberField,
            },
            homePhone: phoneUI('Home phone number'),
            email: {
              ...emailUI('Email address'),
              'ui:widget': CustomEmailField,
            },
            confirmEmail: {
              ...emailUI('Confirm email address'),
            },
            'view:confirmDuplicateData': {
              'ui:description': DuplicateContactInfoModal,
            },
          },
          schema: {
            type: 'object',
            required: ['email', 'confirmEmail'],
            properties: {
              'view:EmailAndphoneNumbers': {
                type: 'object',
                properties: {},
              },
              mobilePhone: usaPhone,
              homePhone: usaPhone,
              email: {
                type: 'string',
                format: 'email',
              },
              confirmEmail: {
                type: 'string',
                format: 'email',
              },
              'view:confirmDuplicateData': {
                type: 'object',
                properties: {},
              },
            },
          },
        },
        mailingAddress: {
          title: 'Mailing address',
          path: 'contact-information/mailing-address',
          uiSchema: {
            'view:subHeadings': {
              'ui:description': (
                <>
                  <h3>Review your mailing address</h3>
                  <p>
                    We’ll send any important information about your application
                    to this address.
                  </p>
                  <p>
                    This is the mailing address we have on file for you. If you
                    notice any errors, please correct them now. Any updates you
                    make will change the information for your education benefits
                    only.
                  </p>
                  <p>
                    <strong>Note:</strong> If you want to update your personal
                    information for other VA benefits, you can do that from your
                    profile.
                  </p>
                  <p>
                    <a href="/profile/personal-information">
                      Go to your profile
                    </a>
                  </p>
                </>
              ),
            },
            mailingAddressInput: {
              ...addressUI({
                labels: {
                  militaryCheckbox:
                    'I live on a United States military base outside of the U.S.',
                },
                omit: ['street3'],
              }),
            },
          },
          schema: {
            type: 'object',
            required: [],
            properties: {
              'view:subHeadings': {
                type: 'object',
                properties: {},
              },
              mailingAddressInput: addressSchema({ omit: ['street3'] }),
            },
          },
        },
        chooseContactMethod: {
          title: 'Choose your contact method for follow-up questions',
          path: 'contact-information/contact-method',
          uiSchema: {
            contactMethod: {
              'ui:title':
                'How should we contact you if we have questions on your application?',
              'ui:widget': 'radio',
              'ui:options': {
                labels: {
                  email: 'Email',
                  mobilePhone: 'Mobile phone',
                  homePhone: 'Home phone',
                  mail: 'Mail',
                },
              },
            },
            'view:subHeadings': {
              'ui:description': (
                <>
                  <h3>Choose how you want to get notifications?</h3>
                  <p>
                    We recommend that you opt in to text message notifications
                    about your benefits. These notifications can prompt you to
                    verify your enrollment so you’ll receive your education
                    payments. You can verify your monthly enrollment easily this
                    way.
                  </p>
                  <va-alert
                    close-btn-aria-label="Close notification"
                    status="info"
                    visible
                  >
                    <p className="vads-u-margin-y--0">
                      If you choose to get text message notifications from VA’s
                      GI Bill program, message and data rates may apply. Two
                      messages per month. At this time, we can only send text
                      messages to U.S. mobile phone numbers. Text STOP to opt
                      out or HELP for help. View Terms and Conditions and
                      Privacy Policy.
                    </p>
                  </va-alert>
                </>
              ),
            },
            notificationMethod: {
              'ui:title': 'Choose how you want to get notifications?',
              'ui:widget': 'radio',
              'ui:options': {
                labels: {
                  yes: 'Yes, send me text message notifications',
                  no: 'No, just send me email notifications',
                },
              },
            },
          },
          schema: {
            type: 'object',
            required: ['contactMethod'],
            properties: {
              contactMethod: {
                type: 'string',
                enum: ['email', 'mobilePhone', 'homePhone', 'mail'],
              },
              'view:subHeadings': {
                type: 'object',
                properties: {},
              },
              notificationMethod: {
                type: 'string',
                enum: ['yes', 'no'],
              },
            },
          },
        },
      },
    },
    directDepositChapter: {
      title: 'Direct deposit',
      pages: {
        directDeposit: {
          path: 'direct-deposit',
          title: 'Enter your direct deposit information',
          uiSchema: directDeposit.uiSchema,
          schema: directDeposit.schema,
        },
      },
    },
  },
};

export default formConfig;
