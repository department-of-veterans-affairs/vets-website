import Raven from 'raven-js';
import { apiRequest } from '../../../common/helpers/api';
import { fetchInProgressForm } from '../../../common/schemaform/save-in-progress/actions';

export const ITFStatuses = Object.freeze({
  active: 'active',
  claim_received: 'claim_received', // eslint-disable-line camelcase
  duplicate: 'duplicate',
  expired: 'expired',
  pending: 'pending',
  incomplete: 'incomplete'
});

const delay = (ms) => new Promise(resolve =>
  setTimeout(resolve, ms)
);

export function submitIntentToFile(formConfig, onChange) {
  const { intentToFileUrl, formId, migrations, prefillTransformer } = formConfig;
  let ITFStatus = ITFStatuses.pending;
  return dispatch => {

    onChange({ ITFStatus });

    return delay(2000).then(() => {
      ITFStatus = ITFStatuses.active;
      onChange({ ITFStatus });

      // TODO: if the backend handles resubmission, this check can be removed
      return ITFStatus === 'active';
    })
      .catch(() => {
        const errorMessage = 'Network request failed';
        onChange({
          ITFStatus,
          errorMessage
        });
        Raven.captureMessage(`vets_itf_error: ${errorMessage}`);
      });
  };
}

//   apiRequest(
//     `${intentToFileUrl}`,
//     null,
//     ({ data }) => {
//       const ITFStatus = data.attributes.ITFStatus
//       onChange({ ITFStatus });
//       return ITFStatus === 'active';
//     },
//     ({ errors }) => {
//       const errorMessage = 'Network request failed';
//       onChange({
//         ITFStatus,
//         errorMessage
//       });
//       Raven.captureMessage(`vets_itf_error: ${errorMessage}`);
//     }
//   );
// };
// }
