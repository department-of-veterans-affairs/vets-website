import environment from 'platform/utilities/environment';
import { removeVhaPrefix } from '../utils';

/**
 * TODO:
 *
 * Some or all of this preProcess logic can be moved to
 * the postProcess function during the content-build.
 * This would take some load off of the browser and place
 * it on the server during the build,
 * thus improving the veteran experience.
 */
const normalizeAndCategorizeFacility = (
  collection = {},
  facilityEntity = [],
  includeCernerStaged = [],
) => {
  const updatedCollection = { ...collection };
  const facility = {
    vhaId: removeVhaPrefix(facilityEntity?.fieldFacilityLocatorApiId),
    vamcFacilityName: facilityEntity?.title,
    vamcSystemName: facilityEntity?.fieldRegionPage?.entity?.title,
    // vamcSystemName: facilityEntity?.title,
    ehr: facilityEntity?.fieldRegionPage?.entity?.fieldVamcEhrSystem,
  };

  if (facility.vhaId) {
    updatedCollection.ehrDataByVhaId[facility.vhaId] = facility;
  }

  if (facility.ehr === 'vista') {
    updatedCollection.vistaFacilities.push(facility);
  } else if (facility.ehr === 'cerner') {
    updatedCollection.cernerFacilities.push(facility);
  } else if (facility.ehr === 'cerner_staged') {
    if (includeCernerStaged) {
      updatedCollection.cernerFacilities.push(facility);
    } else {
      updatedCollection.vistaFacilities.push(facility);
    }
  }

  return collection;
};

export const normalizeAndCategorizeFacilities = (
  vamcEhrData,
  includeCernerStaged = false,
) => {
  const entities = vamcEhrData?.data?.nodeQuery?.entities;
  if (entities) {
    return entities.reduce(
      (acc, entity) =>
        normalizeAndCategorizeFacility(acc, entity, includeCernerStaged),
      {
        ehrDataByVhaId: {},
        cernerFacilities: [],
        vistaFacilities: [],
      },
    );
  }

  return {
    ehrDataByVhaId: {},
    cernerFacilities: [],
    vistaFacilities: [],
  };
};

export const preProcessEhrData = vamcEhrData => {
  // include cerner_staged facilities only in non-production environments
  let includeCernerStaged = false;
  if (!environment.isProduction()) {
    includeCernerStaged = true;
  }

  return normalizeAndCategorizeFacilities(vamcEhrData, includeCernerStaged);
};
