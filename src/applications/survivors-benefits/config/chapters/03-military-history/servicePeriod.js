import {
  titleUI,
  checkboxGroupUI,
  checkboxGroupSchema,
  currentOrPastDateDigitsUI,
  currentOrPastDateSchema,
  currentOrPastDateUI,
  textUI,
  textSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  title: 'Veteran information',
  path: 'veteran/service-period',
  uiSchema: {
    ...titleUI('Veteran information'),
    branchOfService: checkboxGroupUI({
      title: 'Branch of service',
      required: true,
      labels: {
        army: 'Army',
        navy: 'Navy',
        airForce: 'Air Force',
        coastGuard: 'Coast Guard',
        marineCorps: 'Marine Corps',
        spaceForce: 'Space Force',
        usphs: 'USPHS',
        noaa: 'NOAA',
      },
    }),
    dateInitiallyEnteredActiveDuty: currentOrPastDateDigitsUI({
      title: 'Date initially entered active duty',
      hint:
        'Enter 1 or 2 digits for the month and day and 4 digits for the year.',
    }),
    finalReleaseDateFromActiveDuty: currentOrPastDateUI({
      title: 'Final release date from active duty',
      monthSelect: false,
    }),
    cityStateOrForeignCountry: textUI({
      title: 'City, state, or foreign country',
    }),
  },
  schema: {
    type: 'object',
    required: [
      'branchOfService',
      'dateInitiallyEnteredActiveDuty',
      'finalReleaseDateFromActiveDuty',
      'cityStateOrForeignCountry',
    ],
    properties: {
      branchOfService: checkboxGroupSchema([
        'army',
        'navy',
        'airForce',
        'coastGuard',
        'marineCorps',
        'spaceForce',
        'usphs',
        'noaa',
      ]),
      dateInitiallyEnteredActiveDuty: currentOrPastDateSchema,
      finalReleaseDateFromActiveDuty: currentOrPastDateSchema,
      cityStateOrForeignCountry: textSchema,
    },
  },
};
