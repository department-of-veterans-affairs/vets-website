import React, { useState } from 'react';
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

const confirmationLabel = {
	SKIP_FORM0781_LABEL: 'Yes, skip VA Form 21-0781',
	UPLOAD_FORM781_LABEL: 'Change my response',
}

const declineLabel = 'No, return to claim';
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
        updatedData[key] = clearNestedObject(value);
      }
    }
  });
	setFormData({
		...updatedData,
		showDestructiveActionAlert: true
	});
}

const clearNestedObject = (obj) => {
  const newObj = {};
  for (const key in obj) {
    if (typeof obj[key] === "string") {
      newObj[key] = "";
    } else if (typeof obj[key] === "boolean") {
      newObj[key] = false;
    } else if (typeof obj[key] === "number") {
      newObj[key] = 0;
    } else if (typeof obj[key] === "object" && obj[key] !== null) {
      newObj[key] = clearNestedObject(obj[key]);
    }
  }
  return newObj;
}


const ChoiceDestructiveModal = props => {
	const {
    data,
    goBack,
    goForward,
    // goToPath,
    // updatePage,
    setFormData,
    // onReviewPage,
    // contentBeforeButtons,
    // contentAfterButtons,
  } = props;

	 /**
   * declare default state variables
   *  - error - message to render if user tries to continue with an empty value
   *  - fieldData - data value to use for radio group and continue path
   */
	 const [error, hasError] = useState(false);

	 console.log('do we have data --------------------------', JSON.stringify(data))

	 const handlers = {
    onGoForward: () => {
			deleteMentalHealthStatement(data, setFormData);
			goForward(data);
      if (error) return;
    },
		onGoBack: () => {
			goBack();
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
							>
								<va-radio-option
									label={form0781WorkflowChoiceLabels[form0781WorkflowChoices.COMPLETE_ONLINE_FORM]}
									name="private"
									value="y"
									checked={data['view:mentalHealthWorkflowChoice'] === form0781WorkflowChoices.COMPLETE_ONLINE_FORM}
								/>
								<va-radio-option
									label={form0781WorkflowChoiceLabels[form0781WorkflowChoices.SUBMIT_PAPER_FORM]}
									name="private"
									value="n"
									checked={data['view:mentalHealthWorkflowChoice'] === form0781WorkflowChoices.SUBMIT_PAPER_FORM}
								/>
								<va-radio-option
									label={form0781WorkflowChoiceLabels[form0781WorkflowChoices.OPT_OUT_OF_FORM0781]}
									name="private"
									value="n"
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
						modalTitle="Skip VA Form 21-0781?"
						primaryButtonText={confirmationLabel.SKIP_FORM0781_LABEL}
						secondaryButtonText={declineLabel}
						onPrimaryButtonClick={handlers.onGoForward}
						onSecondaryButtonClick={handlers.onGoBack}
						onCloseEvent={handlers.onGoBack}
						visible
						uswds
					>
						<p>
							<strong>What to know:</strong> If you skip VA Form 21-0781,
							you won't be able to share any information about any mental
							health conditions. You won't be able to share descriptions
							about any related traumatic events and resulting behavioral
							changes, or any details about supporting documents related
							to mental health.
						</p>
						<p>Do you want to opt out of form 21-0781?</p>
					</VaModal>
			</fieldset>
			<FormNavButtons goBack={goBack} goForward={goForward} />
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
