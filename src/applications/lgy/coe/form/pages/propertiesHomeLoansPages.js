import React from 'react';
import {
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';
import { formatReviewDate } from 'platform/forms-system/src/js/helpers';
import propertyAddress from './propertyAddress';
import loanDetails from './loanDetails';
import entitlementRestoration from './entitlementRestoration';
import disasterDamage from './disasterDamage';

const formatPropertyAddress = itemData => {
  const { propertyAddress: itemPropertyAddress } = itemData || {};
  const parts = [
    itemPropertyAddress?.street1,
    itemPropertyAddress?.street2,
    itemPropertyAddress?.street3,
    itemPropertyAddress?.city,
    itemPropertyAddress?.state,
    itemPropertyAddress?.postalCode,
  ].filter(Boolean);
  return parts.join(', ');
};

const getEntitlementRestorationText = option => {
  const textMap = {
    ENTITLEMENT_INQUIRY_ONLY: 'Entitlement inquiry restoration',
    CASH_OUT_REFINANCE: 'Cash-out refinance restoration',
    INTEREST_RATE_REDUCTION_REFINANCE:
      'Interest rate reduction refinance restoration',
    ONE_TIME_RESTORATION: 'One time restoration',
  };

  return textMap[option] || '';
};

/** @type {ArrayBuilderOptions} */
const options = {
  arrayPath: 'relevantPriorLoans',
  nounSingular: 'property',
  nounPlural: 'properties with VA home loans',
  required: false,
  isItemIncomplete: item =>
    !item?.loanDate ||
    !item?.entitlementRestoration ||
    !item?.propertyAddress?.street1 ||
    !item?.propertyAddress?.city ||
    !item?.propertyAddress?.state ||
    !item?.propertyAddress?.postalCode ||
    !item?.propertyAddress?.country ||
    item?.naturalDisaster?.affected === undefined ||
    (item?.naturalDisaster.affected && !item?.naturalDisaster.dateOfLoss),
  text: {
    getItemName: item => (
      <div>
        {item?.propertyAddress?.street1}
        <br />
        {item?.propertyAddress?.street2 && (
          <>
            {item?.propertyAddress?.street2}
            <br />
          </>
        )}
        {item?.propertyAddress?.street3 && (
          <>
            {item?.propertyAddress?.street3}
            <br />
          </>
        )}
        {item?.propertyAddress?.city}, {item?.propertyAddress?.state}{' '}
        {item?.propertyAddress?.postalCode}
      </div>
    ),
    cardDescription: itemData => (
      <div>
        {formatReviewDate(itemData?.loanDate, true)}
        <div>
          {getEntitlementRestorationText(itemData?.entitlementRestoration)}
        </div>
        <div>
          {itemData?.naturalDisaster?.affected &&
            'Damaged or destroyed by a federally declared natural disaster'}
        </div>
      </div>
    ),
    alertItemUpdated: ({ itemData }) =>
      `${formatPropertyAddress(itemData)} updated`,
    alertItemDeleted: ({ itemData }) =>
      `${formatPropertyAddress(itemData)} deleted`,
    cancelAddTitle: 'Cancel adding this property',
    cancelAddDescription:
      'If you cancel, we’ll remove the information you entered about this property.',
    cancelAddYes: 'Yes, cancel',
    cancelAddNo: 'No, continue adding',
    cancelEditTitle: 'Cancel editing this property',
    // cancelEditDescription: 'Update me',
    cancelEditYes: 'Yes, cancel',
    cancelEditNo: 'No, continue editing',
    deleteTitle: 'Delete this VA home loan property?',
    deleteDescription: ({ itemData }) =>
      `If you delete “${formatPropertyAddress(
        itemData,
      )}”, we’ll remove the information you entered for this property. We’ll take you back to add another property if you need to.`,
    deleteYes: 'Yes, delete',
    deleteNo: 'No, cancel',
    summaryTitle: 'Summary of properties with VA home loans',
  },
};

/**
 * Cards are populated on this page above the uiSchema if items are present
 *
 * @returns {PageSchema}
 */
const summaryPage = {
  uiSchema: {
    'view:propertiesHomeLoans': arrayBuilderYesNoUI(
      options,
      {
        title: 'Do you have a property with a VA home loan to add?',
        labels: { Y: 'Yes', N: 'No' },
      },
      {
        title: 'Do you have another property with a VA home loan to add?',
        labels: { Y: 'Yes', N: 'No' },
      },
    ),
  },
  schema: {
    type: 'object',
    properties: {
      'view:propertiesHomeLoans': arrayBuilderYesNoSchema,
    },
    required: ['view:propertiesHomeLoans'],
  },
};

const shouldShowPropertiesHomeLoansLoop = formData =>
  formData['view:coeFormRebuildCveteam'] &&
  formData?.loanHistory?.hadPriorLoans === true &&
  formData?.loanHistory?.currentOwnership === true;

export const propertiesHomeLoansPages = arrayBuilderPages(
  options,
  pageBuilder => ({
    propertiesHomeLoansSummary: pageBuilder.summaryPage({
      title: 'Summary of properties with VA home loans',
      path: 'relevant-prior-loans-summary',
      depends: shouldShowPropertiesHomeLoansLoop,
      uiSchema: summaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    propertyHomeLoanAddressPage: pageBuilder.itemPage({
      title: 'Property with VA home loan: Address of the property',
      path: 'relevant-prior-loans/:index/property-address',
      depends: shouldShowPropertiesHomeLoansLoop,
      uiSchema: propertyAddress.uiSchema,
      schema: propertyAddress.schema,
    }),
    propertyHomeLoanDetailsPage: pageBuilder.itemPage({
      title: 'Property with VA home loan: Existing VA home loan details',
      path: 'relevant-prior-loans/:index/loan-details',
      depends: shouldShowPropertiesHomeLoansLoop,
      uiSchema: loanDetails.uiSchema,
      schema: loanDetails.schema,
    }),
    propertyHomeLoanEntitlementRestorationPage: pageBuilder.itemPage({
      title: 'Property with VA home loan: Entitlement restoration',
      path: 'relevant-prior-loans/:index/entitlement-restoration',
      depends: shouldShowPropertiesHomeLoansLoop,
      uiSchema: entitlementRestoration.uiSchema,
      schema: entitlementRestoration.schema,
    }),
    propertyHomeLoanDisasterDamagePage: pageBuilder.itemPage({
      title: 'Property with VA home loan: Disaster damage',
      path: 'relevant-prior-loans/:index/disaster-damage',
      depends: shouldShowPropertiesHomeLoansLoop,
      uiSchema: disasterDamage.uiSchema,
      schema: disasterDamage.schema,
    }),
  }),
);
