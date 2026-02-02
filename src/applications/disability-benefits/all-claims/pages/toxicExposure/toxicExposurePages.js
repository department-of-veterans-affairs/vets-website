import {
  additionalExposuresDetails,
  gulfWar1990Locations,
  toxicExposureConditions,
  gulfWar1990Details,
  gulfWar1990Summary,
  gulfWar2001Locations,
  gulfWar2001Details,
  gulfWar2001Summary,
  additionalExposures,
  herbicideLocations,
  herbicideDetails,
  herbicideOtherLocations,
  herbicideSummary,
  specifyOtherExposures,
  additionalExposuresSummary,
} from '..';
import { TE_URL_PREFIX } from '../../constants';
import {
  additionalExposuresPageTitle,
  conditionsPageTitle,
  getHerbicideOtherLocationsReviewTitle,
  getHerbicideOtherLocationsSubtitle,
  getOtherFieldDescription,
  getSpecifyOtherExposuresReviewTitle,
  getSpecifyOtherExposuresSubtitle,
  gulfWar1990PageTitle,
  gulfWar2001PageTitle,
  herbicidePageTitle,
  isClaimingTECondition,
  showSummaryPage,
  showToxicExposurePages,
} from '../../content/toxicExposure';

export const toxicExposurePages = {
  toxicExposureConditions: {
    title: conditionsPageTitle,
    path: `${TE_URL_PREFIX}/conditions`,
    depends: formData => showToxicExposurePages(formData),
    uiSchema: toxicExposureConditions.uiSchema,
    schema: toxicExposureConditions.schema,
  },
  gulfWar1990Locations: {
    title: gulfWar1990PageTitle,
    path: `${TE_URL_PREFIX}/gulf-war-1990`,
    depends: formData => isClaimingTECondition(formData),
    uiSchema: gulfWar1990Locations.uiSchema,
    schema: gulfWar1990Locations.schema,
  },
  ...gulfWar1990Details.makePages(),
  gulfWar1990Summary: {
    title: 'Summary of service after August 2, 1990',
    path: `${TE_URL_PREFIX}/gulf-war-1990-summary`,
    depends: formData => showSummaryPage(formData, 'gulfWar1990'),
    uiSchema: gulfWar1990Summary.uiSchema,
    schema: gulfWar1990Summary.schema,
  },
  gulfWar2001Locations: {
    title: gulfWar2001PageTitle,
    path: `${TE_URL_PREFIX}/gulf-war-2001`,
    depends: formData => isClaimingTECondition(formData),
    uiSchema: gulfWar2001Locations.uiSchema,
    schema: gulfWar2001Locations.schema,
  },
  ...gulfWar2001Details.makePages(),
  gulfWar2001Summary: {
    title: 'Summary of service post-9/11',
    path: `${TE_URL_PREFIX}/gulf-war-2001-summary`,
    depends: formData => showSummaryPage(formData, 'gulfWar2001'),
    uiSchema: gulfWar2001Summary.uiSchema,
    schema: gulfWar2001Summary.schema,
  },
  herbicideLocations: {
    title: herbicidePageTitle,
    path: `${TE_URL_PREFIX}/herbicide`,
    depends: formData => isClaimingTECondition(formData),
    uiSchema: herbicideLocations.uiSchema,
    schema: herbicideLocations.schema,
  },
  ...herbicideDetails.makePages(),
  herbicideOtherLocations: {
    title: getHerbicideOtherLocationsSubtitle,
    reviewTitle: getHerbicideOtherLocationsReviewTitle,
    path: `${TE_URL_PREFIX}/herbicide-location-other`,
    depends: formData =>
      isClaimingTECondition(formData) &&
      getOtherFieldDescription(formData, 'otherHerbicideLocations'),
    uiSchema: herbicideOtherLocations.uiSchema,
    schema: herbicideOtherLocations.schema,
  },
  herbicideSummary: {
    title: 'Summary of Agent Orange locations',
    path: `${TE_URL_PREFIX}/herbicide-summary`,
    depends: formData =>
      showSummaryPage(formData, 'herbicide', 'otherHerbicideLocations'),
    uiSchema: herbicideSummary.uiSchema,
    schema: herbicideSummary.schema,
  },
  additionalExposures: {
    title: additionalExposuresPageTitle,
    path: `${TE_URL_PREFIX}/additional-exposures`,
    depends: formData => isClaimingTECondition(formData),
    uiSchema: additionalExposures.uiSchema,
    schema: additionalExposures.schema,
  },
  ...additionalExposuresDetails.makePages(),
  specifyOtherExposures: {
    title: getSpecifyOtherExposuresSubtitle,
    reviewTitle: getSpecifyOtherExposuresReviewTitle,
    path: `${TE_URL_PREFIX}/additional-exposure-other`,
    depends: formData =>
      isClaimingTECondition(formData) &&
      getOtherFieldDescription(formData, 'specifyOtherExposures'),
    uiSchema: specifyOtherExposures.uiSchema,
    schema: specifyOtherExposures.schema,
  },
  additionalExposuresSummary: {
    title: 'Summary of Other toxic exposures',
    path: `${TE_URL_PREFIX}/additional-exposure-summary`,
    depends: formData =>
      showSummaryPage(formData, 'otherExposures', 'specifyOtherExposures'),
    uiSchema: additionalExposuresSummary.uiSchema,
    schema: additionalExposuresSummary.schema,
  },
};
