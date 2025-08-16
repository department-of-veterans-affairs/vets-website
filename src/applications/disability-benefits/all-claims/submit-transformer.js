import _ from 'platform/utilities/data';
import {
  transformForSubmit,
  filterViewFields,
} from 'platform/forms-system/src/js/helpers';
import removeDeeplyEmptyObjects from 'platform/utilities/data/removeDeeplyEmptyObjects';

import {
  causeTypes,
  specialIssueTypes,
  CHAR_LIMITS,
  defaultDisabilityDescriptions,
  POLICE_REPORT_LOCATION_FIELDS,
} from './constants';

import { isBDD, truncateDescriptions } from './utils';
import {
  customReplacer,
  getClaimedConditionNames,
  setActionTypes,
  transformRelatedDisabilities,
  removeExtraData,
  filterServicePeriods,
  stringifyRelatedDisabilities,
  cleanUpMailingAddress,
  addPTSDCause,
  addForm4142,
  addForm0781,
  addForm0781V2,
  addForm8940,
  addFileAttachments,
} from './utils/submit';

export function transform(formConfig, form) {
  // Grab isBDD before things are changed/deleted
  const isBDDForm = isBDD(form.data);
  // Grab ratedDisabilities before they're deleted in case the page is inactive
  // We need to send all of these to vets-api even if the veteran doesn't apply
  // for an increase on any of them
  const { ratedDisabilities } = form.data;
  const savedRatedDisabilities = ratedDisabilities
    ? _.cloneDeep(ratedDisabilities)
    : undefined;

  const { separationLocation } = form.data.serviceInformation;
  const savedSeparationLocation = separationLocation
    ? _.cloneDeep(separationLocation)
    : undefined;

  // Preserve original 0781 events to restore fields stripped by schema filtering
  const savedEvents = Array.isArray(form.data.events)
    ? _.cloneDeep(form.data.events)
    : undefined;

  // Define the transformations
  const filterEmptyObjects = formData =>
    removeDeeplyEmptyObjects(
      JSON.parse(
        transformForSubmit(
          formConfig,
          { ...form, data: formData },
          customReplacer,
        ),
      ),
    );

  const addBackRatedDisabilities = formData =>
    savedRatedDisabilities?.length
      ? _.set('ratedDisabilities', savedRatedDisabilities, formData)
      : formData;

  const addBackAndTransformSeparationLocation = formData =>
    formData.serviceInformation?.separationLocation
      ? _.set(
          'serviceInformation.separationLocation',
          {
            separationLocationCode: savedSeparationLocation.id,
            separationLocationName: savedSeparationLocation.label,
          },
          formData,
        )
      : formData;

  const filterRatedViewFields = formData => filterViewFields(formData);

  const addPOWSpecialIssues = formData => {
    if (!formData.newDisabilities) {
      return formData;
    }
    const clonedData = _.cloneDeep(formData);
    if (clonedData.powDisabilities) {
      // Add POW specialIssue to new conditions
      const powDisabilities = transformRelatedDisabilities(
        clonedData.powDisabilities,
        getClaimedConditionNames(formData),
      ).map(name => name?.toLowerCase());
      clonedData.newDisabilities = clonedData.newDisabilities.map(d => {
        if (powDisabilities.includes(d.condition?.toLowerCase())) {
          const newSpecialIssues = (d.specialIssues || []).slice();
          newSpecialIssues.push(specialIssueTypes.POW);
          return _.set('specialIssues', newSpecialIssues, d);
        }
        return d;
      });
      delete clonedData.powDisabilities;
    }
    return clonedData;
  };

  // Some police report location fields (agency, city, state, township, country)
  // are not part of the base json schema and get filtered out by transformForSubmit.
  // If the user indicated a police report for an event, restore those fields
  // from the original form data so they can be included in form0781 later.
  const restorePoliceReportLocationFields = formData => {
    if (!savedEvents || !Array.isArray(formData.events)) {
      return formData;
    }

    const mergedEvents = formData.events.map((evt = {}, index) => {
      const original = savedEvents[index] || {};

      const policeTrue = Boolean(
        (evt.reports && evt.reports.police === true) ||
          (original.reports && original.reports.police === true),
      );

      if (!policeTrue) return evt;

      const restored = { ...evt };
      POLICE_REPORT_LOCATION_FIELDS.forEach(field => {
        if (
          typeof original[field] === 'string' &&
          original[field].trim().length > 0
        ) {
          restored[field] = original[field];
        }
      });
      return restored;
    });

    return _.set('events', mergedEvents, formData);
  };

  const addRequiredDescriptionsToDisabilitiesBDD = formData => {
    if (!isBDDForm || !formData.newDisabilities) {
      return formData;
    }

    const newDisabilitiesWithRequiredDescriptions = formData.newDisabilities.map(
      disability => {
        const disabilityDescription = {};

        switch (disability.cause) {
          case causeTypes.NEW:
            disabilityDescription.primaryDescription =
              defaultDisabilityDescriptions.primaryDescription;
            break;
          case causeTypes.SECONDARY:
            disabilityDescription.causedByDisabilityDescription =
              defaultDisabilityDescriptions.causedByDisabilityDescription;
            break;
          case causeTypes.WORSENED:
            disabilityDescription.worsenedDescription =
              defaultDisabilityDescriptions.worsenedDescription;
            disabilityDescription.worsenedEffects =
              defaultDisabilityDescriptions.worsenedEffects;
            break;
          case causeTypes.VA:
            disabilityDescription.vaMistreatmentDescription =
              defaultDisabilityDescriptions.vaMistreatmentDescription;
            break;
          default:
        }

        return { ...disability, ...disabilityDescription };
      },
    );

    return _.set(
      'newDisabilities',
      newDisabilitiesWithRequiredDescriptions,
      formData,
    );
  };

  // newDisabilities -> newPrimaryDisabilities & newSecondaryDisabilities
  const splitNewDisabilities = formData => {
    if (!formData.newDisabilities) {
      return formData;
    }
    const clonedData = _.cloneDeep(formData);
    // Split newDisabilities into primary and secondary arrays for backend
    const newPrimaryDisabilities = clonedData.newDisabilities
      .filter(disability => disability.cause !== causeTypes.SECONDARY)
      .map(entry => truncateDescriptions(entry));
    const newSecondaryDisabilities = clonedData.newDisabilities
      .filter(disability => disability.cause === causeTypes.SECONDARY)
      .map(entry => truncateDescriptions(entry));
    if (newPrimaryDisabilities.length) {
      clonedData.newPrimaryDisabilities = newPrimaryDisabilities;
    }
    if (newSecondaryDisabilities.length) {
      clonedData.newSecondaryDisabilities = newSecondaryDisabilities;
    }
    delete clonedData.newDisabilities;
    return clonedData;
  };

  // transform secondary disabilities into primary, with description appended
  const transformSecondaryDisabilities = formData => {
    if (!formData.newSecondaryDisabilities) {
      return formData;
    }

    const clonedData = _.cloneDeep(formData);

    const transformedSecondaries = clonedData.newSecondaryDisabilities.map(
      sd => {
        // prepend caused by condition to primary description
        const descString = [
          'Secondary to ',
          sd.causedByDisability,
          '\n',
          sd.causedByDisabilityDescription,
        ].join('');

        return {
          condition: sd.condition,
          cause: causeTypes.NEW,
          classificationCode: sd.classificationCode,
          // truncate description to 400 characters
          primaryDescription: descString.substring(
            0,
            CHAR_LIMITS.primaryDescription,
          ),
        };
      },
    );

    clonedData.newPrimaryDisabilities = (
      clonedData.newPrimaryDisabilities || []
    ).concat(transformedSecondaries);

    delete clonedData.newSecondaryDisabilities;
    return clonedData;
  };

  const transformSeparationPayDate = formData => {
    if (!formData.separationPayDate) {
      return formData;
    }

    // Format separationPayDate as 'YYYY-MM-DD'
    return _.set(
      'separationPayDate',
      `${formData.separationPayDate}-XX-XX`,
      formData,
    );
  };

  /**
   * We want veterans to be able to type in all chars in the homelessness POC
   * name field, but we only want to send allowed characters (per schema) to
   * vets-api
   * @param {object} formData
   * @returns {object} either formData, or if homelessness contact name exists,
   * a copy of formData with the homelessness POC name sanitized
   */
  const sanitizeHomelessnessContact = formData => {
    const { homelessnessContact } = formData;
    if (!homelessnessContact || !homelessnessContact.name) {
      return formData;
    }

    // When name is present, phoneNumber is required and vice-versa
    // But neither field is required unless the other is present
    const sanitizedHomelessnessContact = {
      name: homelessnessContact.name
        .replace(/[^a-zA-Z0-9-/' ]/g, ' ')
        .trim()
        .replace(/\s{2,}/g, ' '),
      phoneNumber: homelessnessContact.phoneNumber,
    };

    return _.set('homelessnessContact', sanitizedHomelessnessContact, formData);
  };

  const fullyDevelopedClaim = formData => {
    if (isBDDForm) {
      const clonedData = _.cloneDeep(formData);
      // standardClaim = false means it's a fully developed claim (FDC); but
      // this value is ignored in the BDD flow unless the submission falls out
      // of BDD status. Then we want it to be a FDC
      return { ...clonedData, standardClaim: false };
    }
    return formData;
  };
  // End transformation definitions

  // Apply the transformations
  const transformedData = [
    filterEmptyObjects,
    restorePoliceReportLocationFields,
    addBackRatedDisabilities, // Must run after filterEmptyObjects
    addBackAndTransformSeparationLocation, // Must run after filterEmptyObjects
    setActionTypes, // Must run after addBackRatedDisabilities
    filterRatedViewFields, // Must be run after setActionTypes
    filterServicePeriods,
    removeExtraData, // Removed data EVSS doesn't want
    cleanUpMailingAddress,
    addPOWSpecialIssues,
    addPTSDCause,
    addRequiredDescriptionsToDisabilitiesBDD,
    splitNewDisabilities,
    transformSecondaryDisabilities,
    stringifyRelatedDisabilities,
    transformSeparationPayDate,
    sanitizeHomelessnessContact,
    addForm4142,
    addForm0781,
    addForm0781V2,
    addForm8940,
    addFileAttachments,
    fullyDevelopedClaim,
  ].reduce(
    (formData, transformer) => transformer(formData),
    _.cloneDeep(form.data),
  );

  return JSON.stringify({ form526: transformedData });
}
