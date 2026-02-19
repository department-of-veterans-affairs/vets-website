import React from 'react';
import { Link } from 'react-router';
import {
  titleUI,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const contactMethods = ['Email', 'Mobile Phone', 'Home Phone', 'Mail'];

const uiSchema = {
  ...titleUI({
    title: 'Contact preferences',
    classNames: 'vads-u-color--base vads-u-margin-top--0',
    description: (
      <h4 className="vads-u-margin-bottom--0">
        Choose your contact method for follow-up questions
      </h4>
    ),
  }),
  contactMethod: radioUI({
    title:
      'How should we contact you if we have questions about your application?',
    updateSchema: (formData, schema) => {
      const { homePhone, mobilePhone, emailAddress } = formData?.contactInfo;
      const validContactMethods = [];
      if (emailAddress) {
        validContactMethods.push('Email');
      }
      if (mobilePhone?.isValid) {
        validContactMethods.push('Mobile Phone');
      }
      if (homePhone?.isValid) {
        validContactMethods.push('Home Phone');
      }
      validContactMethods.push('Mail');
      return {
        ...schema,
        enum: validContactMethods,
      };
    },
  }),
  'view:receiveTextMessages': {
    ...titleUI({
      title: 'Choose how you want to get notifications',
      headerLevel: 4,
      classNames: 'vads-u-color--base',
      description: (
        <>
          <p>
            We recommend that you opt in to text message notifications about
            your benefits. These include notifications that prompt you to verify
            your enrollment so you’ll receive your education payments. This is
            an easy way to verify your monthly enrollment.
          </p>
          <p>
            <b>What to know about text notifications:</b>
          </p>
          <ul>
            <li>We’ll send you 2 messages per month.</li>
            <li>Message and data rates may apply.</li>
            <li>If you want to opt out, text STOP.</li>
            <li>If you need help, text HELP.</li>
          </ul>
          <p>
            <va-link
              href="/privacy-policy/digital-notifications-terms-and-conditions/"
              text="Read our text notification terms and conditions"
            />
          </p>
          <p>
            <va-link href="/privacy-policy/" text="Read our privacy policy" />
          </p>
          <p className="vads-u-margin-bottom--0">
            <b>Note:</b> At this time, we can only send text messages to U.S.
            mobile phone numbers
          </p>
        </>
      ),
    }),
    'view:noMobilePhoneAlert': {
      'ui:description': (
        <va-alert slim status="warning">
          We can’t send you text message notifications because we don’t have a
          mobile phone number on file for you.
          <Link
            aria-label="Go back and add a mobile phone number"
            className="update-phone-button"
            to={{
              pathname: 'phone-and-email',
            }}
          >
            <va-button
              secondary
              text="Go back and add a mobile phone number"
              class="vads-u-margin-top--1"
            />
          </Link>
        </va-alert>
      ),
      'ui:options': {
        hideIf: formData => {
          return !!formData?.contactInfo?.mobilePhone?.contact;
        },
      },
    },
    receiveTextMessages: {
      ...radioUI({
        title:
          'Would you like to receive text message notifications on your education benefits?',
      }),
      'ui:validations': [
        (errors, field, formData) => {
          const isYes = field.includes('Yes');
          const phoneExist = !!formData?.contactInfo?.mobilePhone?.contact;
          const isInternational =
            formData?.contactInfo?.mobilePhone?.countryCode !== 'US';
          if (isYes && !phoneExist) {
            errors.addError(
              "You can't select that response because we don't have a mobile phone number on file for you",
            );
          } else if (isYes && isInternational) {
            errors.addError(
              "You can't select that response because you have an international mobile phone number",
            );
          }
        },
      ],
    },
    'view:internationalTextMessageAlert': {
      'ui:description': (
        <va-alert slim status="warning">
          You can’t choose to get text message notifications because you have an
          international mobile phone number. At this time, we can send text
          messages about your education benefits only to U.S. mobile phone
          numbers.
        </va-alert>
      ),
      'ui:options': {
        hideIf: formData => {
          return (
            !formData?.contactInfo?.mobilePhone?.contact ||
            formData?.contactInfo?.mobilePhone?.countryCode === 'US'
          );
        },
      },
    },
    'view:emailOnFileWithSomeoneElseAlert': {
      'ui:description': (
        <va-alert slim status="warning">
          You can’t choose to get email notifications because your email is on
          file for another person with education benefits. You will not be able
          to take full advantage of VA’s electronic notifications and enrollment
          verifications available. If you cannot, certain electronic services
          will be limited or unavailable.
          <va-link
            href="/education/verify-school-enrollment"
            text="Learn more about Enrollment Verifications"
            class="vads-u-display--block vads-u-margin-top--2"
          />
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
    'view:mobilePhoneOnFileWithSomeoneElseAlert': {
      'ui:description': (
        <va-alert slim status="warning">
          You can’t choose to get text notifications because your mobile phone
          number is on file for another person with education benefits. You will
          not be able to take full advantage of VA’s electronic notifications
          and enrollment verifications available. If you cannot, certain
          electronic services will be limited or unavailable.
          <va-link
            href="/education/verify-school-enrollment"
            text="Learn more about Enrollment Verifications"
            class="vads-u-display--block vads-u-margin-top--2"
          />
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

          return !isYes || !duplicatesDetected;
        },
      },
    },
  },
};

const schema = {
  type: 'object',
  required: ['contactMethod'],
  properties: {
    contactMethod: {
      type: 'string',
      enum: contactMethods,
    },
    'view:receiveTextMessages': {
      type: 'object',
      required: ['receiveTextMessages'],
      properties: {
        'view:noMobilePhoneAlert': {
          type: 'object',
          properties: {},
        },
        receiveTextMessages: {
          type: 'string',
          enum: [
            'Yes, send me text message notifications',
            'No, just send me email notifications',
          ],
        },
        'view:internationalTextMessageAlert': {
          type: 'object',
          properties: {},
        },
        'view:emailOnFileWithSomeoneElseAlert': {
          type: 'object',
          properties: {},
        },
        'view:mobilePhoneOnFileWithSomeoneElseAlert': {
          type: 'object',
          properties: {},
        },
      },
    },
  },
};

export { uiSchema, schema };
