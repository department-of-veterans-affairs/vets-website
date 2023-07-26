import {
  monetary,
  monetaryChecklist,
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
import OtherAssetsSummary from '../../components/otherAssets/OtherAssetsSummary';
import OtherAssetsSummaryReview from '../../components/otherAssets/OtherAssetsSummaryReview';
import EnhancedVehicleRecord from '../../components/EnhancedVehicleRecord';
import VehicleSummaryWidget from '../../pages/assets/vehicles/VehicleSummaryWidget';
import MonetaryAssetsSummaryReview from '../../components/monetary/MonetaryAssetsSummaryReview';
import VehicleSummaryReview from '../../components/otherAssets/VehicleSummaryReview';

export default {
  householdAssetsChapter: {
    title: 'Household assets',
    pages: {
      monetary: {
        path: 'monetary-assets',
        title: 'Monetary assets',
        uiSchema: monetary.uiSchema,
        schema: monetary.schema,
        depends: formData => !formData['view:enhancedFinancialStatusReport'],
      },
      monetaryChecklist: {
        path: 'monetary-asset-checklist',
        title: 'Monetary asset options',
        uiSchema: monetaryChecklist.uiSchema,
        schema: monetaryChecklist.schema,
        depends: formData => formData['view:enhancedFinancialStatusReport'],
      },
      monetaryValues: {
        path: 'monetary-asset-values',
        title: 'Monetary asset values',
        uiSchema: monetaryValues.uiSchema,
        schema: monetaryValues.schema,
        CustomPageReview: MonetaryAssetsSummaryReview,
        depends: formData =>
          formData['view:enhancedFinancialStatusReport'] &&
          formData.assets?.monetaryAssets?.length > 0,
      },
      realEstate: {
        path: 'real-estate-assets',
        title: 'Real estate',
        uiSchema: realEstate.uiSchema,
        schema: realEstate.schema,
        depends: formData => !formData['view:enhancedFinancialStatusReport'],
      },
      realEstateRecords: {
        path: 'real-estate-asset-records',
        title: 'Real estate',
        uiSchema: realEstateRecords.uiSchema,
        schema: realEstateRecords.schema,
        depends: formData =>
          formData.questions.hasRealEstate &&
          !formData['view:enhancedFinancialStatusReport'],
        editModeOnReviewPage: true,
      },
      enhancedRealEstate: {
        path: 'enhanced-real-estate-assets',
        title: 'Real estate',
        uiSchema: enhancedRealEstate.uiSchema,
        schema: enhancedRealEstate.schema,
        depends: formData => formData['view:enhancedFinancialStatusReport'],
        editModeOnReviewPage: false,
      },
      enhancedRealEstateRecords: {
        path: 'enhanced-real-estate-asset-records',
        title: 'Real estate',
        uiSchema: enhancedRealEstateRecords.uiSchema,
        schema: enhancedRealEstateRecords.schema,
        depends: formData =>
          formData.questions.hasRealEstate &&
          formData['view:enhancedFinancialStatusReport'],
        editModeOnReviewPage: false,
      },
      vehicles: {
        path: 'vehicles',
        title: 'Vehicles',
        uiSchema: vehicles.uiSchema,
        schema: vehicles.schema,
      },
      vehicleRecords: {
        path: 'vehicle-records',
        title: 'Vehicles',
        uiSchema: vehicleRecords.uiSchema,
        schema: vehicleRecords.schema,
        depends: formData =>
          formData.questions.hasVehicle &&
          !formData['view:enhancedFinancialStatusReport'],
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
          formData['view:enhancedFinancialStatusReport'],
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
          formData['view:enhancedFinancialStatusReport'],
        editModeOnReviewPage: true,
        CustomPage: VehicleSummaryWidget,
        CustomPageReview: VehicleSummaryReview,
      },
      recreationalVehicles: {
        path: 'recreational-vehicles',
        title: 'Recreational vehicles',
        uiSchema: recreationalVehicles.uiSchema,
        schema: recreationalVehicles.schema,
      },
      recreationalVehicleRecords: {
        path: 'recreational-vehicle-records',
        title: 'Recreational vehicles',
        uiSchema: recreationalVehicleRecords.recreationalVehicleUISchema,
        schema: recreationalVehicleRecords.recreationalVehicleSchema,
        depends: formData => formData.questions.hasRecreationalVehicle,
        editModeOnReviewPage: false,
      },
      otherAssets: {
        path: 'other-assets',
        title: 'Other assets',
        uiSchema: otherAssets.uiSchema,
        schema: otherAssets.schema,
        depends: formData => !formData['view:enhancedFinancialStatusReport'],
      },
      otherAssetRecords: {
        path: 'other-asset-records',
        title: 'Other assets',
        uiSchema: otherAssetRecords.uiSchema,
        schema: otherAssetRecords.schema,
        depends: formData =>
          formData.questions.hasOtherAssets &&
          !formData['view:enhancedFinancialStatusReport'],
        editModeOnReviewPage: true,
      },
      // Other Household Assets
      otherAssetsChecklist: {
        path: 'other-assets-checklist',
        title: 'Other assets options',
        uiSchema: otherAssetPages.otherAssetsChecklist.uiSchema,
        schema: otherAssetPages.otherAssetsChecklist.schema,
        depends: formData => formData['view:enhancedFinancialStatusReport'],
      },
      otherAssetsValues: {
        path: 'other-assets-values',
        title: 'Other assets values',
        uiSchema: otherAssetPages.otherAssetsValues.uiSchema,
        schema: otherAssetPages.otherAssetsValues.schema,
        depends: formData =>
          !!formData.assets?.otherAssets?.length &&
          formData['view:enhancedFinancialStatusReport'],
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
          formData['view:enhancedFinancialStatusReport'],
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
