import React, { useState } from 'react';
import PropTypes from 'prop-types';

import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import { focusElement } from 'platform/utilities/ui';
import scrollTo from 'platform/utilities/ui/scrollTo';

import {
  hasVAEvidence,
  hasPrivateEvidence,
  hasOtherEvidence,
} from '../utils/helpers';

import { checkValidations } from '../validations';
import { validateEvidence } from '../validations/evidence';

import { content } from '../content/evidenceSummary';

import {
  buildVaContent,
  buildPrivateContent,
  buildUploadContent,
} from '../content/evidenceSummaryLists';

const EvidenceSummary = ({
  data,
  goBack,
  goForward,
  setFormData,
  contentBeforeButtons,
  contentAfterButtons,
  // review & submit page
  onReviewPage,
  updatePage,
}) => {
  // when on review & submit page, we're in edit mode
  const { limitedConsent = '' } = data;
  // Don't show you haven't added any evidence alert before submitting, except
  // on the review & submit page
  const [submitted, setSubmitted] = useState(onReviewPage || false);
  const vaEvidence = hasVAEvidence(data) ? data.locations : [];
  const privateEvidence = hasPrivateEvidence(data) ? data.providerFacility : [];
  const otherEvidence = hasOtherEvidence(data) ? data.additionalDocuments : [];
  const testing = contentBeforeButtons === 'testing';

  const evidenceLength =
    vaEvidence.length + privateEvidence.length + otherEvidence.length;

  const handlers = {
    removeVaLocation: event => {
      const { target } = event;
      const index = parseInt(target.dataset.index, 10);
      vaEvidence.splice(index, 1);
      setFormData({ ...data, locations: vaEvidence });
    },
    removePrivateFacility: event => {
      const { target } = event;
      const index = parseInt(target.dataset.index, 10);
      privateEvidence.splice(index, 1);
      setFormData({ ...data, providerFacility: privateEvidence });
    },
    removePrivateLimitation: () => {
      setFormData({ ...data, limitedConsent: '' });
    },
    removeUpload: event => {
      const { target } = event;
      const index = parseInt(target.dataset.index, 10);
      otherEvidence.splice(index, 1);
      setFormData({ ...data, additionalDocuments: otherEvidence });
    },
    onGoForward: () => {
      checkValidations([validateEvidence], data);
      if (evidenceLength !== 0) {
        goForward(data);
      } else {
        setSubmitted(true);
        focusElement('#no-evidence');
        scrollTo('evidenceSummaryScrollElement');
      }
    },
    onUpdate: () => {
      checkValidations([validateEvidence], data);
      if (evidenceLength !== 0) {
        setSubmitted(true);
        updatePage();
      } else {
        focusElement('#no-evidence');
        scrollTo('evidenceSummaryScrollElement');
      }
    },
  };
  const visibleError = submitted && evidenceLength === 0;
  const alertTabindex = visibleError ? '0' : '-1';
  const H = onReviewPage ? 'h5' : 'h2';

  return (
    <div className={onReviewPage ? 'form-review-panel-page' : ''}>
      <div name="evidenceSummaryScrollElement" />
      <va-alert
        id="no-evidence"
        status="error"
        visible={visibleError}
        tabindex={alertTabindex}
      >
        <H slot="headline">{content.missingEvidenceHeader}</H>
        {content.missingEvidenceText}
      </va-alert>
      {vaEvidence?.length
        ? buildVaContent({ vaEvidence, handlers, testing })
        : null}
      {privateEvidence?.length
        ? buildPrivateContent({
            privateEvidence,
            limitedConsent,
            handlers,
            testing,
          })
        : null}
      {otherEvidence?.length
        ? buildUploadContent({ otherEvidence, handlers, testing })
        : null}

      {content.addMoreLink}

      <div className="vads-u-margin-top--4">
        {onReviewPage && (
          <va-button
            onClick={handlers.onUpdate}
            label="Update evidence page"
            text={content.update}
          />
        )}
        {!onReviewPage && (
          <>
            {contentBeforeButtons}
            <FormNavButtons goBack={goBack} goForward={handlers.onGoForward} />
            {contentAfterButtons}
          </>
        )}
      </div>
    </div>
  );
};

EvidenceSummary.propTypes = {
  contentAfterButtons: PropTypes.element,
  contentBeforeButtons: PropTypes.element,
  data: PropTypes.shape({
    locations: PropTypes.array,
    providerFacility: PropTypes.array,
    limitedConsent: PropTypes.string,
    additionalDocuments: PropTypes.array,
  }),
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
  onReviewPage: PropTypes.bool,
};

export default EvidenceSummary;
