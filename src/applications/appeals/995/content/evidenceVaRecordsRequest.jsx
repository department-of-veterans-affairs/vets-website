import React from 'react';

import { Toggler } from 'platform/utilities/feature-toggles';

export const requestVaRecordsTitleOld =
  'Would you like us to request your VA medical records for you?';

export const requestVaRecordsTitle =
  'Do you want us to get your medical records from a VA or military treatment location?';

export const requestVaRecordsHint =
  'We can get your medical records from a VA hospital or clinic, a military hospital or clinic, or a community care provider (paid for by VA).';

export const requestVaRecordsInfo = (
  <Toggler toggleName={Toggler.TOGGLE_NAMES.scNewForm}>
    <Toggler.Disabled>
      <va-additional-info
        trigger="How do I know if I have VA medical records?"
        uswds
      >
        <p>
          You have VA medical records if you were treated at a VA medical center
          or clinic, or by a doctor through the TRICARE health care program.
        </p>
      </va-additional-info>
    </Toggler.Disabled>
  </Toggler>
);
