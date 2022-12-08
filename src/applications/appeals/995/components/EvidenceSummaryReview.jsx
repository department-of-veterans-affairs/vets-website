import React from 'react';
import PropTypes from 'prop-types';

import {
  hasVAEvidence,
  hasPrivateEvidence,
  hasOtherEvidence,
} from '../utils/helpers';

import { content } from '../content/evidenceSummary';

import {
  buildVaContent,
  buildPrivateContent,
  buildUploadContent,
} from '../utils/evidence';

const EvidenceSummaryReview = ({ data, editPage }) => {
  const { limitedConsent = '' } = data;
  // on review & submit in review mode (not editing)
  const vaEvidence = hasVAEvidence(data) ? data.locations : [];
  const privateEvidence = hasPrivateEvidence(data) ? data.providerFacility : [];
  const otherEvidence = hasOtherEvidence(data) ? data.additionalDocuments : [];

  const evidenceLength =
    vaEvidence.length + privateEvidence.length + otherEvidence.length;

  return (
    <div className="form-review-panel-page">
      <div name="evidenceSummaryScrollElement" />
      <va-button
        class="float-right"
        secondary
        onClick={editPage}
        aria-label="Update evidence page"
        text={content.edit}
      />
      <h4 className="vads-u-font-size--h5 vads-u-display--inline-block">
        {content.reviewPageHeaderText}
      </h4>

      {evidenceLength === 0 ? content.missingEvidence : null}

      {vaEvidence?.length
        ? buildVaContent({ vaEvidence, reviewMode: true })
        : null}
      {privateEvidence?.length
        ? buildPrivateContent({
            privateEvidence,
            limitedConsent,
            reviewMode: true,
          })
        : null}
      {otherEvidence?.length
        ? buildUploadContent({ otherEvidence, reviewMode: true })
        : null}
    </div>
  );
};

EvidenceSummaryReview.propTypes = {
  data: PropTypes.shape({
    locations: PropTypes.array,
    providerFacility: PropTypes.array,
    limitedConsent: PropTypes.string,
    additionalDocuments: PropTypes.array,
  }),
  editPage: PropTypes.func,
};

export default EvidenceSummaryReview;
