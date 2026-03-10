import React from 'react';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';

const Intro = () => (
  <p>
    Next we’ll ask you to submit the Veteran’s DD214 and death certificate for
    your claim. If you upload this information online now, you may be able to
    get a faster decision on your claim. You can upload documents on the next
    page.
  </p>
);

const Documents = () => (
  <div>
    <h4 className="vads-u-color--gray-dark">Required documents</h4>
    <va-accordion>
      <va-accordion-item
        level={5}
        bordered
        header="Veteran's death certificate"
      >
        <p>
          You’ll need to submit a copy of the Veteran’s death certificate. It
          must clearly show the primary cause of death and any contributing
          factors or conditions.
        </p>
        <p>
          <strong>Note:</strong> If the Veteran’s death certificate lists the
          cause of death as "Pending," have the medical examiner submit evidence
          that shows the cause of death.
        </p>
      </va-accordion-item>

      <va-accordion-item
        level={5}
        bordered
        header="Veteran's DD214 or separation documents"
      >
        <p>
          You’ll need to submit a copy of the Veteran’s DD Form 214 or
          equivalent for all periods of military service. It must show when they
          served, the type of service, and the character of their discharge.
        </p>
      </va-accordion-item>
    </va-accordion>
  </div>
);

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI("Veteran's DD214 and death certificate", Intro),
    'ui:description': Documents,
  },
  schema: {
    type: 'object',
    properties: {},
  },
};
