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
        <h3>Authorization to access certain medical records</h3>
        <p className="appoint-text">
          This accredited{' '}
          {representativeTypeMap[formData.repTypeRadio] || 'representative'} may
          need to access certain medical records to help you. You can authorize
          them to access all or some of these types of records:
        </p>
        <ul className="appoint-text">
          <li>Alcoholism and alcohol abuse records</li>
          <li>Drug abuse records</li>
          <li>HIV (human immunodeficiency virus) records</li>
          <li>Sickle cell anemia records</li>
        </ul>
      </>
    );
  },
  'view:authorizationPolicy': {
    'ui:description': () => {
      return (
        <div className="vads-u-margin-y--3">
          <va-accordion uswds bordered open-single>
            <va-accordion-item
              bordered
              header="Our records authorization policy"
            >
              <p>
                <strong>I authorize</strong> the VA facility having custody of
                my VA claimant records to disclose to the service organization
                named in Item 15 all treatment records relating to drug abuse,
                alcoholism or alcohol abuse, infection with the human
                immunodeficiency virus (HIV), or sickle cell anemia.
                Redisclosure of these records by my service organization
                representative, other than to VA or the Court of Appeals for
                Veterans Claims, is not authorized without my further written
                consent. This authorization will remain in effect until the
                earlier of the following events: (1) I revoke this authorization
                by filing a written revocation with VA; or (2) I revoke the
                appointment of the service organization named in Item 15, by
                explicit revocation or the appointment of another
                representative.
              </p>
            </va-accordion-item>
          </va-accordion>
        </div>
      );
    },
  },
  authorizationRadio: radioUI({
    title:
      'Do you authorize this accredited representative to access your medical records?',
    updateUiSchema: formData => {
      const title = `Do you authorize this accredited ${representativeTypeMap[
        (formData?.repTypeRadio)
      ] || 'representative'} to access your medical records?`;
      return { 'ui:title': title };
    },
  }),
  'view:authorizationNote4': {
    'ui:description': authorizationNote,
  },
};

export const schema = {
  type: 'object',
  required: ['authorizationRadio'],
  properties: {
    'view:authorizationPolicy': {
      type: 'object',
      properties: {},
    },
    authorizationRadio: radioSchema([
      'Yes, they can access all of these types of records',
      'Yes, but they can only access some of these types of records',
      `No, they can't access any of these types of records`,
    ]),
    'view:authorizationNote4': {
      type: 'object',
      properties: {},
    },
  },
};
