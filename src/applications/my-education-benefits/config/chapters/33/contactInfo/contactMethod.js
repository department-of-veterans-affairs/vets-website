import React from 'react';
import { createSelector } from 'reselect';

import TextNotificationsDisclaimer from '../../../../components/TextNotificationsDisclaimer';
import { formFields } from '../../../../constants';

import { isValidPhone } from '../../../../utils/validation';

const contactMethods = ['Email', 'Home Phone', 'Mobile Phone', 'Mail'];

const contactMethod33 = {
  uiSchema: {
    'view:contactMethodIntro': {
      'ui:description': (
        <>
          <h3 className="meb-form-page-only">
            Choose your contact method for follow-up questions
          </h3>
        </>
      ),
    },
    [formFields.contactMethod]: {
      'ui:title':
        'How should we contact you if we have questions about your application?',
      'ui:widget': 'radio',
      'ui:errorMessages': {
        required: 'Please select at least one way we can contact you.',
      },
      'ui:options': {
        updateSchema: (() => {
          const filterContactMethods = createSelector(
            form => form[formFields.viewPhoneNumbers]?.mobilePhoneNumber?.phone,
            form => form[formFields.viewPhoneNumbers]?.phoneNumber?.phone,
            (mobilePhoneNumber, homePhoneNumber) => {
              const invalidContactMethods = [];

              if (!mobilePhoneNumber) {
                invalidContactMethods.push('Mobile Phone');
              }
              if (!homePhoneNumber) {
                invalidContactMethods.push('Home Phone');
              }

              return {
                enum: contactMethods.filter(
                  method => !invalidContactMethods.includes(method),
                ),
              };
            },
          );

          return form => filterContactMethods(form);
        })(),
      },
    },
    [formFields.viewReceiveTextMessages]: {
      'ui:description': (
        <>
          <div className="meb-form-page-only">
            <h3>Choose how you want to get notifications</h3>
            <p>
              We recommend that you opt in to text message notifications about
              your benefits. These include notifications that prompt you to
              verify your enrollment so you’ll receive your education payments.
              This is an easy way to verify your monthly enrollment.
            </p>

            <TextNotificationsDisclaimer />
          </div>
        </>
      ),
      [formFields.receiveTextMessages]: {
        'ui:title':
          'Would you like to receive text message notifications about your education benefits?',
        'ui:widget': 'radio',
        'ui:validations': [
          (errors, field, formData) => {
            const isYes = field.slice(0, 4).includes('Yes');
            const phoneExist = !!formData[formFields?.viewPhoneNumbers]
              .mobilePhoneNumber?.phone;
            const { isInternational } = formData[
              formFields.viewPhoneNumbers
            ]?.mobilePhoneNumber;

            if (isYes) {
              if (!phoneExist) {
                errors.addError(
                  "You can't select that response because we don't have a mobile phone number on file for you.",
                );
              } else if (isInternational) {
                errors.addError(
                  "You can't select that response because you have an international mobile phone number",
                );
              }
            }
          },
        ],
        'ui:options': {
          widgetProps: {
            Yes: { 'data-info': 'yes' },
            No: { 'data-info': 'no' },
          },
          selectedProps: {
            Yes: { 'aria-describedby': 'yes' },
            No: { 'aria-describedby': 'no' },
          },
        },
      },
    },
    'view:textMessagesAlert': {
      'ui:description': (
        <va-alert status="info">
          <>
            If you choose to get text message notifications from VA’s GI Bill
            program, message and data rates may apply. Students will receive an
            average of two messages per month. At this time, we can only send
            text messages to U.S. mobile phone numbers. Text STOP to opt out or
            HELP for help.{' '}
            <a
              href="https://benefits.va.gov/gibill/isaksonroe/verification_of_enrollment.asp"
              rel="noopener noreferrer"
              target="_blank"
            >
              View Terms and Conditions and Privacy Policy.
            </a>
          </>
        </va-alert>
      ),
      'ui:options': {
        hideIf: formData => {
          const viewPhoneNumbers = formData?.[formFields?.viewPhoneNumbers];
          const mobilePhone =
            viewPhoneNumbers?.[formFields?.mobilePhoneNumber]?.phone;
          const isInternational =
            viewPhoneNumbers?.[formFields?.mobilePhoneNumber]?.isInternational;
          return !isValidPhone(mobilePhone) || isInternational;
        },
      },
    },
    'view:noMobilePhoneAlert': {
      'ui:description': (
        <va-alert status="warning">
          <>
            You can’t choose to get text message notifications because we don’t
            have a mobile phone number on file for you.
          </>
        </va-alert>
      ),
      'ui:options': {
        hideIf: formData => {
          const mobilePhoneInfo =
            formData?.[formFields?.viewPhoneNumbers]?.[
              formFields?.mobilePhoneNumber
            ];
          const mobilePhone = mobilePhoneInfo?.phone;
          const isInternational = mobilePhoneInfo?.isInternational;
          return isValidPhone(mobilePhone) || isInternational;
        },
      },
    },
    'view:internationalTextMessageAlert': {
      'ui:description': (
        <va-alert status="warning">
          <>
            You can’t choose to get text notifications because you have an
            international mobile phone number. At this time, we can send text
            messages about your education benefits to U.S. mobile phone numbers.
          </>
        </va-alert>
      ),
      'ui:options': {
        hideIf: formData => {
          const mobilePhoneNumberInfo =
            formData?.[formFields?.viewPhoneNumbers]?.[
              formFields?.mobilePhoneNumber
            ];
          const isInternational = mobilePhoneNumberInfo?.isInternational;
          return !isInternational;
        },
      },
    },
    'view:emailOnFileWithSomeoneElse': {
      'ui:description': (
        <va-alert status="warning">
          <>
            You can’t choose to get email notifications because your email is on
            file for another person with education benefits. You will not be
            able to take full advantage of VA’s electronic notifications and
            enrollment verifications available. If you cannot, certain
            electronic services will be limited or unavailable.
            <br />
            <br />
            <a
              target="_blank"
              href="https://www.va.gov/education/verify-school-enrollment"
              rel="noreferrer"
            >
              Learn more about the Enrollment Verifications
            </a>
          </>
        </va-alert>
      ),
      'ui:options': {
        hideIf: formData => {
          const isNo = formData['view:receiveTextMessages']?.receiveTextMessages
            ?.slice(0, 3)
            ?.includes('No,');
          const noDuplicates = formData?.duplicateEmail?.some(
            entry => entry?.dupe === false,
          );
          // Return true if isNo is false OR noDuplicates is not false
          return !isNo || noDuplicates;
        },
      },
    },
    'view:mobilePhoneOnFileWithSomeoneElse': {
      'ui:description': (
        <va-alert status="warning">
          <>
            You can’t choose to get text notifications because your mobile phone
            number is on file for another person with education benefits. You
            will not be able to take full advantage of VA’s electronic
            notifications and enrollment verifications available. If you cannot,
            certain electronic services will be limited or unavailable.
            <br />
            <br />
            <a
              target="_blank"
              href="https://www.va.gov/education/verify-school-enrollment"
              rel="noreferrer"
            >
              Learn more about the Enrollment Verifications
            </a>
          </>
        </va-alert>
      ),
      'ui:options': {
        hideIf: formData => {
          const isYes = formData[
            'view:receiveTextMessages'
          ]?.receiveTextMessages
            ?.slice(0, 4)
            ?.includes('Yes');
          const duplicatesDetected = formData?.duplicatePhone?.some(
            entry => entry?.dupe === true,
          );
          const mobilePhone =
            formData[formFields?.viewPhoneNumbers]?.[
              formFields?.mobilePhoneNumber
            ]?.phone;

          return !isYes || !duplicatesDetected || !mobilePhone;
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:contactMethodIntro': {
        type: 'object',
        properties: {},
      },
      [formFields.contactMethod]: {
        type: 'string',
        enum: contactMethods,
      },
      [formFields.viewReceiveTextMessages]: {
        type: 'object',
        required: [formFields.receiveTextMessages],
        properties: {
          [formFields.receiveTextMessages]: {
            type: 'string',
            enum: [
              'Yes, send me text message notifications',
              'No, just send me email notifications',
            ],
          },
        },
      },
      'view:textMessagesAlert': {
        type: 'object',
        properties: {},
      },
      'view:noMobilePhoneAlert': {
        type: 'object',
        properties: {},
      },
      'view:internationalTextMessageAlert': {
        type: 'object',
        properties: {},
      },
      'view:emailOnFileWithSomeoneElse': {
        type: 'object',
        properties: {},
      },
      'view:mobilePhoneOnFileWithSomeoneElse': {
        type: 'object',
        properties: {},
      },
      'view:duplicateEmailAndPhoneAndNoHomePhone': {
        type: 'object',
        properties: {},
      },
    },
    required: [formFields.contactMethod],
  },
};

export default contactMethod33;
