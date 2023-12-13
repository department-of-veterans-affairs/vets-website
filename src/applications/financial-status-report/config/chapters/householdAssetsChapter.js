import {
  monetary,
  monetaryValues,
  realEstate,
  realEstateRecords,
  enhancedRealEstate,
  enhancedRealEstateRecords,
  vehicles,
  vehicleRecords,
  recreationalVehicles,
  recreationalVehicleRecords,
  otherAssets,
  otherAssetRecords,
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
      monetary: {
        path: 'monetary-assets',
        title: 'Monetary assets',
        uiSchema: monetary.uiSchema,
        schema: monetary.schema,
        depends: formData =>
          !formData['view:enhancedFinancialStatusReport'] &&
          !isStreamlinedShortForm(formData),
      },
      monetaryChecklist: {
        path: 'monetary-asset-checklist',
        title: 'Monetary asset options',
        uiSchema: {},
        schema: { type: 'object', properties: {} },
        CustomPage: MonetaryCheckList,
        CustomPageReview: null,
        depends: formData =>
          formData['view:enhancedFinancialStatusReport'] &&
          !isStreamlinedShortForm(formData),
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
            formData['view:enhancedFinancialStatusReport'] &&
            filteredLiquidAssets.length > 0 &&
            !isStreamlinedShortForm(formData)
          );
        },
      },
      realEstate: {
        path: 'real-estate-assets',
        title: 'Real estate',
        uiSchema: realEstate.uiSchema,
        schema: realEstate.schema,
        depends: formData =>
          !formData['view:enhancedFinancialStatusReport'] &&
          !isStreamlinedShortForm(formData),
      },
      realEstateRecords: {
        path: 'real-estate-asset-records',
        title: 'Real estate',
        uiSchema: realEstateRecords.uiSchema,
        schema: realEstateRecords.schema,
        depends: formData =>
          formData.questions.hasRealEstate &&
          !formData['view:enhancedFinancialStatusReport'] &&
          !isStreamlinedShortForm(formData),
        editModeOnReviewPage: true,
      },
      enhancedRealEstate: {
        path: 'enhanced-real-estate-assets',
        title: 'Real estate',
        uiSchema: enhancedRealEstate.uiSchema,
        schema: enhancedRealEstate.schema,
        depends: formData =>
          formData['view:enhancedFinancialStatusReport'] &&
          !isStreamlinedShortForm(formData),
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
          formData['view:enhancedFinancialStatusReport'] &&
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
      vehicleRecords: {
        path: 'vehicle-records',
        title: 'Vehicles',
        uiSchema: vehicleRecords.uiSchema,
        schema: vehicleRecords.schema,
        depends: formData =>
          formData.questions.hasVehicle &&
          !formData['view:enhancedFinancialStatusReport'] &&
          !isStreamlinedShortForm(formData),
        editModeOnReviewPage: true,
      },
      enhancedVehicleRecords: {
        path: 'your-vehicle-records',
        title: 'Vehicles',
        uiSchema: {},
        schema: { type: 'object', properties: {} },
        depends: formData =>
          formData.questions.hasVehicle &&
          !formData.assets?.automobiles?.length &&
          formData['view:enhancedFinancialStatusReport'] &&
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
          formData.questions.hasVehicle &&
          formData['view:enhancedFinancialStatusReport'] &&
          !isStreamlinedShortForm(formData),
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
      otherAssets: {
        path: 'other-assets',
        title: 'Other assets',
        uiSchema: otherAssets.uiSchema,
        schema: otherAssets.schema,
        depends: formData =>
          !formData['view:enhancedFinancialStatusReport'] &&
          !isStreamlinedShortForm(formData),
      },
      otherAssetRecords: {
        path: 'other-asset-records',
        title: 'Other assets',
        uiSchema: otherAssetRecords.uiSchema,
        schema: otherAssetRecords.schema,
        depends: formData =>
          formData.questions.hasOtherAssets &&
          !formData['view:enhancedFinancialStatusReport'] &&
          !isStreamlinedShortForm(formData),
        editModeOnReviewPage: true,
      },
      // Other Household Assets
      otherAssetsChecklist: {
        path: 'other-assets-checklist',
        title: 'Other assets options',
        CustomPage: OtherAssetsChecklist,
        CustomPageReview: null,
        uiSchema: {},
        schema: { type: 'object', properties: {} },
        depends: formData =>
          formData['view:enhancedFinancialStatusReport'] &&
          !isStreamlinedShortForm(formData),
      },
      otherAssetsValues: {
        path: 'other-assets-values',
        title: 'Other assets values',
        uiSchema: otherAssetPages.otherAssetsValues.uiSchema,
        schema: otherAssetPages.otherAssetsValues.schema,
        depends: formData =>
          !!formData.assets?.otherAssets?.length &&
          formData['view:enhancedFinancialStatusReport'] &&
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
          formData['view:enhancedFinancialStatusReport'] &&
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
