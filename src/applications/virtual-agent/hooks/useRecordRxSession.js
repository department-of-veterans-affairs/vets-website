import { useEffect } from 'react';
import recordEvent from '@department-of-veterans-affairs/platform-monitoring/record-event';

const recordRxSession = isRXSkill => {
  if (isRXSkill === 'true') {
    recordEvent({
      event: 'api_call',
      'api-name': 'Enter Chatbot Rx Skill',
      'api-status': 'successful',
    });
  }
};

export default function useRecordRxSession(isRXSkill) {
  useEffect(() => recordRxSession(isRXSkill), [isRXSkill]);
}
