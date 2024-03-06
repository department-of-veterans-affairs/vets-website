import { toxicExposureConditions, gulfWar1990Locations } from '..';
import {
  conditionsPageTitle,
  gulfWar1990PageTitle,
  isClaimingTECondition,
  makeGulfWar1990LocationPages,
  showToxicExposurePages,
} from '../../content/toxicExposure';
import { isClaimingNew } from '../../utils/index';

export const toxicExposurePages = {
  toxicExposureConditions: {
    title: conditionsPageTitle,
    path: 'toxic-exposure-conditions',
    depends: formData =>
      isClaimingNew(formData) && showToxicExposurePages(formData),
    uiSchema: toxicExposureConditions.uiSchema,
    schema: toxicExposureConditions.schema,
  },
  gulfWar1990Locations: {
    title: gulfWar1990PageTitle,
    path: 'gulf-war-hazard-1990',
    depends: formData => isClaimingTECondition(formData),
    uiSchema: gulfWar1990Locations.uiSchema,
    schema: gulfWar1990Locations.schema,
  },
  ...makeGulfWar1990LocationPages(),
  // 'gulfWar1990Locations-afghanistan': {
  //   title: gulfWar1990PageTitle,
  //   path: 'gulfWar1990Locations-afghanistan',
  //   uiSchema: {
  //     'ui:title': formTitle(gulfWar1990PageTitle),
  //     'ui:description': dateRangePageDescription(1, 3, 'Afghanistan'),
  //     gulfWar1990Locations: {
  //       afghanistan: {
  //         startDate: {
  //           ...currentOrPastDateUI('Service start date (approximate)'),
  //           'ui:options': {
  //             // monthYear: true,
  //           },
  //         },
  //         endDate: {
  //           ...currentOrPastDateUI('Service end date (approximate)'),
  //           'ui:options': {
  //             // monthYear: true,
  //           },
  //         },
  //       },
  //     },
  //     'view:gulfWar1990AdditionalInfo': {
  //       'ui:description': gulfWar1990LocationsAdditionalInfo,
  //     },
  //   },
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       gulfWar1990Locations: {
  //         type: 'object',
  //         properties: {
  //           afghanistan: {
  //             type: 'object',
  //             properties: {
  //               startDate: {
  //                 type: 'string',
  //                 format: 'date',
  //               },
  //               endDate: {
  //                 type: 'string',
  //                 format: 'date',
  //               },
  //             },
  //           },
  //         },
  //       },
  //       'view:gulfWar1990AdditionalInfo': {
  //         type: 'object',
  //         properties: {},
  //       },
  //     },
  //   },
  // },
};
