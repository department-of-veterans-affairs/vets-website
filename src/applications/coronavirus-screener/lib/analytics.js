import recordEvent from 'platform/monitoring/record-event';
import moment from 'moment';

// record completion event to GA
export function recordCompletion({ formState, setFormState }) {
  if (formState.status !== 'incomplete' && formState.completed === false) {
    recordEvent({
      event: 'covid-screening-tool-result-displayed',
      'screening-tool-result': formState.result,
      'time-to-complete': moment().unix() - formState.startTime,
    });
    setFormState({ ...formState, completed: true });
  }
}
