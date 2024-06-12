import React from 'react';
import { authorizationNote } from '../content/authorizeMedical';
import { saveYourApplication } from '../content/saveYourApplication';

export const uiSchema = {
  'view:saveYourApplication': {
    'ui:description': saveYourApplication,
  },
  'view:authorizeMedical': {
    'ui:description': formData => {
      return (
        <>
          <h3>Authorization to access certain medical records</h3>
          <p>
            This accredited{' '}
            {formData.repType || `Veterans Service Organization (VSO)`} may need
            to access certain medical records to help you. You can authorize
            them to access all or some of these types of records:
          </p>
          <ul>
            <li>Alcoholism and alcohol abuse records</li>
            <li>Drug abuse records</li>
            <li>HIV (human immunodeficiency virus) records</li>
            <li>Sickle cell anemia records</li>
          </ul>
        </>
      );
    },
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
  authorizationRadio: {
    'ui:title': `Do you authorize this accredited VSO to access your medical records?`,
    'ui:widget': 'radio',
    'ui:options': {
      widgetProps: {
        'All records': { 'data-info': 'all_records' },
        'Some records': { 'data-info': 'some_records' },
        'No records': { 'data-info': 'no_records' },
      },
      selectedProps: {
        'All records': { 'aria-describedby': 'all_records' },
        'Some records': { 'aria-describedby': 'some_records' },
        'No records': { 'aria-describedby': 'no_records' },
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
    'view:authorizeMedical': {
      type: 'object',
      properties: {},
    },
    'view:authorizationPolicy': {
      type: 'object',
      properties: {},
    },
    authorizationRadio: {
      type: 'string',
      enum: [
        'Yes, they can access all of these types of records',
        'Yes, but they can only access some of these types of records',
        `No, they can't access any of these types of records`,
      ],
    },
    'view:authorizationNote': {
      type: 'object',
      properties: {},
    },
  },
};
