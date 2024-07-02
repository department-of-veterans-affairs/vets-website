import React from 'react';
import {
  radioSchema,
  radioUI,
} from '~/platform/forms-system/src/js/web-component-patterns';
import { authorizationNote } from '../../content/authorizeMedical';
import { representativeTypeMap } from '../../utilities/helpers';

export const uiSchema = {
  'ui:description': ({ formData }) => {
    return (
      <>
        <h3>Authorization to change your address</h3>
        <p className="appoint-text">
          This accredited{' '}
          {representativeTypeMap[formData.repTypeRadio] || 'representative'} can
          help you change the address on your VA records. If the address on your
          VA records is incorrect or outdated, it may take us longer to contact
          you and process your benefit claims.
        </p>
      </>
    );
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
  authorizeAddressRadio: radioUI({
    title:
      'Do you authorize this accredited representative to change your address on VA records?',
    updateUiSchema: formData => {
      const title = `Do you authorize this accredited ${representativeTypeMap[
        (formData?.repTypeRadio)
      ] || 'representative'} to change your address on VA records?`;
      return { 'ui:title': title };
    },
  }),

  'view:authorizationNote3': {
    'ui:description': authorizationNote,
  },
};

export const schema = {
  type: 'object',
  required: ['authorizeAddressRadio'],
  properties: {
    'view:addressAuthorizationPolicy': {
      type: 'object',
      properties: {},
    },
    authorizeAddressRadio: radioSchema([
      `Yes, they can change my address if it's incorrect or outdated`,
      `No, they can't change my address`,
    ]),
    'view:authorizationNote3': {
      type: 'object',
      properties: {},
    },
  },
};
