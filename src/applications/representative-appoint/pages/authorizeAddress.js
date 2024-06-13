import React from 'react';
import { authorizationNote } from '../content/authorizeMedical';
import { saveYourApplication } from '../content/saveYourApplication';

export const uiSchema = {
  'view:saveYourApplication': {
    'ui:description': saveYourApplication,
  },
  'view:authorizeAddress': {
    'ui:description': formData => {
      return (
        <>
          <h3>Authorization to change your address</h3>
          <p>
            This accredited{' '}
            {formData.repType || `Veterans Service Organization (VSO)`} can help
            you change the address on your VA records. If the address on your VA
            records is incorrect or outdated, it may take us longer to contact
            you and process your benefit claims.
          </p>
        </>
      );
    },
  },
  'view:addressAuthorizationPolicy': {
    'ui:description': () => {
      return (
        <div className="vads-u-margin-y--3">
          <va-accordion uswds bordered open-single>
            <va-accordion-item
              bordered
              header="Our address authorization policy"
            >
              <p>
                <strong>I authorize</strong> any official representative of the
                organization named in Item 15 to act on my behalf to change my
                address in my VA records. This authorization does not extend to
                any other organization without my further written consent. This
                authorization will remain in effect until the earlier of the
                following events: (1) I revoke this authorization by filing a
                written revocation with VA; or (2) I appoint another
                representative, or (3) I have been determined unable to manage
                my financial affairs and the individual or organization named in
                Item 16A is not my appointed fiduciary.
              </p>
            </va-accordion-item>
          </va-accordion>
        </div>
      );
    },
  },
  authorizeAddressRadio: {
    'ui:title': `Do you authorize this accredited VSO to change your address on VA records?`,
    'ui:widget': 'radio',
    'ui:options': {
      widgetProps: {
        'Yes address change': { 'data-info': 'yes_address_change' },
        'No address change': { 'data-info': 'no_address_change' },
      },
      selectedProps: {
        'Yes address change': { 'aria-describedby': 'yes_address_change' },
        'No address change': { 'aria-describedby': 'no_address_change' },
      },
    },
  },

  'view:authorizationNote': {
    'ui:description': authorizationNote,
  },
};

export const schema = {
  type: 'object',
  properties: {
    'view:saveYourApplication': {
      type: 'object',
      properties: {},
    },
    'view:authorizeAddress': {
      type: 'object',
      properties: {},
    },
    'view:addressAuthorizationPolicy': {
      type: 'object',
      properties: {},
    },
    authorizeAddressRadio: {
      type: 'string',
      enum: [
        `Yes, they can change my address if it's incorrect or outdated`,
        `No, they can't change my address`,
      ],
    },
    'view:authorizationNote': {
      type: 'object',
      properties: {},
    },
  },
};
