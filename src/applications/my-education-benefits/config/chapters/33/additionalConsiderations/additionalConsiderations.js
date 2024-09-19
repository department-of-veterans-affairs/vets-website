import React from 'react';
import ExclusionPeriodsWidget from '../../../../components/ExclusionPeriodsWidget';
import { formFields } from '../../../../constants';
import { formPages } from '../../../../helpers';

function additionalConsiderationsQuestionTitleText(
  order,
  rudisillFlag,
  meb160630Automation,
  chosenBenefit, // Include chosenBenefit here
  pageName,
) {
  let pageNumber;
  let totalPages;
  // Handle when rudisillFlag is true and meb160630Automation is false (5 questions)
  if (rudisillFlag && !meb160630Automation) {
    const pageOrder = {
      'active-duty-kicker': 1,
      'reserve-kicker': 2,
      'academy-commission': 3,
      'rotc-commission': 4,
      'loan-payment': 5,
    };
    pageNumber = pageOrder[pageName] || order;
    totalPages = 5;
  } else {
    // Handle when meb160630Automation is true, but chosenBenefit is NOT chapter30 (still show 5 questions)
    const pageOrder = {
      'active-duty-kicker': 1,
      'reserve-kicker': 2,
      'academy-commission': 3,
      'rotc-commission': 4,
      'loan-payment': 5,
      'additional-contributions': 6, // This question only appears for chapter30
    };
    // Show 6 questions only if meb160630Automation is enabled AND chosenBenefit is 'chapter30'
    pageNumber = pageOrder[pageName] || order;
    totalPages = meb160630Automation && chosenBenefit === 'chapter30' ? 6 : 5;
  }
  return `Question ${pageNumber} of ${totalPages}`;
}
// Function to render the question title on the form
function additionalConsiderationsQuestionTitle(
  order,
  rudisillFlag,
  meb160630Automation,
  chosenBenefit,
  pageName,
) {
  const titleText = additionalConsiderationsQuestionTitleText(
    order,
    rudisillFlag,
    meb160630Automation,
    chosenBenefit,
    pageName,
  );
  return (
    <>
      <h3 className="meb-additional-considerations-title meb-form-page-only">
        {titleText}
      </h3>
      <h4 className="form-review-panel-page-header vads-u-font-size--h5 meb-review-page-only">
        {titleText}
      </h4>
      <p className="meb-review-page-only">
        If you’d like to update your answer to {titleText}, edit your answer to
        the question below.
      </p>
    </>
  );
}
// Template for additional considerations pages
function AdditionalConsiderationTemplate(page, formField, options = {}) {
  const { title, additionalInfo } = page;
  const additionalInfoViewName = `view:${page.name}AdditionalInfo`;
  const displayTypeMapping = {
    [formFields.federallySponsoredAcademy]: 'Academy',
    [formFields.seniorRotcCommission]: 'ROTC',
    [formFields.loanPayment]: 'LRP',
  };
  const displayType = displayTypeMapping[formField] || '';
  let additionalInfoView;
  const uiDescription = (
    <>
      {options.includeExclusionWidget && (
        <ExclusionPeriodsWidget displayType={displayType} />
      )}
      {additionalInfo && (
        <>
          <br />
          <va-additional-info trigger={additionalInfo.trigger}>
            <p>{additionalInfo.info}</p>
          </va-additional-info>
        </>
      )}
    </>
  );
  if (additionalInfo || options.includeExclusionWidget) {
    additionalInfoView = {
      [additionalInfoViewName]: {
        'ui:description': uiDescription,
      },
    };
  }
  return {
    path: page.name,
    title: data => {
      const rudisillFlag = data?.dgiRudisillHideBenefitsSelectionStep;
      const meb160630Automation = data?.meb160630Automation;
      const chosenBenefit = data?.formData?.chosenBenefit;
      return additionalConsiderationsQuestionTitleText(
        page.order,
        rudisillFlag,
        meb160630Automation,
        chosenBenefit,
        page.name,
      );
    },
    uiSchema: {
      'ui:description': data => {
        const rudisillFlag =
          data.formData?.dgiRudisillHideBenefitsSelectionStep;
        const meb160630Automation = data?.formData?.meb160630Automation;
        const chosenBenefit = data?.formData?.chosenBenefit;
        return additionalConsiderationsQuestionTitle(
          page.order,
          rudisillFlag,
          meb160630Automation,
          chosenBenefit,
          page.name,
        );
      },
      [formFields[formField]]: {
        'ui:title': title,
        'ui:widget': 'radio',
      },
      ...additionalInfoView,
    },
    schema: {
      type: 'object',
      required: [formField],
      properties: {
        [formFields[formField]]: {
          type: 'string',
          enum: ['Yes', 'No'],
        },
        [additionalInfoViewName]: {
          type: 'object',
          properties: {},
        },
      },
    },
  };
}
// Define the additional considerations pages with correct dependencies
const additionalConsiderations33 = {
  [formPages.additionalConsiderations.activeDutyKicker.name]: {
    ...AdditionalConsiderationTemplate(
      formPages.additionalConsiderations.activeDutyKicker,
      formFields.activeDutyKicker,
    ),
    depends: formData => formData.dgiRudisillHideBenefitsSelectionStep,
  },
  [formPages.additionalConsiderations.reserveKicker.name]: {
    ...AdditionalConsiderationTemplate(
      formPages.additionalConsiderations.reserveKicker,
      formFields.selectedReserveKicker,
    ),
    depends: formData => formData.dgiRudisillHideBenefitsSelectionStep,
  },
  [formPages.additionalConsiderations.militaryAcademy.name]: {
    ...AdditionalConsiderationTemplate(
      formPages.additionalConsiderations.militaryAcademy,
      formFields.federallySponsoredAcademy,
      { includeExclusionWidget: true },
    ),
  },
  [formPages.additionalConsiderations.seniorRotc.name]: {
    ...AdditionalConsiderationTemplate(
      formPages.additionalConsiderations.seniorRotc,
      formFields.seniorRotcCommission,
      { includeExclusionWidget: true },
    ),
  },
  [formPages.additionalConsiderations.loanPayment.name]: {
    ...AdditionalConsiderationTemplate(
      formPages.additionalConsiderations.loanPayment,
      formFields.loanPayment,
      { includeExclusionWidget: true },
    ),
  },
  [formPages.additionalConsiderations.sixHundredDollarBuyUp.name]: {
    ...AdditionalConsiderationTemplate(
      formPages.additionalConsiderations.sixHundredDollarBuyUp,
      formFields.sixHundredDollarBuyUp,
    ),
    depends: formData =>
      formData?.chosenBenefit === 'chapter30' && formData?.meb160630Automation,
  },
};
export default additionalConsiderations33;
