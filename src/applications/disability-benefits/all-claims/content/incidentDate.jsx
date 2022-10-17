import React from 'react';
import { VaAdditionalInfo } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { recordEventOnce } from 'platform/monitoring/record-event';
import {
  ANALYTICS_EVENTS,
  HELP_TEXT_CLICKED_EVENT,
  PTSD_TYPES_TO_FORMS,
} from '../constants';

const { combatNonCombat, personalAssaultSexualTrauma } = PTSD_TYPES_TO_FORMS;

export const PtsdDateDescription = ({ formType }) => {
  let ptsdDateEvent;
  if (formType === combatNonCombat) {
    ptsdDateEvent = ANALYTICS_EVENTS.openedPtsd781IncidentDateHelp;
  } else if (formType === personalAssaultSexualTrauma) {
    ptsdDateEvent = ANALYTICS_EVENTS.openedPtsd781aIncidentDateHelp;
  }

  return (
    <div>
      <h3 className="vads-u-font-size--h5">Estimated event date</h3>
      <p>
        Please tell us when this event happened. If it happened over a period of
        time, please tell us when it started.
      </p>
      <VaAdditionalInfo
        trigger="What if I can’t remember the date?"
        disableAnalytics
        onClick={() =>
          ptsdDateEvent &&
          recordEventOnce(ptsdDateEvent, HELP_TEXT_CLICKED_EVENT)
        }
      >
        <p>
          Providing an estimated date within a couple of months of the event
          will help us research your claim.
        </p>
        <p>
          If you’re having trouble remembering the exact date, try remembering
          the time of year or whether the event happened early or late in your
          military service.
        </p>
      </VaAdditionalInfo>
    </div>
  );
};
