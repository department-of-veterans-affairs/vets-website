//  Functionality for using Drupal as the source of truth (DSOT) for EHR data
import environment from 'platform/utilities/environment';
import { connectDrupalStaticDataFile } from 'platform/utilities/drupal-static-data';

export const removeVhaPrefix = vhaId => {
  const regex = /vha_/;
  return vhaId.replace(regex, '');
};

export const cernerFacilitiesFromVamcEhrData = (
  vamcEhrData,
  includeStaged = false,
) => {
  const entities = vamcEhrData?.data?.nodeQuery?.entities;
  if (entities) {
    const flattened = entities.map(entity => ({
      vhaId: removeVhaPrefix(entity?.fieldFacilityLocatorApiId),
      vamcFacilityName: entity?.title,
      vamcSystemName: entity?.fieldRegionPage?.entity?.title,
      ehr: entity?.fieldRegionPage?.entity?.fieldVamcEhrSystem,
    }));

    if (includeStaged) {
      return flattened;
    }

    return flattened.filter(facility => facility.ehr === 'cerner');
  }

  return [];
};

/**
 * TODO:
 *
 * Some or all of this preProcess logic can be moved to
 * the postProcess function during the content-build.
 * This would take some load off of the browser and place
 * it on the server during the build,
 * thus improving the veteran experience.
 */
export const preProcessEhrData = data => {
  // include cerner_staged facilities only in non-production environments
  let includeStaged = false;
  if (!environment.isProduction()) {
    includeStaged = true;
  }
  return cernerFacilitiesFromVamcEhrData(data, includeStaged);
};

export const connectDrupalSourceOfTruthCerner = dispatch => {
  connectDrupalStaticDataFile(dispatch, {
    fileName: 'vamc-ehr.json',
    preProcess: preProcessEhrData,
    statePropName: 'cernerFacilities',
  });
};
