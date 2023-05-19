// remove * and import relevant pages
import * as pages from '../../pages';
import EnhancedVehicleRecord from '../../components/EnhancedVehicleRecord';
import VehicleSummaryWidget from '../../pages/assets/vehicles/VehicleSummaryWidget';
import AddAsset from '../../components/otherAssets/AddAsset';
import OtherAssetsSummary from '../../components/otherAssets/OtherAssetsSummary';
import OtherAssetsSummaryReview from '../../components/otherAssets/OtherAssetsSummaryReview';

// householdAssetsChapter
export default {
  title: 'Household assets',
  pages: {
    monetary: {
      path: 'monetary-assets',
      title: 'Monetary assets',
      uiSchema: pages.monetary.uiSchema,
      schema: pages.monetary.schema,
      depends: formData => !formData['view:enhancedFinancialStatusReport'],
    },
    monetaryChecklist: {
      path: 'monetary-asset-checklist',
      title: 'Monetary asset options',
      uiSchema: pages.monetaryChecklist.uiSchema,
      schema: pages.monetaryChecklist.schema,
      depends: formData => formData['view:enhancedFinancialStatusReport'],
    },
    monetaryValues: {
      path: 'monetary-asset-values',
      title: 'Monetary asset values',
      uiSchema: pages.monetaryValues.uiSchema,
      schema: pages.monetaryValues.schema,
      depends: formData =>
        formData['view:enhancedFinancialStatusReport'] &&
        formData.assets?.monetaryAssets?.length > 0,
    },
    realEstate: {
      path: 'real-estate-assets',
      title: 'Real estate',
      uiSchema: pages.realEstate.uiSchema,
      schema: pages.realEstate.schema,
      depends: formData => !formData['view:enhancedFinancialStatusReport'],
    },
    realEstateRecords: {
      path: 'real-estate-asset-records',
      title: 'Real estate',
      uiSchema: pages.realEstateRecords.uiSchema,
      schema: pages.realEstateRecords.schema,
      depends: formData =>
        formData.questions.hasRealEstate &&
        !formData['view:enhancedFinancialStatusReport'],
      editModeOnReviewPage: true,
    },
    enhancedRealEstate: {
      path: 'enhanced-real-estate-assets',
      title: 'Real estate',
      uiSchema: pages.enhancedRealEstate.uiSchema,
      schema: pages.enhancedRealEstate.schema,
      depends: formData => formData['view:enhancedFinancialStatusReport'],
      editModeOnReviewPage: false,
    },
    enhancedRealEstateRecords: {
      path: 'enhanced-real-estate-asset-records',
      title: 'Real estate',
      uiSchema: pages.enhancedRealEstateRecords.uiSchema,
      schema: pages.enhancedRealEstateRecords.schema,
      depends: formData =>
        formData.questions.hasRealEstate &&
        formData['view:enhancedFinancialStatusReport'],
      editModeOnReviewPage: false,
    },
    vehicles: {
      path: 'vehicles',
      title: 'Vehicles',
      uiSchema: pages.vehicles.uiSchema,
      schema: pages.vehicles.schema,
    },
    vehicleRecords: {
      path: 'vehicle-records',
      title: 'Vehicles',
      uiSchema: pages.vehicleRecords.uiSchema,
      schema: pages.vehicleRecords.schema,
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
      CustomPageReview: null,
    },
    recreationalVehicles: {
      path: 'recreational-vehicles',
      title: 'Recreational vehicles',
      uiSchema: pages.recreationalVehicles.uiSchema,
      schema: pages.recreationalVehicles.schema,
    },
    recreationalVehicleRecords: {
      path: 'cfsr-recreational-vehicle-records',
      title: 'Recreational vehicles',
      uiSchema:
        pages.recreationalVehicleRecords.combinedFSRRecreationalUIVehicleSchema,
      schema:
        pages.recreationalVehicleRecords.combinedFSRRecreationalVehicleSchema,
      depends: formData =>
        formData.questions.hasRecreationalVehicle &&
        formData['view:combinedFinancialStatusReport'],
      editModeOnReviewPage: true,
    },
    recreationalVehicleRecordsListLoop: {
      path: 'recreational-vehicle-records',
      title: 'Recreational vehicles',
      uiSchema: pages.recreationalVehicleRecords.fSRRecreationalVehicleUISchema,
      schema: pages.recreationalVehicleRecords.fSRRecreationalVehicleSchema,
      depends: formData =>
        formData.questions.hasRecreationalVehicle &&
        !formData['view:combinedFinancialStatusReport'],
      editModeOnReviewPage: true,
    },
    otherAssets: {
      path: 'other-assets',
      title: 'Other assets',
      uiSchema: pages.otherAssets.uiSchema,
      schema: pages.otherAssets.schema,
      depends: formData => !formData['view:enhancedFinancialStatusReport'],
    },
    otherAssetRecords: {
      path: 'other-asset-records',
      title: 'Other assets',
      uiSchema: pages.otherAssetRecords.uiSchema,
      schema: pages.otherAssetRecords.schema,
      depends: formData =>
        formData.questions.hasOtherAssets &&
        !formData['view:enhancedFinancialStatusReport'],
      editModeOnReviewPage: true,
    },
    // Other Household Assets
    otherAssetsChecklist: {
      path: 'other-assets-checklist',
      title: 'Other assets options',
      uiSchema: pages.otherAssetPages.otherAssetsChecklist.uiSchema,
      schema: pages.otherAssetPages.otherAssetsChecklist.schema,
      depends: formData => formData['view:enhancedFinancialStatusReport'],
    },
    otherAssetsValues: {
      path: 'other-assets-values',
      title: 'Other assets values',
      uiSchema: pages.otherAssetPages.otherAssetsValues.uiSchema,
      schema: pages.otherAssetPages.otherAssetsValues.schema,
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
};
