import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { focusElement } from '@department-of-veterans-affairs/platform-forms-system/ui';
import {
  getVAEvidence,
  getPrivateEvidence,
  getOtherEvidence,
} from '../utils/evidence';
import { content } from '../content/evidenceSummary';
import { EvidencePrivateContent } from './EvidencePrivateContent';
import { EvidenceUploadContent } from './EvidenceUploadContent';
import { EvidenceVaContent } from './EvidenceVaContent';
import { SUMMARY_EDIT, LIMITED_CONSENT_RESPONSE } from '../constants';
import { data995 } from '../../shared/props';

const EvidenceSummaryReview = ({ data, editPage }) => {
  const { limitedConsent = '', privacyAgreementAccepted } = data;
  const editRef = useRef(null);

  useEffect(
    () => {
      if (
        window.sessionStorage.getItem(SUMMARY_EDIT) === 'true' &&
        editRef?.current
      ) {
        // focus on edit button _after_ editing and returning
        window.sessionStorage.removeItem(SUMMARY_EDIT);
        setTimeout(() => focusElement('button', {}, editRef.current));
      }
    },
    [editRef],
  );

  // on review & submit in review mode (not editing)
  const vaEvidence = getVAEvidence(data);
  const privateEvidence = getPrivateEvidence(data);
  const otherEvidence = getOtherEvidence(data);

  const evidenceLength =
    vaEvidence.length + privateEvidence.length + otherEvidence.length;
  const noEvidence = evidenceLength === 0;

  const handlers = {
    onEditPage: () => {
      // maintain state using session storage
      window.sessionStorage.setItem(SUMMARY_EDIT, 'true');
      editPage();
    },
  };

  const props = {
    isOnReviewPage: true,
    reviewMode: true,
  };

  return (
    <div className="form-review-panel-page">
      <div name="evidenceSummaryScrollElement" />
      <div className="form-review-panel-page-header-row">
        <h4 className="form-review-panel-page-header vads-u-font-size--h5">
          {content.summaryTitle}
        </h4>
        <va-button
          ref={editRef}
          secondary
          class="edit-page"
          onClick={handlers.onEditPage}
          label={content.editLabel}
          text={content.edit}
        />
      </div>
      {noEvidence ? (
        <dl className="review">
          <div className="review-row">
            <dt>{content.missingEvidenceReviewText}</dt>
            <dd />
          </div>
        </dl>
      ) : null}
      <EvidenceVaContent list={vaEvidence} {...props} />
      <EvidencePrivateContent
        list={privateEvidence}
        limitedConsentResponse={data?.[LIMITED_CONSENT_RESPONSE]}
        limitedConsent={limitedConsent}
        privacyAgreementAccepted={privacyAgreementAccepted}
        {...props}
      />
      <EvidenceUploadContent list={otherEvidence} {...props} />
    </div>
  );
};

EvidenceSummaryReview.propTypes = {
  data: data995,
  editPage: PropTypes.func,
};

export default EvidenceSummaryReview;

/* 
<ul class="evidence-summary remove-bullets" role="list">
  <li class="vads-u-padding-x--0 vads-u-border-top--1px vads-u-border-color--gray-light vads-u-padding-y--2 vads-u-margin-bottom--2">
  <div class="">
  <h6 class="va-location dd-privacy-hidden overflow-wrap-word vads-u-margin-y--0 vads-u-font-weight--bold" data-dd-action-name="VA location name">South Texas VA Facility</h6>
<div class="dd-privacy-hidden overflow-wrap-word" data-dd-action-name="VA location treated issues">Hypertension</div>
<div class="dd-privacy-hidden" data-dd-action-name="VA location treatment date">February 2000</div>
</div>
</li>
<li class="vads-u-padding-x--0 vads-u-border-top--1px vads-u-border-color--gray-light vads-u-padding-y--2 vads-u-margin-bottom--2">
  <div class="">
  <h6 class="va-location dd-privacy-hidden overflow-wrap-word vads-u-margin-y--0 vads-u-font-weight--bold" data-dd-action-name="VA location name">Midwest Alabama VA Facility</h6>
<div class="dd-privacy-hidden overflow-wrap-word" data-dd-action-name="VA location treated issues">Hypertension and Gluten Intolerance</div>I don’t have the date<div class="dd-privacy-hidden" data-dd-action-name="VA location treatment date">
  </div>
</div>
</li>
</ul>
<h5 class="private-title vads-u-font-weight--bold">We’re requesting records from these non-VA medical providers:</h5>
<ul class="evidence-summary remove-bullets" role="list">
  <li class="vads-u-padding-x--0 vads-u-border-top--1px vads-u-border-color--gray-light vads-u-padding-y--2">
  <h6 class="private-authorization vads-u-margin-y--0 vads-u-font-weight--bold">Authorize the release of non-VA medical records to the VA (21-4142)</h6>
<div>
  <span class="usa-input-error-message" error="error">You must give us authorization for us to get your non-VA medical records</span>
</div>
</li>
<li class="vads-u-padding-x--0 vads-u-border-top--1px vads-u-border-color--gray-light vads-u-padding-y--2">
  <h6 class="private-limitation-yn vads-u-margin-y--0 vads-u-font-weight--bold">Do you want to limit consent for the information requested?</h6>
<p>No</p>
</li>
<li class="vads-u-padding-x--0 vads-u-border-top--1px vads-u-border-color--gray-light vads-u-padding-y--2 vads-u-margin-bottom--2">
  <div class="">
  <h6 class="private-facility dd-privacy-hidden overflow-wrap-word vads-u-margin-y--0 vads-u-font-weight--bold" data-dd-action-name="Non-VA facility name">Provider One</h6>
<div>
  </div>
<div class="dd-privacy-hidden overflow-wrap-word" data-dd-action-name="Non-VA facility treated issues">Hypertension, Right Knee Injury, and Migraines</div>
<div>
  </div>
<div class="dd-privacy-hidden vads-u-margin-bottom--1p5" data-dd-action-name="Non-VA facility treatment date range">May 6, 2015 – May 8, 2015</div>
</div>
</li>
<li class="vads-u-padding-x--0 vads-u-border-top--1px vads-u-border-color--gray-light vads-u-padding-y--2 vads-u-margin-bottom--2">
  <div class="">
  <h6 class="private-facility dd-privacy-hidden overflow-wrap-word vads-u-margin-y--0 vads-u-font-weight--bold" data-dd-action-name="Non-VA facility name">Provider Two</h6>
<div>
  </div>
<div class="dd-privacy-hidden overflow-wrap-word" data-dd-action-name="Non-VA facility treated issues">Right Knee Injury and Migraines</div>
<div>
  </div>
<div class="dd-privacy-hidden vads-u-margin-bottom--1p5" data-dd-action-name="Non-VA facility treatment date range">Dec 13, 2010 – Dec 15, 2010</div>
</div>
</li>
<li class="vads-u-padding-x--0 vads-u-border-top--1px vads-u-border-color--gray-light vads-u-padding-y--2 vads-u-margin-bottom--2">
  <div class="">
  <h6 class="private-facility dd-privacy-hidden overflow-wrap-word vads-u-margin-y--0 vads-u-font-weight--bold" data-dd-action-name="Non-VA facility name">Provider Three</h6>
<div>
  </div>
<div class="dd-privacy-hidden overflow-wrap-word" data-dd-action-name="Non-VA facility treated issues">Hypertension and Right Knee Injury</div>
<div>
  </div>
<div class="dd-privacy-hidden vads-u-margin-bottom--1p5" data-dd-action-name="Non-VA facility treatment date range">Mar 13, 2018 – May 26, 2020</div>
</div>
</li>
</ul>
<h5 class="upload-title vads-u-font-weight--bold">You uploaded these documents:</h5>
<ul class="evidence-summary remove-bullets" role="list">
  <li class="vads-u-padding-x--0 vads-u-border-top--1px vads-u-border-color--gray-light vads-u-padding-y--2">
  <h6 class="upload-file dd-privacy-hidden overflow-wrap-word vads-u-margin-y--0 vads-u-font-weight--bold" data-dd-action-name="Uploaded document file name">private-medical-records.pdf</h6>
<div>Medical Treatment Record - Non-Government Facility</div>
</li>
<li class="vads-u-padding-x--0 vads-u-border-top--1px vads-u-border-color--gray-light vads-u-padding-y--2">
  <h6 class="upload-file dd-privacy-hidden overflow-wrap-word vads-u-margin-y--0 vads-u-font-weight--bold" data-dd-action-name="Uploaded document file name">x-rays.pdf</h6>
<div>Other Correspondence</div>
</li>
</ul>
</div> */
