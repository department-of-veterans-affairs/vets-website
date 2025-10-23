import set from 'platform/utilities/data/set';
import unset from 'platform/utilities/data/unset';

import nonMilitaryJobsUi from 'platform/forms/definitions/nonMilitaryJobs';

export default function employmentHistoryPage(
  schema,
  usePostMilitaryJob = true,
) {
  let nonMilitaryJobs = schema.definitions.nonMilitaryJobs;
  let jobUISchema = set(
    ['ui:options', 'expandUnder'],
    'view:hasNonMilitaryJobs',
    nonMilitaryJobsUi,
  );

  if (!usePostMilitaryJob) {
    nonMilitaryJobs = unset(
      'items.properties.postMilitaryJob',
      nonMilitaryJobs,
    );
  } else {
    jobUISchema = set(
      'items.ui:order',
      ['postMilitaryJob', 'name', 'months', 'licenseOrRating'],
      jobUISchema,
    );
  }

  return {
    title: 'Employment history',
    path: 'employment/history',
    uiSchema: {
      'view:hasNonMilitaryJobs': {
        'ui:title':
          'Have you ever held a license of journeyman rating (for example, as a contractor or plumber) to practice a profession?',
        'ui:widget': 'yesNo',
      },
      nonMilitaryJobs: jobUISchema,
    },
    schema: {
      type: 'object',
      properties: {
        'view:hasNonMilitaryJobs': {
          type: 'boolean',
        },
        nonMilitaryJobs,
      },
    },
  };
}
