import React from 'react';

import ExclusionPeriodsWidget from '../../../../components/ExclusionPeriodsWidget';

import { formFields } from '../../../../constants';

import { formPages } from '../../../../helpers';

function additionalConsiderationsQuestionTitleText(
  benefitSelection,
  order,
  rudisillFlag,
  pageName,
) {
  const isUnsure = !benefitSelection || benefitSelection === 'NotEligible';
  let pageNumber;
  let totalPages;

  if (rudisillFlag) {
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
    pageNumber = isUnsure ? order - 1 : order;
    totalPages = isUnsure ? 3 : 4;
  }

  return `Question ${pageNumber} of ${totalPages}`;
}

function additionalConsiderationsQuestionTitle(
  benefitSelection,
  order,
  rudisillFlag,
  pageName,
) {
  const titleText = additionalConsiderationsQuestionTitleText(
    benefitSelection,
    order,
    rudisillFlag,
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
      return additionalConsiderationsQuestionTitleText(
        (data[(formFields?.viewBenefitSelection)] &&
          data[(formFields?.viewBenefitSelection)][
            (formFields?.benefitRelinquished)
          ]) ||
          'NotEligible',
        page.order,
        rudisillFlag,
        page.name,
      );
    },
    uiSchema: {
      'ui:description': data => {
        const rudisillFlag =
          data.formData?.dgiRudisillHideBenefitsSelectionStep;
        return additionalConsiderationsQuestionTitle(
          data.formData[formFields.viewBenefitSelection][
            formFields.benefitRelinquished
          ],
          page.order,
          rudisillFlag,
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

const additionalConsiderations33 = {
  [formPages.additionalConsiderations.activeDutyKicker.name]: {
    ...AdditionalConsiderationTemplate(
      formPages.additionalConsiderations.activeDutyKicker,
      formFields.activeDutyKicker,
    ),
    depends: formData =>
      formData.dgiRudisillHideBenefitsSelectionStep ||
      formData?.[formFields.viewBenefitSelection]?.[
        formFields.benefitRelinquished
      ] === 'Chapter30',
  },
  [formPages.additionalConsiderations.reserveKicker.name]: {
    ...AdditionalConsiderationTemplate(
      formPages.additionalConsiderations.reserveKicker,
      formFields.selectedReserveKicker,
    ),
    depends: formData =>
      formData.dgiRudisillHideBenefitsSelectionStep ||
      formData?.[formFields.viewBenefitSelection]?.[
        formFields.benefitRelinquished
      ] === 'Chapter1606',
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
};

export default additionalConsiderations33;
