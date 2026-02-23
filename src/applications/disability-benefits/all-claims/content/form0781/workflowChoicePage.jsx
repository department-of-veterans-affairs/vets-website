import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import {
  VaRadio,
  VaModal,
  VaAlert,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { scrollToFirstError, scrollTo } from 'platform/utilities/scroll';
import {
  form0781HeadingTag,
  mentalHealthSupportAlert,
  titleWithTag,
} from '../form0781';
import { checkValidations } from '../../utils/submit';

import { form0781WorkflowChoices } from './workflowChoices';

export const workflowChoicePageTitle =
  'Optional statement if your claim includes mental health conditions';

export const form0781WorkflowChoiceDescription =
  'Do you want to add a statement to support mental health conditions related to traumatic events?';

export const form0781WorkflowChoiceLabels = Object.freeze({
  [form0781WorkflowChoices.COMPLETE_ONLINE_FORM]:
    'Yes, and I want to answer the questions online.',
  [form0781WorkflowChoices.SUBMIT_PAPER_FORM]:
    'Yes, and I want to fill out a PDF to upload.',
  [form0781WorkflowChoices.OPT_OUT_OF_FORM0781]:
    'No, I don’t want to add this statement to my claim.',
});

export const workflowChoicePageDescription = () => {
  return (
    <>
      <p>
        We encourage you to submit this optional statement if both of these
        descriptions are true for you:
      </p>
      <ul>
        <li>
          Your claim includes one or more mental health conditions,{' '}
          <strong>and</strong>
        </li>
        <li>
          The mental health conditions relate to a traumatic event that happened
          during your military service
        </li>
      </ul>
      <p>We’ll use the information you provide to support your claim.</p>
      <p>
        If these descriptions don’t apply to you, you can skip adding this
        statement.
      </p>
      <p>
        <strong>Here’s what to know before you decide:</strong>
      </p>
      <ul>
        <li>
          You can submit this statement in 1 of 2 ways: Answer questions online
          or upload a PDF version of the questions.
        </li>
        <li>
          We’ll ask you to describe the traumatic events you experienced and how
          they relate to your mental health conditions. You’ll likely need about
          45 minutes to answer all the questions.
        </li>
        <li>
          You can skip questions you can’t or don’t want to answer. And you can
          save your in-progress online form anytime if you need a break.
        </li>
        <li>
          We’ll ask you to share supporting evidence (like health records) later
          in the form.
        </li>
      </ul>
    </>
  );
};

export const serviceRecordNotification = (
  <div className="usa-alert usa-alert-warning background-color-only">
    <span>
      <strong>Note:</strong> If you would rather upload a DD214 than enter dates
      here, you can do that later in the form.
    </span>
  </div>
);
export const traumaticEventsExamples = (
  <va-accordion open-single>
    <va-accordion-item class="vads-u-margin-y--3" id="first" bordered>
      <h3 slot="headline">
        Examples of mental health conditions and traumatic events
      </h3>
      <h4 className="vads-u-margin-top--0">
        Examples of mental health conditions
      </h4>
      <p>
        Some examples of diagnosed mental health conditions include, but are not
        limited to:
      </p>
      <ul>
        <li>Post traumatic stress disorder (PTSD)</li>
        <li>Depression</li>
        <li>Anxiety</li>
        <li>Bipolar disorder</li>
      </ul>
      <h4 className="vads-u-margin-top--0">
        Examples of traumatic events related to combat
      </h4>
      <ul>
        <li>You were engaged in combat with enemy forces</li>
        <li>You experienced fear of hostile military or terrorist activity</li>
        <li>You served in an imminent danger area</li>
        <li>You served as a drone aircraft crew member</li>
      </ul>
      <h4 className="vads-u-margin-top--0">
        Examples of traumatic events related to sexual assault or harassment
      </h4>
      <ul>
        <li>
          You experienced pressure to engage in sexual activities (for example,
          someone threatened you with bad treatment for refusing sex, or
          promised you better treatment in exchange for sex)
        </li>
        <li>
          You were pressured into sexual activities against your will (for
          example, when you were asleep or intoxicated)
        </li>
        <li>You were physically forced into sexual activities</li>
        <li>
          You experienced offensive comments about your body or sexual
          activities
        </li>
        <li>You experienced repeated unwanted sexual advances</li>
        <li>
          You experienced someone touching or grabbing you against your will,
          including during hazing
        </li>
      </ul>
      <h4 className="vads-u-margin-top--0">
        Examples of traumatic events related to other personal interactions
      </h4>
      <ul>
        <li>
          You experienced physical assault, battery, robbery, mugging, stalking,
          or harassment by a person who wasn’t part of an enemy force
        </li>
        <li>You experienced domestic intimate partner abuse or harassment</li>
      </ul>
      <h4 className="vads-u-margin-top--0">
        Examples of other traumatic events
      </h4>
      <ul>
        <li>You got into a car accident</li>
        <li>You witnessed a natural disaster, like a hurricane</li>
        <li>You worked on burn ward or graves registration</li>
        <li>
          You witnessed the death, injury, or threat to another person or to
          yourself, that was caused by something other than a hostile military
          or terrorist activity
        </li>
        <li>
          You experienced or witnessed friendly fire that occurred on a gunnery
          range during a training mission
        </li>
      </ul>
    </va-accordion-item>
  </va-accordion>
);

export const sectionsOfMentalHealthStatement = [
  'Traumatic events from your military service',
  'Behavioral changes',
  'Types of providers who treated  your traumatic events',
  'Types of documents about your mental health conditions',
];

export const mentalHealthKeys = [
  'treatmentReceivedVaProvider',
  'treatmentReceivedNonVaProvider',
  'treatmentNoneCheckbox',
  'supportingEvidenceWitness',
  'supportingEvidenceUnlisted',
  'supportingEvidenceReports',
  'supportingEvidenceRecords',
  'supportingEvidenceOther',
  'supportingEvidenceNoneCheckbox',
  'behaviorsDetails',
  'workBehaviors',
  'healthBehaviors',
  'otherBehaviors',
  'eventTypes',
  'unlistedBehaviors',
  'form781Upload',
  'additionalInformation',
  'events',
];

const confirmationDataUpload = {
  yes: 'Yes, upload PDF instead',
  no: 'No, return to claim',
};

const confirmationDataOptOut = {
  yes: 'Yes, delete my statement',
  no: 'No, return to claim',
};

const confirmationCompleteOnline = {
  yes: 'Yes, answer online instead',
  no: 'No, return to claim',
};

const modalDescriptionUpload = (
  <>
    <p>
      If you choose to upload a PDF statement, we’ll delete this information
      from your claim:
    </p>
    <p>
      <ul>
        {sectionsOfMentalHealthStatement.map((section, i) => (
          <li key={i}>{section}</li>
        ))}
      </ul>
    </p>
  </>
);

const modalDescriptionSkip = (
  <>
    <p>
      If you choose to delete this statement, we’ll delete this information from
      your claim:
    </p>
    <ul>
      {sectionsOfMentalHealthStatement.map((section, i) => (
        <li key={i}>
          <b>{section}</b>
        </li>
      ))}
    </ul>
  </>
);

const modalDescriptionOnline = formData => {
  return (
    <>
      <p>
        If you choose to answer questions online, we’ll delete this PDF you
        uploaded:
      </p>
      <p>
        <ul>
          {formData.form781Upload.map((file, index) => (
            <li key={index}>
              <strong>{file.name}</strong>
            </li>
          ))}
        </ul>
      </p>
    </>
  );
};

const alertDescriptionSkip =
  'We deleted your statement about mental health conditions. You can still add a statement anytime before you submit your claim by choosing to answer questions online or uploading a PDF statement.';

const alertDescriptionUpload =
  'We’ve deleted information you entered online about mental health conditions.';
const alertDescriptionOnline = 'We’ve deleted your uploaded PDF.';

export const modalTitleSkip =
  'Delete your statement about mental health conditions?';
export const modalTitleUpload = 'Upload a PDF statement instead?';
export const modalTitleOnline = 'Answer questions online instead?';

const deleteMentalHealthStatement = (data, setFormData) => {
  const updatedData = { ...data };

  mentalHealthKeys.forEach(key => {
    delete updatedData[key];
  });

  setFormData(updatedData);
};

const deepCheck = value => {
  switch (typeof value) {
    case 'boolean':
      return value === true;
    case 'string':
      return value.trim() !== '';
    case 'number':
      return true;
    case 'object':
      if (value === null) return false;

      return Object.values(value).some(nestedValue => deepCheck(nestedValue));

    default:
      return false;
  }
};

const checkMentalHealthData = formData => {
  return mentalHealthKeys.some(key => {
    if (!(key in formData)) {
      return false;
    }

    return deepCheck(formData[key]);
  });
};

const WorkflowChoicePage = props => {
  const {
    data,
    goBack,
    goForward,
    setFormData,
    contentBeforeButtons,
    contentAfterButtons,
    onReviewPage,
    updatePage,
  } = props;

  const selectionField = 'view:selectedMentalHealthWorkflowChoice';
  const [previousWorkflowChoice, setPreviousWorkflowChoice] = useState(
    data?.['view:previousMentalHealthWorkflowChoice'] ?? null,
  );
  const [
    selectedMentalHealthWorkflowChoice,
    setSelectedMentalHealthWorkflowChoice,
  ] = useState(data?.mentalHealthWorkflowChoice ?? null);

  const [hasError, setHasError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [shouldGoForward, setShouldGoForward] = useState(false);

  useEffect(
    () => {
      if (showAlert) {
        scrollTo('success-alert');
      }
    },
    [showAlert],
  );

  useEffect(
    () => {
      if (
        shouldGoForward &&
        data?.mentalHealthWorkflowChoice === selectedMentalHealthWorkflowChoice
      ) {
        setShouldGoForward(false);
        goForward(data);
      }
    },
    [data, goForward, selectedMentalHealthWorkflowChoice, shouldGoForward],
  );

  const missingSelectionErrorMessage =
    'A response is needed for this question.';

  const missingSelection = (error, _fieldData, formData) => {
    if (!formData?.[selectionField]) {
      error.addError?.(missingSelectionErrorMessage);
    }
  };

  const checkErrors = (formData = data) => {
    const error = checkValidations(
      [missingSelection],
      data?.['view:selectedMentalHealthWorkflowChoice'],
      formData,
    );

    const result = error?.[0] || null;
    setHasError(result);

    return result;
  };

  const selectedChoice = selectedMentalHealthWorkflowChoice ?? null;

  const {
    primaryText,
    secondaryText,
    modalContent,
    alertContent,
    modalTitle,
  } = (() => {
    switch (selectedChoice) {
      case form0781WorkflowChoices.SUBMIT_PAPER_FORM:
        return {
          primaryText: confirmationDataUpload.yes,
          secondaryText: confirmationDataUpload.no,
          modalContent: modalDescriptionUpload,
          alertContent: alertDescriptionUpload,
          modalTitle: modalTitleUpload,
        };
      case form0781WorkflowChoices.OPT_OUT_OF_FORM0781:
        return {
          primaryText: confirmationDataOptOut.yes,
          secondaryText: confirmationDataOptOut.no,
          modalContent: modalDescriptionSkip,
          alertContent: alertDescriptionSkip,
          modalTitle: modalTitleSkip,
        };
      default:
        return {
          primaryText: confirmationCompleteOnline.yes,
          secondaryText: confirmationCompleteOnline.no,
          modalContent: data.form781Upload && modalDescriptionOnline(data),
          alertContent: alertDescriptionOnline,
          modalTitle: modalTitleOnline,
        };
    }
  })();

  const setPreviousData = () => {
    const formData = {
      ...data,
      'view:previousMentalHealthWorkflowChoice': selectedMentalHealthWorkflowChoice,
      mentalHealthWorkflowChoice: selectedMentalHealthWorkflowChoice,
    };
    setPreviousWorkflowChoice(selectedMentalHealthWorkflowChoice);
    setFormData(formData);
    setShouldGoForward(true);
  };

  const handlers = {
    onSelection: event => {
      const { value } = event?.detail || {};
      if (value) {
        setSelectedMentalHealthWorkflowChoice(value);
        setFormData({
          ...data,
          'view:selectedMentalHealthWorkflowChoice': value,
        });
      }
    },
    onSubmit: event => {
      event.preventDefault();
      if (checkErrors()) {
        scrollToFirstError({ focusOnAlertRole: true });
      } else if (
        previousWorkflowChoice !== selectedMentalHealthWorkflowChoice &&
        checkMentalHealthData(data)
      ) {
        setShowModal(true);
      } else {
        setShowAlert(false);
        setPreviousData();
      }
    },
    onUpdatePage: event => {
      event.preventDefault();
      if (checkErrors()) {
        scrollToFirstError({ focusOnAlertRole: true });
      } else if (
        previousWorkflowChoice !== selectedMentalHealthWorkflowChoice &&
        checkMentalHealthData(data)
      ) {
        setShowModal(true);
      } else {
        setShowAlert(false);
        const formData = {
          ...data,
          'view:previousMentalHealthWorkflowChoice': selectedMentalHealthWorkflowChoice,
          mentalHealthWorkflowChoice: selectedMentalHealthWorkflowChoice,
        };
        setPreviousWorkflowChoice(selectedMentalHealthWorkflowChoice);
        setFormData(formData);
        setTimeout(() => {
          updatePage(event);
        }, 100);
      }
    },
    onCloseModal: () => {
      setShowModal(false);
    },
    onGoForward: () => {
      deleteMentalHealthStatement(data, setFormData);
      setShowModal(false);
      setShowAlert(true);
    },
    onGoBack: () => {
      goBack(data);
    },
    onCloseAlert: () => {
      setShowAlert(false);
    },
  };

  return (
    <form onSubmit={handlers.onSubmit}>
      <VaAlert
        id="success-alert"
        status="success"
        closeable
        visible={showAlert}
        onCloseEvent={handlers.onCloseAlert}
        class="vads-u-margin-bottom--4"
        uswds
      >
        {alertContent}
        <p>
          {!onReviewPage ? (
            <va-link
              text="Continue with your claim"
              onClick={handlers.onSubmit}
            />
          ) : null}
        </p>
      </VaAlert>
      <fieldset className="vads-u-margin-bottom--2">
        <legend id="root__title" className="schemaform-block-title">
          {titleWithTag(workflowChoicePageTitle, form0781HeadingTag)}
        </legend>
        <div>
          {workflowChoicePageDescription()}
          <div>
            <VaRadio
              label={form0781WorkflowChoiceDescription}
              label-header-level="4"
              required
              uswds="true"
              class="rjsf-web-component-field hydrated"
              aria-invalid="false"
              onVaValueChange={handlers.onSelection}
              error={hasError}
            >
              <va-radio-option
                label={
                  form0781WorkflowChoiceLabels[
                    form0781WorkflowChoices.COMPLETE_ONLINE_FORM
                  ]
                }
                name="private"
                value={form0781WorkflowChoices.COMPLETE_ONLINE_FORM}
                checked={
                  selectedMentalHealthWorkflowChoice ===
                  form0781WorkflowChoices.COMPLETE_ONLINE_FORM
                }
              />
              <va-radio-option
                label={
                  form0781WorkflowChoiceLabels[
                    form0781WorkflowChoices.SUBMIT_PAPER_FORM
                  ]
                }
                name="private"
                value={form0781WorkflowChoices.SUBMIT_PAPER_FORM}
                checked={
                  selectedMentalHealthWorkflowChoice ===
                  form0781WorkflowChoices.SUBMIT_PAPER_FORM
                }
              />
              <va-radio-option
                label={
                  form0781WorkflowChoiceLabels[
                    form0781WorkflowChoices.OPT_OUT_OF_FORM0781
                  ]
                }
                name="private"
                value={form0781WorkflowChoices.OPT_OUT_OF_FORM0781}
                checked={
                  selectedMentalHealthWorkflowChoice ===
                  form0781WorkflowChoices.OPT_OUT_OF_FORM0781
                }
              />
            </VaRadio>
            <div>
              <p>
                <strong>Note:</strong> If you choose to fill out the PDF
                version, you can download the PDF now.
              </p>
              <p>
                <va-link
                  external
                  href="https://www.va.gov/find-forms/about-form-21-0781/"
                  text="Download VA Form 21-0781 to submit your statement"
                />
              </p>
            </div>
          </div>
          {!onReviewPage ? (
            <>
              {traumaticEventsExamples}
              {mentalHealthSupportAlert()}
            </>
          ) : null}
        </div>
        <VaModal
          clickToClose
          status="warning"
          modalTitle={modalTitle}
          primaryButtonText={primaryText}
          secondaryButtonText={secondaryText}
          onPrimaryButtonClick={handlers.onGoForward}
          onSecondaryButtonClick={handlers.onCloseModal}
          onCloseEvent={handlers.onCloseModal}
          visible={showModal}
          uswds
        >
          {modalContent}
        </VaModal>
      </fieldset>
      {onReviewPage ? (
        /**
         * Does not use web component for design consistency on all pages.
         * @see https://github.com/department-of-veterans-affairs/vets-website/pull/35911
         */
        // eslint-disable-next-line @department-of-veterans-affairs/prefer-button-component
        <button
          className="usa-button-primary"
          type="button"
          onClick={event => handlers.onUpdatePage(event)}
        >
          Update page
        </button>
      ) : (
        <>
          {contentBeforeButtons}
          <FormNavButtons
            goBack={handlers.onGoBack}
            goForward={handlers.onSubmit}
            submitToContinue
          />
          {contentAfterButtons}
        </>
      )}
    </form>
  );
};

WorkflowChoicePage.propTypes = {
  contentAfterButtons: PropTypes.element,
  contentBeforeButtons: PropTypes.element,
  data: PropTypes.object,
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  setFormData: PropTypes.func,
  updatePage: PropTypes.bool,
  onReviewPage: PropTypes.func,
};

export default WorkflowChoicePage;
