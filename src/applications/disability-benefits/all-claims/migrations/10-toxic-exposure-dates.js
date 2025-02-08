import omit from 'platform/utilities/data/omit';
import clone from 'platform/utilities/data/clone';

/**
 * Trim the startDate and endDate within the given object, retaining any additional fields that may be present.
 *
 * @param {*} objectWithDates
 * @returns new object with trimmed dates
 */
function trimDates(objectWithDates) {
  const res = clone(objectWithDates);
  if (objectWithDates.startDate) {
    res.startDate = objectWithDates.startDate.substring(0, 7);
  }
  if (objectWithDates.endDate) {
    res.endDate = objectWithDates.endDate.substring(0, 7);
  }
  return res;
}

/**
 * Remove day field from toxic exposure dates. For example
 *  before: 2001-01-01
 *  after: 2001-01
 * */
export default function trimToxicExposureDates(savedData) {
  const { toxicExposure } = savedData.formData;
  const objectsWithDates = [
    'gulfWar1990Details',
    'gulfWar2001Details',
    'herbicideDetails',
    'otherExposuresDetails',
  ];

  if (toxicExposure) {
    const updatedToxicExposure = clone(toxicExposure);

    // for each object
    for (const [wrapper, wrapperValue] of Object.entries(toxicExposure)) {
      if (objectsWithDates.includes(wrapper)) {
        // for each location/item
        for (const [item, itemValue] of Object.entries(wrapperValue)) {
          updatedToxicExposure[wrapper][item] = trimDates(itemValue);
        }
      }
    }

    // 'other' fields that are flatter objects with dates
    updatedToxicExposure.specifyOtherExposures = trimDates(
      toxicExposure.specifyOtherExposures,
    );

    updatedToxicExposure.otherHerbicideLocations = trimDates(
      toxicExposure.otherHerbicideLocations,
    );

    const formData = omit('toxicExposure', savedData.formData);
    formData.toxicExposure = updatedToxicExposure;
    return {
      formData,
      metadata: savedData.metadata,
    };
  }

  return savedData;
}
