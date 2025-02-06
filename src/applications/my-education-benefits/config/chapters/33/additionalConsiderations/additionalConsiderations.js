import React from 'react';
import ExclusionPeriodsWidget from '../../../../components/ExclusionPeriodsWidget';
import KickerWidget from '../../../../components/KickerWidget';
import { formFields } from '../../../../constants';
import { formPages } from '../../../../helpers';

/**
 * Determines the "Question X of Y" text for Additional Considerations pages.
 */
function additionalConsiderationsQuestionTitleText(
  order,
  chosenBenefit,
  pageName,
  mebKickerNotificationEnabled,
) {
  if (mebKickerNotificationEnabled) {
    const pageOrder = {
      'active-duty-kicker': 1,
      'reserve-kicker': 2,
      'six-hundred-dollar-buy-up': 3,
    };
    const pageNumber = pageOrder[pageName] || order;
    const totalPages = chosenBenefit === 'chapter30' ? 3 : 2;
    return `Question ${pageNumber} of ${totalPages}`;
  }

  const legacyPageOrder = {
    'active-duty-kicker': 1,
    'reserve-kicker': 2,
    'academy-commission': 3,
    'rotc-commission': 4,
    'loan-payment': 5,
    'six-hundred-dollar-buy-up': 6,
  };
  const pageNumber = legacyPageOrder[pageName] || order;
  const totalPages = chosenBenefit === 'chapter30' ? 6 : 5;
  return `Question ${pageNumber} of ${totalPages}`;
}

/**
 * Renders the heading for each Additional Considerations question.
 */
function additionalConsiderationsQuestionTitle(
  order,
  chosenBenefit,
  pageName,
  mebKickerNotificationEnabled,
) {
  const titleText = additionalConsiderationsQuestionTitleText(
    order,
    chosenBenefit,
    pageName,
    mebKickerNotificationEnabled,
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

/**
 * Template function for Additional Considerations "page"
 */
function AdditionalConsiderationTemplate(page, formField, options = {}) {
  const { title, additionalInfo } = page;
  const additionalInfoViewName = `view:${page.name}AdditionalInfo`;

  const displayTypeMapping = {
    [formFields.federallySponsoredAcademy]: 'Academy',
    [formFields.seniorRotcCommission]: 'ROTC',
    [formFields.loanPayment]: 'LRP',
  };
  const displayType = displayTypeMapping[formField] || '';

  // Prepare the UI snippet that will be displayed on this page
  let additionalInfoView;
  if (
    additionalInfo ||
    options.includeExclusionWidget ||
    options.kickerNotificationAlert
  ) {
    const uiDescription = (
      <>
        {/* Conditionally render the KickerWidget */}
        {options.kickerNotificationAlert && (
          <>
            {page.name === 'active-duty-kicker' && (
              <KickerWidget kickerType="activeDuty" />
            )}
            {page.name === 'reserve-kicker' && (
              <KickerWidget kickerType="reserve" />
            )}
          </>
        )}

        {/* Conditionally render the ExclusionPeriodsWidget */}
        {options.includeExclusionWidget && (
          <ExclusionPeriodsWidget displayType={displayType} />
        )}

        {/* Render additional info if available */}
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
    additionalInfoView = {
      [additionalInfoViewName]: {
        'ui:description': uiDescription,
      },
    };
  }

  return {
    path: page.name,
    title: data => {
      const chosenBenefit = data?.formData?.chosenBenefit;
      const mebKickerFlag = data?.formData?.mebKickerNotificationEnabled;
      return additionalConsiderationsQuestionTitleText(
        page.order,
        chosenBenefit,
        page.name,
        mebKickerFlag,
      );
    },
    uiSchema: {
      'ui:description': data => {
        const chosenBenefit = data?.formData?.chosenBenefit;
        const mebKickerFlag = data?.formData?.mebKickerNotificationEnabled;
        return additionalConsiderationsQuestionTitle(
          page.order,
          chosenBenefit,
          page.name,
          mebKickerFlag,
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

/**
 * Final export: Additional Considerations config object
 */
const additionalConsiderations33 = {
  // 1) Active Duty Kicker
  [formPages.additionalConsiderations.activeDutyKicker.name]: {
    ...AdditionalConsiderationTemplate(
      formPages.additionalConsiderations.activeDutyKicker,
      formFields.activeDutyKicker,
      { kickerNotificationAlert: true },
    ),
  },

  // 2) Reserve Kicker
  [formPages.additionalConsiderations.reserveKicker.name]: {
    ...AdditionalConsiderationTemplate(
      formPages.additionalConsiderations.reserveKicker,
      formFields.selectedReserveKicker,
      { kickerNotificationAlert: true },
    ),
  },

  // 3) Academy Commission
  [formPages.additionalConsiderations.militaryAcademy.name]: {
    ...AdditionalConsiderationTemplate(
      formPages.additionalConsiderations.militaryAcademy,
      formFields.federallySponsoredAcademy,
      { includeExclusionWidget: true },
    ),
    depends: formData => !formData.mebKickerNotificationEnabled,
  },

  // 4) Senior ROTC
  [formPages.additionalConsiderations.seniorRotc.name]: {
    ...AdditionalConsiderationTemplate(
      formPages.additionalConsiderations.seniorRotc,
      formFields.seniorRotcCommission,
      { includeExclusionWidget: true },
    ),
    depends: formData => !formData.mebKickerNotificationEnabled,
  },

  // 5) Loan Payment
  [formPages.additionalConsiderations.loanPayment.name]: {
    ...AdditionalConsiderationTemplate(
      formPages.additionalConsiderations.loanPayment,
      formFields.loanPayment,
      { includeExclusionWidget: true },
    ),
    depends: formData => !formData.mebKickerNotificationEnabled,
  },

  // 6) $600 Buy-Up (chapter30)
  [formPages.additionalConsiderations.sixHundredDollarBuyUp.name]: {
    ...AdditionalConsiderationTemplate(
      formPages.additionalConsiderations.sixHundredDollarBuyUp,
      formFields.sixHundredDollarBuyUp,
    ),
    depends: formData => formData?.chosenBenefit === 'chapter30',
  },
};

export default additionalConsiderations33;
