import React from 'react';
import ExclusionPeriodsWidget from '../../../../components/ExclusionPeriodsWidget';
import KickerWidget from '../../../../components/KickerWidget';
import { formFields } from '../../../../constants';
import { formPages } from '../../../../helpers';

/**
 * Determines the "Question X of Y" text for Additional Considerations pages,
 * assuming mebKickerNotificationEnabled is always ON.
 */
function additionalConsiderationsQuestionTitleText(
  order,
  chosenBenefit,
  pageName,
) {
  const pageOrder = {
    'active-duty-kicker': 1,
    'reserve-kicker': 2,
    'six-hundred-dollar-buy-up': 3,
  };

  const pageNumber = pageOrder[pageName] || order;
  // If the user has chosen chapter30, we show 3 pages; otherwise, 2
  const totalPages = chosenBenefit === 'chapter30' ? 3 : 2;
  return `Question ${pageNumber} of ${totalPages}`;
}

/**
 * Renders the heading for each Additional Considerations question,
 */
function additionalConsiderationsQuestionTitle(order, chosenBenefit, pageName) {
  const titleText = additionalConsiderationsQuestionTitleText(
    order,
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

/**
 * Template function for each Additional Considerations "page"
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

  let additionalInfoView;
  if (
    additionalInfo ||
    options.includeExclusionWidget ||
    options.kickerNotificationAlert
  ) {
    const uiDescription = (
      <>
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
      // Always treat kicker as ON; no mebKickerNotificationEnabled check
      return additionalConsiderationsQuestionTitleText(
        page.order,
        chosenBenefit,
        page.name,
      );
    },
    uiSchema: {
      'ui:description': data => {
        const chosenBenefit = data?.formData?.chosenBenefit;
        return additionalConsiderationsQuestionTitle(
          page.order,
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

/**
 * Final export: Additional Considerations config object,
 * always treating mebKickerNotificationEnabled as true.
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
