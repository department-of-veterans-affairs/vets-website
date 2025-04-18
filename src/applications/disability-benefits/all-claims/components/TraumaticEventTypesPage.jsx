import {
  VaAlert,
  // VaAlert,
  VaCheckboxGroup,
  VaModal,
  // VaRadio,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import React, { useRef, useEffect, useState } from 'react';

import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';
import { scrollAndFocus } from 'platform/utilities/ui';
import cloneDeep from 'platform/utilities/data/cloneDeep';
import PropTypes from 'prop-types';
import {
  form0781HeadingTag,
  mentalHealthSupportAlert,
  titleWithTag,
} from '../content/form0781';
import {
  deletedEvidenceAlertConfirmationContent,
  deleteMSTEvidenceModaContent,
  deleteMSTEvidenceModalDescripton,
  deleteMSTEvidenceModalTitle,
  eventTypesDescription,
  eventTypesHint,
  eventTypesPageTitle,
  eventTypesQuestion,
} from '../content/traumaticEventTypes';
import { TRAUMATIC_EVENT_TYPES } from '../constants';

const TraumaticEventTypesPage = ({
  goBack,
  goForward,
  data,
  setFormData,
  contentBeforeButtons,
  contentAfterButtons,
  onReviewPage,
  updatePage,
}) => {
  // No validaiton on this page
  const [showDeleteMSTEvidenceModal, setShowDeleteMSTEvidenceModal] = useState(
    false,
  );
  const [
    showDeletedEvidenceConfirmation,
    setShowDeletedEvidenceConfirmation,
  ] = useState(false);

  const deletedEvidenceConfirmationRef = useRef(null);

  useEffect(
    () => {
      if (
        showDeletedEvidenceConfirmation &&
        deletedEvidenceConfirmationRef.current
      ) {
        deletedEvidenceConfirmationRef.current.focus();
      }
    },
    [showDeletedEvidenceConfirmation],
  );

  const modalRef = useRef(null);
  useEffect(
    () => {
      if (showDeleteMSTEvidenceModal && modalRef.current) {
        const modalHeading = document.querySelector('h4');
        scrollAndFocus(modalHeading);
      }
    },
    [showDeleteMSTEvidenceModal],
  );

  const claimedIncidentReportsForEvents = () => {
    if (data.events) {
      return data.events.some(event => {
        // NOTE: we need to account for undefined values
        // This is the behavior of the Forms Library when the user visits the a page but doesn't make a selection
        return Object.values(event?.militaryReports || {}).some(
          report => report === true,
        );
      });
    }

    return false;
  };

  const deleteMSTEvidence = () => {
    // const deepClone = cloneDeep(data);

    // DELETABLE_MST_EVDIENCE_KEYS.forEach(key => {
    //   deepClone[key] = {};
    // });

    // setFormData(deepClone);
  };

  const shouldShowDeleteMSTEvidenceModal = () => {
    return data.optionIndicator || claimedIncidentReportsForEvents();
  };

  const handlers = {
    onSelectionChange: event => {
      const { target } = event;
      const selection = event.target?.getAttribute('value');

      const formData = {
        ...data,
        eventTypes: {
          ...data.eventTypes,
          [selection]: target.checked,
        },
      };
      setFormData(formData);
    },
    onSubmit: event => {
      event.preventDefault();

      if (shouldShowDeleteMSTEvidenceModal()) {
        setShowDeleteMSTEvidenceModal(true);
      } else {
        goForward(data);
      }
    },
    onCloseModal: () => {
      setShowDeleteMSTEvidenceModal(false);
    },
    onConfirmDeleteMSTEvidence: () => {
      deleteMSTEvidence();
      handlers.onCloseModal();

      if (onReviewPage) {
        updatePage();
      } else {
        setShowDeletedEvidenceConfirmation(true);
      }
    },
    onCancelDeleteBehavioralAnswers: () => {
      handlers.onCloseModal();
    },
    onCloseDeletedEvidenceAlert: () => {
      setShowDeletedEvidenceConfirmation(false);
    },
    onClickConfirmationLink: () => {
      goForward(data);
    },
    onUpdatePage: event => {
      event.preventDefault();

      if (shouldShowDeleteMSTEvidenceModal()) {
        setShowDeleteMSTEvidenceModal(true);
      } else {
        goForward(data);
      }
    },
  };

  return (
    <div className="vads-u-margin-y--2">
      <div className="vads-u-margin-bottom--1">
        <VaAlert
          // ref={deletedEvidenceConfirmationRef}
          closeBtnAriaLabel="Deleted MST evidence confirmation"
          closeable
          onCloseEvent={handlers.onCloseDeletedEvidenceAlert}
          fullWidth="false"
          slim
          status="warning"
          // visible={showDeletedEvidenceConfirmation}
          visible={false}
          uswds
          tabIndex="-1"
        >
          {deletedEvidenceAlertConfirmationContent}
          <p>
            <button
              type="button"
              className="va-button-link"
              onClick={() => goForward(data)}
            >
              Continue with your claim
            </button>{' '}
          </p>
        </VaAlert>
      </div>

      {titleWithTag(eventTypesPageTitle, form0781HeadingTag)}

      <p>{eventTypesDescription}</p>

      <VaModal
        visible={showDeleteMSTEvidenceModal}
        onPrimaryButtonClick={handlers.onConfirmDeleteMSTEvidence}
        onSecondaryButtonClick={handlers.onCancelDeleteBehavioralAnswers}
        onCloseEvent={handlers.onCancelDeleteBehavioralAnswers}
        primaryButtonText="Yes, remove this type trauma"
        secondaryButtonText="No, return to claim"
        status="warning"
      >
        <>
          <h4
            ref={modalRef}
            className="vads-u-font-size--h4 vads-u-color--base vads-u-margin--0"
          >
            {deleteMSTEvidenceModalTitle}
          </h4>
          <p>{deleteMSTEvidenceModalDescripton}</p>
          {deleteMSTEvidenceModaContent}
        </>
      </VaModal>

      <form onSubmit={handlers.onSubmit}>
        <VaCheckboxGroup
          label={eventTypesQuestion}
          label-header-level={4}
          hint={eventTypesHint}
          onVaChange={handlers.onSelectionChange}
          uswds
        >
          {Object.entries(TRAUMATIC_EVENT_TYPES).map(
            ([eventType, description]) => (
              <va-checkbox
                key={eventType}
                label={description}
                value={eventType}
                checked={data?.eventTypes?.[eventType] === true}
                uswds
              />
            ),
          )}
        </VaCheckboxGroup>
        {/* Mental Health dropdown is not displayed when content is rendered on the Review and Submit page */}
        <>{!onReviewPage && mentalHealthSupportAlert()}</>
        {onReviewPage && (
          <va-button
            onClick={handlers.onUpdatePage}
            label="Update behavior questions choice"
            text="Update page"
          />
        )}

        {!onReviewPage && (
          <>
            {contentBeforeButtons}
            <FormNavButtons
              goBack={goBack}
              goForward={handlers.onSubmit}
              submitToContinue
            />
            {contentAfterButtons}
          </>
        )}
      </form>
    </div>
  );
};

TraumaticEventTypesPage.propTypes = {
  contentAfterButtons: PropTypes.element,
  contentBeforeButtons: PropTypes.element,
  data: PropTypes.object,
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  goToPath: PropTypes.func,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
  onReviewPage: PropTypes.bool,
};

export default TraumaticEventTypesPage;
