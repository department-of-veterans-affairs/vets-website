import React, { useEffect, useState, useRef } from 'react';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import { focusElement, scrollTo } from 'platform/utilities/ui';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import { Element } from 'platform/utilities/scroll';

import {
  getVAEvidence,
  getPrivateEvidence,
  getOtherEvidence,
} from '../utils/evidence';

import { content } from '../content/evidenceSummary';

import {
  VaContent,
  PrivateContent,
  UploadContent,
} from './EvidenceSummaryLists';

import { EVIDENCE_LIMIT, LIMITATION_KEY, SC_NEW_FORM_DATA } from '../constants';
import { customPageProps995 } from '../../shared/props';
import { focusFirstError } from '../../shared/utils/focus';

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
  const [showModal, setShowModal] = useState(false);
  const [removeData, setRemoveData] = useState({});
  const [hasErrors, setHasErrors] = useState(false);
  const containerRef = useRef(null);

  const { limitedConsent = '', privacyAgreementAccepted } = data;
  const showScNewForm = data[SC_NEW_FORM_DATA];
  const vaEvidence = getVAEvidence(data);
  const privateEvidence = getPrivateEvidence(data);
  const otherEvidence = getOtherEvidence(data);
  const showLimitedConsentYN = showScNewForm && data[EVIDENCE_LIMIT];

  const evidenceLength =
    vaEvidence.length + privateEvidence.length + otherEvidence.length;

  useEffect(
    () => {
      setHasErrors(
        containerRef?.current.querySelectorAll('.usa-input-error-message')
          .length > 0,
      );
    },
    [containerRef, evidenceLength],
  );

  useEffect(
    () => {
      if (evidenceLength === 0) {
        focusElement('#no-evidence');
        scrollTo('evidenceSummaryScrollElement');
      }
    },
    [evidenceLength],
  );

  const callbacks = {
    va: () => {
      vaEvidence.splice(removeData.index, 1);
      setFormData({ ...data, locations: vaEvidence });
    },
    private: () => {
      privateEvidence.splice(removeData.index, 1);
      setFormData({ ...data, providerFacility: privateEvidence });
    },
    limitation: () => {
      setFormData({ ...data, limitedConsent: '' });
    },
    upload: () => {
      otherEvidence.splice(removeData.index, 1);
      setFormData({ ...data, additionalDocuments: otherEvidence });
    },
  };

  const getName = (type, index) => {
    const sections = {
      va: vaEvidence[index]?.locationAndName,
      private: privateEvidence[index]?.providerFacilityName,
      upload: otherEvidence[index]?.name,
    };
    return sections[type];
  };

  const handlers = {
    showModal: event => {
      const { target } = event;
      const { type, index } = target.dataset;
      const isLimitation = type === LIMITATION_KEY;
      setRemoveData({
        type,
        index: isLimitation ? null : parseInt(index, 10),
        name: isLimitation ? null : getName(type, index),
      });
      setShowModal(true);
    },
    closeModal: () => {
      const { type, index } = removeData;
      const focusTarget =
        type === LIMITATION_KEY
          ? $(`.remove-item[data-type="${LIMITATION_KEY}"]`)
          : $(`.remove-item[data-type="${type}"][data-index="${index}"]`);
      setShowModal(false);
      scrollTo(focusTarget);
      focusElement('button', {}, focusTarget?.shadowRoot);
      setRemoveData({});
    },
    removeEvidence: () => {
      setShowModal(false);
      callbacks[removeData.type]();
      focusElement('.vads-c-action-link--green');
      setRemoveData({});
    },

    onGoForward: () => {
      if (hasErrors) {
        focusFirstError();
      } else {
        goForward(data);
      }
    },
    onUpdate: () => {
      if (hasErrors) {
        focusFirstError();
      } else {
        updatePage();
      }
    },
  };
  const visibleError = evidenceLength === 0;
  const H = onReviewPage ? 'h5' : 'h3';
  const Header = onReviewPage ? 'h4' : 'h3';

  const modalTitle =
    content.removeEvidence[
      removeData.type === LIMITATION_KEY ? 'limitationTitle' : 'title'
    ];

  let modalPrimaryButtonText = content.removeEvidence.modalRemove;

  if (removeData.type === 'limitation') {
    modalPrimaryButtonText = content.removeEvidence.modalRemoveLimitation;
  } else if (removeData.type === 'upload') {
    modalPrimaryButtonText = content.removeEvidence.modalDelete;
  }

  const props = {
    handlers,
    isOnReviewPage: onReviewPage,
    showScNewForm,
    testing: contentBeforeButtons === 'testing',
  };

  return (
    <div
      ref={containerRef}
      className={onReviewPage ? 'form-review-panel-page' : ''}
    >
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

        <VaModal
          status="warning"
          visible={showModal}
          modalTitle={modalTitle}
          onCloseEvent={handlers.closeModal}
          onPrimaryButtonClick={handlers.removeEvidence}
          onSecondaryButtonClick={handlers.closeModal}
          primaryButtonText={modalPrimaryButtonText}
          secondaryButtonText={
            content.removeEvidence[
              removeData.type === 'limitation'
                ? 'modalNotRemoveLimitation'
                : 'modalNotRemove'
            ]
          }
        >
          <p>
            {content.removeEvidence[(removeData?.type)] || ''}
            {removeData?.name ? <strong>{` ${removeData.name}`}</strong> : null}
          </p>
        </VaModal>
        <VaContent list={vaEvidence} {...props} />
        <PrivateContent
          list={privateEvidence}
          showLimitedConsentYN={showLimitedConsentYN}
          limitedConsent={limitedConsent}
          privacyAgreementAccepted={privacyAgreementAccepted}
          {...props}
        />
        <UploadContent list={otherEvidence} {...props} />

        {content.addMoreLink()}

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

EvidenceSummary.propTypes = customPageProps995;

export default EvidenceSummary;
