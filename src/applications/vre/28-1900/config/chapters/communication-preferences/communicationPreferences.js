import React from 'react';
import fullSchema from 'vets-json-schema/dist/28-1900-schema.json';
import {
  VreCommunicationInformation,
  validateAtLeastOneSelected,
} from './helpers';

const titleClasses = 'vads-u-display--inline-block vads-u-margin--0';

const {
  useEva,
  useTelecounseling,
  appointmentTimePreferences,
} = fullSchema.properties;

export const schema = {
  type: 'object',
  required: ['useEva', 'useTelecounseling'],
  properties: {
    'view:VreCommunicationInformation': {
      type: 'object',
      properties: {},
    },
    useEva,
    useTelecounseling,
    appointmentTimePreferences,
  },
};

export const uiSchema = {
  'view:VreCommunicationInformation': {
    'ui:options': { showFieldLabel: false },
    'ui:description': VreCommunicationInformation,
  },
  useEva: {
    'ui:widget': 'yesNo',
    'ui:title': (
      <p className={titleClasses}>
        Are you interested in using <strong>e-VA?</strong>
      </p>
    ),
  },
  useTelecounseling: {
    'ui:widget': 'yesNo',
    'ui:options': {
      classNames: 'vads-u-margin-top--1',
    },
    'ui:title': (
      <p className={titleClasses}>
        Are you interested in using <strong>Tele-counseling?</strong>
      </p>
    ),
  },
  appointmentTimePreferences: {
    'ui:title': (
      <p className="vads-u-margin--0 vads-u-margin-top-neg2 vads-u-display--inline-block vads-u-font-weight--normal vads-u-color--base vads-u-font-family--sans vads-u-font-size--base">
        Tell us the time you prefer to meet with your counselor. We’ll make
        every effort to assign a counselor who is available to meet during your
        preferred hours. When are the best times to meet with your counselor?
        Select all that apply.{' '}
        <span className="schemaform-required-span vads-u-display--block">
          (*Required)
        </span>
      </p>
    ),
    'ui:validations': [validateAtLeastOneSelected],
    'ui:options': {
      showFieldLabel: true,
      forceDivWrapper: true,
    },
    morning: {
      'ui:title': 'Mornings 6:00 to 10:00 a.m.',
      'ui:options': {
        hideEmptyValueInReview: true,
      },
    },
    midDay: {
      'ui:title': 'Midday 10:00 a.m. to 2:00 p.m.',
      'ui:options': {
        hideEmptyValueInReview: true,
      },
    },
    afternoon: {
      'ui:title': 'Afternoons 2:00 to 6:00 p.m.',
      'ui:options': {
        hideEmptyValueInReview: true,
      },
    },
  },
};
