import React from 'react';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { serviceStatuses } from '../constants';

const requiredDocumentMessages = {
  [serviceStatuses.VETERAN]: (
    <p>You’ll need to upload a copy of your discharge or separation papers (DD214) showing character of service.</p>
  ),
  [serviceStatuses.ADSM]: (
    <>
      <p>You’ll need to upload a Statement of Service.</p>
      <va-accordion>
        <va-accordion-item open="true">
          <h3 className="vads-u-font-size--h6" slot="headline">
            Service Statement
          </h3>
          <p>The statement of service can be signed by, or by direction of, the adjutant, personnel officer, or commander of your unit or higher headquarters. The statement may be in any format; usually a standard or bulleted memo is sufficient. It should identify you by name and social security number and provide: (1) your date of entry on your current active-duty period and (2) the duration of any time lost (or a statement noting there has been no time lost). Generally, this should be on military letterhead.</p>
        </va-accordion-item>
      </va-accordion>
    </>
  ),
  [serviceStatuses.NADNA]: (
    <>
      <p>You’ll need to upload these documents:</p>
      <ul>
        <li>Statement of Service</li>
        <li>Creditable number of years served or Retirement Points Statement or equivalent</li>
      </ul>
    </>
  ),
  [serviceStatuses.DNANA]: (
    <>
      <p>You’ll need to upload these documents:</p>
      <ul>
        <li>Separation and Report of Service (NGB Form 22) for each period of National Guard service</li>
        <li>Retirement Points Accounting (NGB Form 23)</li>
        <li>Proof of character of service such as a DD214 <strong>or</strong> Department of Defense Discharge Certificate</li>
      </ul>
    </>
  ),
  [serviceStatuses.DRNA]: (
    <>
      <p>You’ll need to upload these documents:</p>
      <ul>
        <li>Retirement Point Accounting</li>
        <li>Proof of honorable service for at least six years such as a DD214 or Department of Defense Discharge Certificate</li>
      </ul>
    </>
  )
};

export const getUiSchema = () => ({
  ...titleUI(
    'Upload your documents',
    ({ formData }) => requiredDocumentMessages[formData.identity] || null,
  ),
});

export default {
  uiSchema: {
    ...titleUI(
      'Upload your documents',
      'You’ll need to upload these documents:',
    ),
  },
  schema: {
    type: 'object',
    properties: {},
  },
};
