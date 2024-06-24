import React from 'react';
import { representativeTypeMap } from '../utilities/helpers';

export const authorizeMedical = ({ formData }) => (
  <>
    <p>We’ll save your application after every change.</p>
    <h3>Authorization to access certain medical records</h3>
    <p>
      This accredited {representativeTypeMap[formData.repTypeRadio]} may need to
      access certain medical records to help you. You can authorize them to
      access all or some of these types of records:
    </p>
    <ul>
      <li>Alcoholism and alcohol abuse records</li>
      <li>Drug abuse records</li>
      <li>HIV (human immunodeficiency virus) records</li>
      <li>Sickle cell anemia records</li>
    </ul>
  </>
);

export const authorizationNote = (
  <>
    <strong>Note:</strong> You can cancel this authorization any time.
  </>
);
