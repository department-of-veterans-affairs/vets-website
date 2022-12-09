import React from 'react';
import PropTypes from 'prop-types';

import { VaRadio } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';

import { EVIDENCE_VA_PATH, EVIDENCE_VA, EVIDENCE_PRIVATE } from '../constants';

import {
  privateRecordsRequestTitle,
  privateRecordsRequestInfo,
} from '../content/evidencePrivateRecordsRequest';

/**
 * This page is needed to make the back button on this page to to the last
 */
const EvidencePrivateRequest = ({
  data = {},
  onReviewPage,
  goBack,
  goForward,
  goToPath,
  setFormData,
  contentBeforeButtons,
  contentAfterButtons,
}) => {
  const { locations = [] } = data || {};

  const handlers = {
    onSelected: event => {
      setFormData({
        ...data,
        [EVIDENCE_PRIVATE]: event.detail.value === 'y',
      });
    },
    onGoBack: () => {
      if (data[EVIDENCE_VA]) {
        // go to last VA location entry, but only if they requested it
        goToPath(`/${EVIDENCE_VA_PATH}?index=${locations.length - 1}`);
      } else {
        // go to request VA evidence page
        goBack();
      }
    },
  };

  return (
    <form onSubmit={handlers.onGoForward}>
      <VaRadio
        label={privateRecordsRequestTitle}
        onVaValueChange={handlers.onSelected}
      >
        <va-radio-option
          label="Yes"
          name="private"
          value="y"
          checked={data[EVIDENCE_PRIVATE]}
        />
        <va-radio-option
          label="No"
          name="private"
          value="n"
          checked={!data[EVIDENCE_PRIVATE]}
        />
      </VaRadio>
      {privateRecordsRequestInfo}
      <div className="vads-u-margin-top--4">
        {onReviewPage ? (
          <button type="submit">Review update button</button>
        ) : (
          <>
            {contentBeforeButtons}
            <FormNavButtons goBack={handlers.onGoBack} goForward={goForward} />
            {contentAfterButtons}
          </>
        )}
      </div>
    </form>
  );
};

EvidencePrivateRequest.propTypes = {
  contentAfterButtons: PropTypes.element,
  contentBeforeButtons: PropTypes.element,
  data: PropTypes.shape({}),
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  goToPath: PropTypes.func,
  setFormData: PropTypes.func,
  testingIndex: PropTypes.number,
  onReviewPage: PropTypes.bool,
};

export default EvidencePrivateRequest;
