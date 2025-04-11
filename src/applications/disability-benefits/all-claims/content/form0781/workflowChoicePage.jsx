import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import {
  VaRadio,
  VaModal,
  VaAlert,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { scrollToFirstError, scrollTo } from 'platform/utilities/ui';
import { form0781HeadingTag, titleWithTag } from '../form0781';
import { checkValidations } from '../../utils/submit';

export const workflowChoicePageTitle =
  'Option to add a statement in support of mental health conditions';

// Lists new conditions the veteran has claimed
// The user should not get to this page if these conditions are not present
const conditionSelections = formData => {
  const conditions = Array.isArray(formData?.newDisabilities)
    ? formData.newDisabilities.map(
        disability =>
          disability.condition.charAt(0).toUpperCase() +
          disability.condition.slice(1),
      )
    : [];

  if (conditions.length === 0) return null;

  return (
    <div>
      <p>Your claim includes these new conditions:</p>
      <ul>
        {conditions.map((condition, index) => (
          <li key={index}>
            <strong>{condition}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const workflowChoicePageDescription = formData => {
  return (
    <>
      {conditionSelections(formData)}
      <h4>When to consider adding this statement to your claim</h4>
      <p>
        If you added a new mental health condition that’s related to your
        military service, we encourage you to submit a statement. Mental health
        conditions include conditions like PTSD or depression.
      </p>
      <p>
        <strong>What to expect if you add a statement</strong>
        <br />
        We’ll ask you questions about:
      </p>
      <ul>
        <li>
          <strong>Traumatic events from your military service</strong>
        </li>
        <li>
          <strong>Behavioral changes you experienced as a result</strong>
        </li>
      </ul>

      <p>
        You will also be able to add{' '}
        <strong>medical records, provider information,</strong> and{' '}
        <strong> supporting documents </strong> later in the{' '}
        <strong>Supporting Evidence </strong> section.
      </p>
      <p>
        Answer as many or as few questions you feel comfortable answering. We’ll
        use any information you share to support your claim.
      </p>
      <p>
        To answer all the questions, you’ll likely need about 45 minutes. You
        can answer the questions online. Or, you can fill out a PDF version of
        the form and upload it as part of your online submission.
      </p>
      <p>
        <va-link
          external
          href="https://www.va.gov/find-forms/about-form-21-0781/"
          text="Get VA Form 21-0781 to download"
        />
      </p>
    </>
  );
};

export const form0781WorkflowChoiceDescription =
  'Do you want to add a statement in support of mental health conditions?';

export const form0781WorkflowChoices = {
  COMPLETE_ONLINE_FORM: 'optForOnlineForm0781',
  SUBMIT_PAPER_FORM: 'optForPaperForm0781Upload',
  OPT_OUT_OF_FORM0781: 'optOutOfForm0781',
};

export const form0781WorkflowChoiceLabels = Object.freeze({
  [form0781WorkflowChoices.COMPLETE_ONLINE_FORM]:
    'Yes, and I want to answer the questions online.',
  [form0781WorkflowChoices.SUBMIT_PAPER_FORM]:
    'Yes, and I want to fill out a PDF to upload.',
  [form0781WorkflowChoices.OPT_OUT_OF_FORM0781]:
    'No, I don’t want to add this form to my claim.',
});

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
        <li>You experienced unwanted sexual advances</li>
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

export const mstAlert = () => {
  return (
    <>
      <va-alert-expandable
        status="info"
        trigger="Learn more about treatment for military sexual trauma"
      >
        <p>
          If you experienced military sexual trauma (MST), we provide treatment
          for any physical or mental health conditions related to your
          experiences.
        </p>
        <br />
        <p>
          You don’t need to file a disability claim or have a disability rating
          to get care. These services are available to Veterans regardless of
          discharge status. You may be able to receive MST-related health care
          even if you’re not eligible for other VA health care.
        </p>
        <br />
        <p>
          <va-link
            external
            href="https://www.va.gov/health-care/health-needs-conditions/military-sexual-trauma/"
            text="Learn more about MST-related benefits and services"
          />
        </p>
      </va-alert-expandable>
    </>
  );
};

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
      <strong>What to know:</strong> If you choose to upload a PDF statement,
      we’ll delete this information from your claim:
    </p>
    <p>
      <ul>
        {sectionsOfMentalHealthStatement.map((section, i) => (
          <li key={i}>
            <b>{section}</b>
          </li>
        ))}
      </ul>
    </p>
  </>
);

const modalDescriptionSkip = (
  <>
    <p>
      <strong>What to know:</strong> If you choose to delete this statement,
      we’ll delete this information from your claim:
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
        <strong>What to know:</strong> If you choose to answer questions online,
        we’ll delete this PDF you uploaded:
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
  } = props;

  const selectionField = 'view:mentalHealthWorkflowChoice';
  const [previousWorkflowChoice, setPreviousWorkflowChoice] = useState(
    data?.['view:previousMentalHealthWorkflowChoice'] ?? null,
  );

  const [hasError, setHasError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (showAlert) {
      scrollTo('success-alert');
    }
  }, [showAlert]);

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
      data?.['view:mentalHealthWorkflowChoice'],
      formData,
    );

    const result = error?.[0] || null;
    setHasError(result);

    return result;
  };

  const selectedChoice = data?.['view:mentalHealthWorkflowChoice'] ?? null;

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
      'view:previousMentalHealthWorkflowChoice':
        data?.['view:mentalHealthWorkflowChoice'],
    };
    setPreviousWorkflowChoice(data?.['view:mentalHealthWorkflowChoice']);
    setFormData(formData);
    goForward(data);
  };

  const handlers = {
    onSelection: event => {
      const { value } = event?.detail || {};
      if (value) {
        const formData = {
          ...data,
          'view:mentalHealthWorkflowChoice': value,
        };
        setFormData(formData);
        checkErrors(formData);
      }
    },
    onSubmit: event => {
      event.preventDefault();
      if (checkErrors()) {
        scrollToFirstError({ focusOnAlertRole: true });
      } else if (
        previousWorkflowChoice !== data?.['view:mentalHealthWorkflowChoice'] &&
        checkMentalHealthData(data)
      ) {
        setShowModal(true);
      } else {
        setShowAlert(false);
        setPreviousData();
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
          <va-link
            text="Continue with your claim"
            onClick={handlers.onSubmit}
          />
        </p>
      </VaAlert>
      <fieldset className="vads-u-margin-bottom--2">
        <legend id="root__title" className="schemaform-block-title">
          <h3 className="vads-u-color--gray-dark vads-u-margin-top--0 vads-u-margin-bottom--3">
            {titleWithTag(workflowChoicePageTitle, form0781HeadingTag)}
          </h3>
        </legend>
        <div>
          {workflowChoicePageDescription(data)}
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
                  data?.['view:mentalHealthWorkflowChoice'] ===
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
                  data?.['view:mentalHealthWorkflowChoice'] ===
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
                  data?.['view:mentalHealthWorkflowChoice'] ===
                  form0781WorkflowChoices.OPT_OUT_OF_FORM0781
                }
              />
            </VaRadio>
          </div>
          {traumaticEventsExamples}
          {mstAlert()}
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
      {contentBeforeButtons}
      <FormNavButtons
        goBack={handlers.onGoBack}
        goForward={handlers.onSubmit}
        submitToContinue
      />
      {contentAfterButtons}
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
};

export default WorkflowChoicePage;
