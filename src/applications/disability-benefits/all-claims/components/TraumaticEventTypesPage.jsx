import {
  VaAlert,
  VaCheckboxGroup,
  VaModal,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import React, { useRef, useEffect, useState } from 'react';

import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';
import { scrollAndFocus } from 'platform/utilities/scroll';
import cloneDeep from 'platform/utilities/data/cloneDeep';
import PropTypes from 'prop-types';
import {
  form0781HeadingTag,
  mentalHealthSupportAlert,
  titleWithTag,
  traumaticEventsExamples,
} from '../content/form0781';
import {
  deletedEvidenceAlertConfirmationContent,
  deleteMSTEvidenceModalContent,
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
    const deepClone = cloneDeep(data);

    if (deepClone.optionIndicator) {
      deepClone.optionIndicator = undefined;
    }

    deepClone.events?.forEach(event => {
      Object.assign(event.militaryReports, {
        // TODO: ideally we should use the MILITARY_REPORT_TYPES constant here
        restricted: false,
        unrestricted: false,
        pre2005: false,
      });
    });

    setFormData(deepClone);
  };

  // If the user is opts to deselect MST and they are asked in the modal to delete their MST data,
  // they can close the modal or click the Cancel button. Doing so should revert the MST checkbox back to checked
  const revertMSTEventTypeDeselection = () => {
    const deepClone = cloneDeep(data);

    const traumaticEventsSelections = deepClone.eventTypes;
    // Re-selct MST box
    traumaticEventsSelections.mst = true;
    deepClone.eventTypes = traumaticEventsSelections;

    setFormData(deepClone);
  };

  const shouldShowDeleteMSTEvidenceModal = () => {
    return (
      data.eventTypes?.mst === false &&
      (data.optionIndicator || claimedIncidentReportsForEvents())
    );
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
      revertMSTEventTypeDeselection();
      setShowDeleteMSTEvidenceModal(false);
    },
    onConfirmDeleteMSTEvidence: () => {
      deleteMSTEvidence();
      setShowDeleteMSTEvidenceModal(false);
      setShowDeletedEvidenceConfirmation(true);
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
        updatePage(event);
      }
    },
  };

  return (
    <div className="vads-u-margin-y--2">
      <div className="vads-u-margin-bottom--1">
        <VaAlert
          ref={deletedEvidenceConfirmationRef}
          closeBtnAriaLabel="Deleted MST evidence confirmation"
          closeable
          onCloseEvent={handlers.onCloseDeletedEvidenceAlert}
          fullWidth="false"
          slim
          status="warning"
          visible={showDeletedEvidenceConfirmation}
          uswds
          tabIndex="-1"
        >
          {deletedEvidenceAlertConfirmationContent}

          {!onReviewPage && (
            <p>
              <va-link
                text="Continue with your claim"
                onClick={() => goForward(data)}
              />
            </p>
          )}
        </VaAlert>
      </div>

      {titleWithTag(eventTypesPageTitle, form0781HeadingTag)}

      <p>{eventTypesDescription}</p>

      <VaModal
        visible={showDeleteMSTEvidenceModal}
        onPrimaryButtonClick={handlers.onConfirmDeleteMSTEvidence}
        onSecondaryButtonClick={handlers.onCancelDeleteBehavioralAnswers}
        onCloseEvent={handlers.onCancelDeleteBehavioralAnswers}
        primaryButtonText="Yes, remove this type of trauma"
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
          {deleteMSTEvidenceModalContent}
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
        {/* Mental Health dropdown and Event Types accordion is not displayed when content is rendered on the Review and Submit page */}
        {!onReviewPage && (
          <>
            {traumaticEventsExamples}
            {mentalHealthSupportAlert()}
          </>
        )}
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
