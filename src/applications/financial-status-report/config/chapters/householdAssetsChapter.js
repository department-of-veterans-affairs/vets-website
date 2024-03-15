import {
  monetaryValues,
  enhancedRealEstate,
  enhancedRealEstateRecords,
  vehicles,
  recreationalVehicles,
  recreationalVehicleRecords,
  otherAssetPages,
} from '../../pages';

import AddAsset from '../../components/otherAssets/AddAsset';
import OtherAssetsChecklist from '../../components/otherAssets/OtherAssetsChecklist';
import OtherAssetsSummary from '../../components/otherAssets/OtherAssetsSummary';
import OtherAssetsSummaryReview from '../../components/otherAssets/OtherAssetsSummaryReview';
import RealEstateReview from '../../components/otherAssets/RealEstateReview';
import RealEstateQuestionReview from '../../components/otherAssets/RealEstateQuestionReview';
import EnhancedVehicleRecord from '../../components/otherAssets/EnhancedVehicleRecord';
import VehicleSummaryWidget from '../../components/otherAssets/VehicleSummaryWidget';
import MonetaryAssetsSummaryReview from '../../components/monetary/MonetaryAssetsSummaryReview';
import VehicleSummaryReview from '../../components/otherAssets/VehicleSummaryReview';
import {
  CashOnHand,
  CashOnHandReview,
} from '../../components/monetary/CashOnHand';
import RecreationalVehiclesReview from '../../components/otherAssets/RecreationalVehcilesReview';
import StreamlinedExplainer from '../../components/shared/StreamlinedExplainer';
import { isStreamlinedShortForm } from '../../utils/streamlinedDepends';
import {
  CashInBank,
  CashInBankReview,
} from '../../components/monetary/CashInBank';
import MonetaryCheckList from '../../components/monetary/MonetaryCheckList';

export default {
  householdAssetsChapter: {
    title: 'Household assets',
    pages: {
      // Cash on hand - last check for streamlined short form
      cashOnHand: {
        path: 'cash-on-hand',
        title: 'Cash on hand',
        uiSchema: {},
        schema: { type: 'object', properties: {} },
        CustomPage: CashOnHand,
        CustomPageReview: CashOnHandReview,
        depends: formData => {
          const { gmtData } = formData;
          // Also show if the new asset update is true
          return (
            (gmtData?.isEligibleForStreamlined && gmtData?.incomeBelowGmt) ||
            (gmtData?.isEligibleForStreamlined &&
              gmtData?.incomeBelowOneFiftyGmt &&
              formData['view:streamlinedWaiverAssetUpdate'])
          );
        },
      },
      cashInBank: {
        path: 'cash-in-bank',
        title: 'Cash in bank',
        uiSchema: {},
        schema: { type: 'object', properties: {} },
        CustomPage: CashInBank,
        CustomPageReview: CashInBankReview,
        depends: formData => {
          const { gmtData } = formData;
          // Only show if the new asset update is true
          return (
            gmtData?.isEligibleForStreamlined &&
            gmtData?.incomeBelowOneFiftyGmt &&
            formData['view:streamlinedWaiverAssetUpdate']
          );
        },
      },
      streamlinedShortTransitionPage: {
        // Transition page - streamlined short form only
        path: 'skip-questions-explainer',
        title: ' ',
        CustomPage: StreamlinedExplainer,
        CustomPageReview: null,
        uiSchema: {},
        schema: { type: 'object', properties: {} },
        depends: formData =>
          formData?.gmtData?.isEligibleForStreamlined &&
          isStreamlinedShortForm(formData),
      },

      monetaryChecklist: {
        path: 'monetary-asset-checklist',
        title: 'Monetary asset options',
        uiSchema: {},
        schema: { type: 'object', properties: {} },
        CustomPage: MonetaryCheckList,
        CustomPageReview: null,
        depends: formData => !isStreamlinedShortForm(formData),
      },
      monetaryValues: {
        path: 'monetary-asset-values',
        title: 'Monetary asset values',
        uiSchema: monetaryValues.uiSchema,
        schema: monetaryValues.schema,
        CustomPageReview: MonetaryAssetsSummaryReview,
        depends: formData => {
          const { assets } = formData;
          const { monetaryAssets = [] } = assets;
          const filteredLiquidAssets = monetaryAssets.filter(
            asset =>
              asset?.name?.toLowerCase() !== 'cash on hand (not in bank)' &&
              asset?.name?.toLowerCase() !==
                'cash in a bank (savings and checkings)',
          );

          return (
            filteredLiquidAssets.length > 0 && !isStreamlinedShortForm(formData)
          );
        },
      },
      enhancedRealEstate: {
        path: 'enhanced-real-estate-assets',
        title: 'Real estate',
        uiSchema: enhancedRealEstate.uiSchema,
        schema: enhancedRealEstate.schema,
        depends: formData => !isStreamlinedShortForm(formData),
        editModeOnReviewPage: false,
        CustomPageReview: RealEstateQuestionReview,
      },
      enhancedRealEstateRecords: {
        path: 'enhanced-real-estate-asset-records',
        title: 'Real estate',
        uiSchema: enhancedRealEstateRecords.uiSchema,
        schema: enhancedRealEstateRecords.schema,
        depends: formData =>
          formData.questions?.hasRealEstate &&
          !isStreamlinedShortForm(formData),
        editModeOnReviewPage: true,
        CustomPageReview: RealEstateReview,
      },
      vehicles: {
        path: 'vehicles',
        title: 'Vehicles',
        uiSchema: vehicles.uiSchema,
        schema: vehicles.schema,
        depends: formData => !isStreamlinedShortForm(formData),
      },
      enhancedVehicleRecords: {
        path: 'your-vehicle-records',
        title: 'Vehicles',
        uiSchema: {},
        schema: { type: 'object', properties: {} },
        depends: formData =>
          formData.questions.hasVehicle &&
          !formData.assets?.automobiles?.length &&
          !isStreamlinedShortForm(formData),
        editModeOnReviewPage: true,
        CustomPage: EnhancedVehicleRecord,
        CustomPageReview: null,
        returnUrl: '/vehicles-summary',
      },
      vehiclesSummary: {
        path: 'vehicles-summary',
        title: 'Your car or other vehicle',
        uiSchema: {},
        schema: { type: 'object', properties: {} },
        depends: formData =>
          formData.questions.hasVehicle && !isStreamlinedShortForm(formData),
        editModeOnReviewPage: true,
        CustomPage: VehicleSummaryWidget,
        CustomPageReview: VehicleSummaryReview,
      },
      recreationalVehicles: {
        path: 'recreational-vehicles',
        title: 'Recreational vehicles',
        uiSchema: recreationalVehicles.uiSchema,
        schema: recreationalVehicles.schema,
        depends: formData => !isStreamlinedShortForm(formData),
      },
      recreationalVehicleRecords: {
        path: 'recreational-vehicle-records',
        title: 'Recreational vehicles',
        uiSchema: recreationalVehicleRecords.recreationalVehicleUISchema,
        schema: recreationalVehicleRecords.recreationalVehicleSchema,
        depends: formData =>
          formData.questions.hasRecreationalVehicle &&
          !isStreamlinedShortForm(formData),
        editModeOnReviewPage: true,
        CustomPageReview: RecreationalVehiclesReview,
      },
      // Other Household Assets
      otherAssetsChecklist: {
        path: 'other-assets-checklist',
        title: 'Other assets options',
        CustomPage: OtherAssetsChecklist,
        CustomPageReview: null,
        uiSchema: {},
        schema: { type: 'object', properties: {} },
        depends: formData => !isStreamlinedShortForm(formData),
      },
      otherAssetsValues: {
        path: 'other-assets-values',
        title: 'Other assets values',
        uiSchema: otherAssetPages.otherAssetsValues.uiSchema,
        schema: otherAssetPages.otherAssetsValues.schema,
        depends: formData =>
          !!formData.assets?.otherAssets?.length &&
          !isStreamlinedShortForm(formData),
      },
      otherAssetsSummary: {
        path: 'other-assets-summary',
        title: 'Other assets summary',
        CustomPage: OtherAssetsSummary,
        CustomPageReview: OtherAssetsSummaryReview,
        editModeOnReviewPage: true,
        uiSchema: {},
        schema: { type: 'object', properties: {} },
        depends: formData =>
          !!formData.assets?.otherAssets?.length &&
          !isStreamlinedShortForm(formData),
      },
      addOtherAsset: {
        path: 'add-other-asset',
        title: 'Add your additional assets',
        CustomPage: AddAsset,
        CustomPageReview: null,
        uiSchema: {},
        schema: { type: 'object', properties: {} },
        depends: () => false, // accessed from otherAssetsSummary
      },
    },
  },
};
