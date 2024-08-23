import { useEffect } from 'react';
import recordEvent from '@department-of-veterans-affairs/platform-monitoring/record-event';

const recordRxSession = eventSkillValue => {
  if (eventSkillValue) {
    recordEvent({
      event: 'api_call',
      'api-name': 'Skill Entry',
      topic: eventSkillValue,
      'api-status': 'successful',
    });
  }
};

export default function useRecordRxSession(eventSkillValue) {
  useEffect(() => recordRxSession(eventSkillValue), [eventSkillValue]);
}
