import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import { form0781HeadingTag, titleWithTag } from '../content/form0781';
import { VaRadio, VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  form0781WorkflowChoiceDescription,
  form0781WorkflowChoiceLabels,
  form0781WorkflowChoices,
  traumaticEventsExamples,
  workflowChoicePageDescription,
  workflowChoicePageTitle,
  mstAlert,
} from '../content/form0781/workflowChoicePage';

import { checkValidations } from '../utils/submit';

export const mentalHealthKeys = [
	"treatmentReceivedVaProvider",
	"treatmentReceivedNonVaProvider",
	"treatmentNoneCheckbox",
	"supportingEvidenceWitness",
	"supportingEvidenceUnlisted",
	"supportingEvidenceReports",
	"supportingEvidenceRecords",
	"supportingEvidenceOther",
	"supportingEvidenceNoneCheckbox"
];

const confirmationDataUpload = {
	yes: 'Change my response',
	no: 'No, return to claim',
}

const confirmationDataOptOut = {
	yes: 'Yes, skip VA Form 21-0781',
	no: 'No, return to claim',
}

const modalDescriptionUpload = (
	<>
		<p>
			<strong>What to know:</strong> If you change your
			response to filling out a PDF to upload, we’ll
			remove any information you’ve entered online
			about your mental health conditions.
		</p>
		<p>Do you want to opt out of form 21-0781?</p>
	</>
);

const modalDescriptionSkip = (
	<>
		<p>
			<strong>What to know:</strong> If you skip VA Form 21-0781,
			you won’t be able to share any information about any mental
			health conditions. You won’t be able to share descriptions
			about any related traumatic events and resulting behavioral
			changes, or any details about supporting documents related
			to mental health.
		</p>
		<p><strong>Do you want to change your response to upload a PDF?</strong></p>
	</>
);

const alertDescriptionSkip = 'We’ve removed information you’ve entered online about traumatic events';
const alertDescriptionUpload = 'We’ve removed information about your traumatic events';

const modalTitleSkip = 'Skip VA Form 21-0781?';
const modalTitleUpload = 'Change to upload a PDF?';
const modalTitleOnline = 'Change to answer questions online?';


const deleteMentalHealthStatement = (data, setFormData) => {
  const updatedData = { ...data };

  mentalHealthKeys.forEach((key) => {
    if (key in updatedData) {
      const value = updatedData[key];

      if (typeof value === "string") {
        updatedData[key] = "";
      } else if (typeof value === "boolean") {
        updatedData[key] = false;
      } else if (typeof value === "number") {
        updatedData[key] = 0;
      } else if (typeof value === "object" && value !== null) {
        updatedData[key] = clearMentalHealthData(value);
      }
    }
  });
	setFormData({
		...updatedData,
		showDestructiveActionAlert: true
	});
}

const clearMentalHealthData = (obj) => {
  const newObj = {};
  for (const key in obj) {
    if (typeof obj[key] === "string") {
      newObj[key] = "";
    } else if (typeof obj[key] === "boolean") {
      newObj[key] = false;
    } else if (typeof obj[key] === "number") {
      newObj[key] = 0;
    } else if (typeof obj[key] === "object" && obj[key] !== null) {
      newObj[key] = clearMentalHealthData(obj[key]);
    }
  }
  return newObj;
}

const deepCheck = (value) => {
  switch (typeof value) {
    case 'boolean':
      return value === true;
    case 'string':
      return value.trim() !== '';
    case 'number':
      return true;
    case 'object':
      if (value === null) return false;
      for (const nestedKey in value) {
        if (deepCheck(value[nestedKey])) {
          return true;
        }
      }
      return false;
    default:
      return false;
  }
};


const checkMentalHealthData = (formData) => {
  for (const key of mentalHealthKeys) {
    if (!(key in formData)) continue;
    const value = formData[key];
    if (deepCheck(value)) {
      return true;
    }
  }

  return false;
}


const ChoiceDestructiveModal = props => {
	const {
    data,
    goBack,
    goForward,
    setFormData,
  } = props;

	const selectionField = 'view:mentalHealthWorkflowChoice';
	const previousWorkflowChoice = useRef(data?.['view:mentalHealthWorkflowChoice'] ?? null);

  const [hasError, setHasError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const missingSelection = (error, _fieldData, formData) => {
    if (!formData?.[selectionField]) {
      error.addError?.(missingSelectionErrorMessage);
    }
  };

  const checkErrors = (formData = data) => {
    const error = checkValidations([missingSelection], data?.['view:mentalHealthWorkflowChoice'], formData);
    const result = error?.[0] || null;

    setHasError(result);
    return result;
  };

	const selectedChoice = data?.['view:mentalHealthWorkflowChoice'];

	const { primaryText, secondaryText, modalContent, alertContent, modalTitle } = (() => {
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
					primaryText: 'Yes',
					secondaryText: 'No',
					modalContent: null,
					alertContent: alertDescriptionUpload,
					modalTitle: 'random',
				};
		}
	})();


	console.log('do we have data --------------------------', JSON.stringify(data))

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
      } else if (previousWorkflowChoice.current !== data?.['view:mentalHealthWorkflowChoice'] 
					&& data?.['view:mentalHealthWorkflowChoice'] === form0781WorkflowChoices.SUBMIT_PAPER_FORM
					&& checkMentalHealthData(data)) {
				console.log('show paper form modal data')
        setShowModal(true);
      } else if (previousWorkflowChoice.current !== data?.['view:mentalHealthWorkflowChoice']
					&& data?.['view:mentalHealthWorkflowChoice'] === form0781WorkflowChoices.OPT_OUT_OF_FORM0781
					&& checkMentalHealthData(data)) {
				// code updated needed to checkMentalHealthData and if a pdf is uploaded
        console.log('show opt out of modal data');
				setShowModal(true);
      } else {
        goForward(data);
      }
    },
    onCloseModal: () => {
      setShowModal(false);
    },
    onGoForward: () => {
			deleteMentalHealthStatement(data, setFormData);
			setShowModal(false);
      if (hasError) return;
    },
		onGoBack: () => {
			setShowModal(false);
		}
  };

	return (
		<form className="rjsf">
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
							>
								<va-radio-option
									label={form0781WorkflowChoiceLabels[form0781WorkflowChoices.COMPLETE_ONLINE_FORM]}
									name="private"
									value={form0781WorkflowChoices.COMPLETE_ONLINE_FORM}
									checked={data['view:mentalHealthWorkflowChoice'] === form0781WorkflowChoices.COMPLETE_ONLINE_FORM}
								/>
								<va-radio-option
									label={form0781WorkflowChoiceLabels[form0781WorkflowChoices.SUBMIT_PAPER_FORM]}
									name="private"
									value={form0781WorkflowChoices.SUBMIT_PAPER_FORM}
									checked={data['view:mentalHealthWorkflowChoice'] === form0781WorkflowChoices.SUBMIT_PAPER_FORM}
								/>
								<va-radio-option
									label={form0781WorkflowChoiceLabels[form0781WorkflowChoices.OPT_OUT_OF_FORM0781]}
									name="private"
									value={form0781WorkflowChoices.OPT_OUT_OF_FORM0781}
									checked={data['view:mentalHealthWorkflowChoice'] === form0781WorkflowChoices.OPT_OUT_OF_FORM0781}
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
						onSecondaryButtonClick={handlers.onGoBack}
						onCloseEvent={handlers.onGoBack}
						visible={showModal}
						uswds
					>
						{modalContent}
					</VaModal>

			</fieldset>
			<FormNavButtons goBack={goBack} goForward={handlers.onSubmit} />
		</form>
	);
};

ChoiceDestructiveModal.propTypes = {
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

export default ChoiceDestructiveModal;
