import React from 'react';
import ExclusionPeriodsWidget from '../../../../components/ExclusionPeriodsWidget';
import { formFields } from '../../../../constants';
import { formPages } from '../../../../helpers';

/**
 * Determines the "Question X of Y" text.
 * If mebKickerNotificationEnabled is true, pages 3-5 are hidden,
 * so only page 1 (active-duty-kicker), page 2 (reserve-kicker),
 * and possibly page 3 (additional-contributions) if chosenBenefit is 'chapter30'.
 * Otherwise, show the legacy 5 pages (+1 if chapter30).
 */
function additionalConsiderationsQuestionTitleText(
  order,
  chosenBenefit,
  pageName,
  mebKickerNotificationEnabled,
) {
  if (mebKickerNotificationEnabled) {
    // New feature: Only show pages 1-2, plus 3 if chapter30
    const pageOrder = {
      'active-duty-kicker': 1,
      'reserve-kicker': 2,
      'additional-contributions': 3, // if chapter30
    };
    const pageNumber = pageOrder[pageName] || order;
    const totalPages = chosenBenefit === 'chapter30' ? 3 : 2;
    return `Question ${pageNumber} of ${totalPages}`;
  }

  // Legacy (flag off): Show pages 1..5, plus 6 if chapter30
  const pageOrder = {
    'active-duty-kicker': 1,
    'reserve-kicker': 2,
    'academy-commission': 3,
    'rotc-commission': 4,
    'loan-payment': 5,
    'additional-contributions': 6,
  };
  const pageNumber = pageOrder[pageName] || order;
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
 * Template for building each "page" in Additional Considerations.
 * - Displays the question title and radio buttons
 * - Optionally includes an ExclusionPeriodsWidget
 * - Hides pages 3, 4, 5 if mebKickerNotificationEnabled is true
 * - Adds a Kicker Notification alert if kickerNotificationAlert is set
 */
function AdditionalConsiderationTemplate(page, formField, options = {}) {
  const { title, additionalInfo } = page;
  const additionalInfoViewName = `view:${page.name}AdditionalInfo`;

  // For Academy, ROTC, LRP we may show an ExclusionPeriodsWidget
  const displayTypeMapping = {
    [formFields.federallySponsoredAcademy]: 'Academy',
    [formFields.seniorRotcCommission]: 'ROTC',
    [formFields.loanPayment]: 'LRP',
  };
  const displayType = displayTypeMapping[formField] || '';

  let additionalInfoView;
  if (additionalInfo || options.includeExclusionWidget) {
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

        // Show Kicker Notification if feature flag + user eligibility
        'ui:description': data => {
          // If we didn't opt in, skip
          if (!options.kickerNotificationAlert) {
            return null;
          }

          // If the feature flag is off, skip
          if (!data?.formData?.mebKickerNotificationEnabled) {
            return null;
          }

          // Access the eligibility booleans from formData
          const { eligibleForActiveDutyKicker, eligibleForReserveKicker } =
            data?.formData || {};

          // If this is "active-duty-kicker" and they're eligible, show the AD kicker alert
          if (
            page.name === 'active-duty-kicker' &&
            eligibleForActiveDutyKicker
          ) {
            return (
              <va-alert visible status="info">
                <h3 slot="headline">
                  DoD data shows you are potentially eligible for an active duty
                  kicker
                </h3>
                <p>If this is incorrect, please change your answer below.</p>
              </va-alert>
            );
          }

          // If this is "reserve-kicker" and they're eligible, show the Reserve kicker alert
          if (page.name === 'reserve-kicker' && eligibleForReserveKicker) {
            return (
              <va-alert visible status="info">
                <h3 slot="headline">
                  DoD data shows you are potentially eligible for a reserve
                  kicker
                </h3>
                <p>If this is incorrect, please change your answer below.</p>
              </va-alert>
            );
          }

          return null;
        },
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
 * Export the Additional Considerations config object with each page defined.
 * - Pages 1 & 2 always show, plus the new kicker alert if flagged & user is eligible
 * - Pages 3,4,5 are hidden if mebKickerNotificationEnabled is true (to preserve legacy behavior)
 * - Page 6 ($600 buy-up) shows only if chosenBenefit === 'chapter30'
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
    // Hide if mebKickerNotificationEnabled is true
    depends: formData => !formData.mebKickerNotificationEnabled,
  },

  // 4) Senior ROTC
  [formPages.additionalConsiderations.seniorRotc.name]: {
    ...AdditionalConsiderationTemplate(
      formPages.additionalConsiderations.seniorRotc,
      formFields.seniorRotcCommission,
      { includeExclusionWidget: true },
    ),
    // Hide if mebKickerNotificationEnabled is true
    depends: formData => !formData.mebKickerNotificationEnabled,
  },

  // 5) Loan Payment
  [formPages.additionalConsiderations.loanPayment.name]: {
    ...AdditionalConsiderationTemplate(
      formPages.additionalConsiderations.loanPayment,
      formFields.loanPayment,
      { includeExclusionWidget: true },
    ),
    // Hide if mebKickerNotificationEnabled is true
    depends: formData => !formData.mebKickerNotificationEnabled,
  },

  // 6) $600 Buy-Up
  [formPages.additionalConsiderations.sixHundredDollarBuyUp.name]: {
    ...AdditionalConsiderationTemplate(
      formPages.additionalConsiderations.sixHundredDollarBuyUp,
      formFields.sixHundredDollarBuyUp,
    ),
    depends: formData => formData?.chosenBenefit === 'chapter30',
  },
};

export default additionalConsiderations33;
