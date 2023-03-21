import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Element } from 'react-scroll';

import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import { focusElement } from 'platform/utilities/ui';
import scrollTo from 'platform/utilities/ui/scrollTo';

import {
  hasVAEvidence,
  hasPrivateEvidence,
  hasOtherEvidence,
} from '../utils/helpers';

import { content } from '../content/evidenceSummary';

import {
  VaContent,
  PrivateContent,
  UploadContent,
} from './EvidenceSummaryLists';

const EvidenceSummary = ({
  data,
  goBack,
  goForward,
  setFormData,
  contentBeforeButtons,
  contentAfterButtons,
  // on review & submit page, in edit mode
  onReviewPage,
  updatePage,
}) => {
  const { limitedConsent = '' } = data;
  const vaEvidence = hasVAEvidence(data) ? data.locations : [];
  const privateEvidence = hasPrivateEvidence(data) ? data.providerFacility : [];
  const otherEvidence = hasOtherEvidence(data) ? data.additionalDocuments : [];

  const evidenceLength =
    vaEvidence.length + privateEvidence.length + otherEvidence.length;

  useEffect(
    () => {
      if (evidenceLength === 0) {
        focusElement('#no-evidence');
        scrollTo('evidenceSummaryScrollElement');
      }
    },
    [evidenceLength],
  );

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
      goForward(data);
    },
    onUpdate: () => {
      updatePage();
    },
  };
  const visibleError = evidenceLength === 0;
  const H = onReviewPage ? 'h5' : 'h3';

  const props = {
    handlers,
    onReviewPage,
    testing: contentBeforeButtons === 'testing',
  };

  const Header = onReviewPage ? 'h4' : 'h3';

  return (
    <div className={onReviewPage ? 'form-review-panel-page' : ''}>
      {/* <Element> is outside of div wrapper because of how the first element
        is found and focused in the ReviewCollapsibleChapter code */}
      <Element name="evidenceSummaryScrollElement" />
      <div>
        {/* Maintains header levels in edit mode on review & submit page */}
        <Header className="vads-u-font-size--h3 vads-u-margin--0">
          {content.summaryTitle}
        </Header>

        {/* We are rendering the va-alert so the focus doesn't need to wait for
          render. Problems that show up include:
          - focusElement will add -1 if this isn't set; and don't make it
            tabbable when hidden
          - Only render the alert content since the screenreader can still
            target the headers inside */}
        <va-alert
          id="no-evidence"
          status="warning"
          visible={visibleError}
          class="vads-u-margin-top--4"
        >
          {visibleError && (
            <>
              <H slot="headline">{content.missingEvidenceHeader}</H>
              {content.missingEvidenceText}
            </>
          )}
        </va-alert>

        <VaContent list={vaEvidence} {...props} />
        <PrivateContent
          list={privateEvidence}
          limitedConsent={limitedConsent}
          {...props}
        />
        <UploadContent list={otherEvidence} {...props} />

        {content.addMoreLink}

        <div className="form-nav-buttons vads-u-margin-top--4">
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
              <FormNavButtons
                goBack={goBack}
                goForward={handlers.onGoForward}
              />
              {contentAfterButtons}
            </>
          )}
        </div>
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
