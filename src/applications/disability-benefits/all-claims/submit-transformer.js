import _ from 'platform/utilities/data';
import {
  transformForSubmit,
  filterViewFields,
} from 'platform/forms-system/src/js/helpers';
import removeDeeplyEmptyObjects from 'platform/utilities/data/removeDeeplyEmptyObjects';
import constants from 'vets-json-schema/dist/constants.json';
import {
  causeTypes,
  specialIssueTypes,
  CHAR_LIMITS,
  defaultDisabilityDescriptions,
} from './constants';

import { isBDD, truncateDescriptions } from './utils';
import {
  customReplacer,
  getClaimedConditionNames,
  setActionTypes,
  transformRelatedDisabilities,
  removeExtraData,
  removeRatedDisabilityFromNew,
  filterServicePeriods,
  stringifyRelatedDisabilities,
  cleanUpMailingAddress,
  addPTSDCause,
  addForm4142,
  addForm0781,
  addForm0781V2,
  addForm8940,
  addFileAttachments,
  normalizeIncreases,
  sanitizeNewDisabilities,
} from './utils/submit';
import { purgeToxicExposureData } from './utils/on-submit';

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

  // Save toxicExposure before filterEmptyObjects strips empty objects
  // This prevents false positives in backend monitoring by keeping
  // InProgressForm and Submitted data identical when no TE selections made
  const { toxicExposure } = form.data;
  const savedToxicExposure = toxicExposure
    ? _.cloneDeep(toxicExposure)
    : undefined;

  // Save feature flag before transformForSubmit strips it (not in schema)
  const savedToxicExposurePurgeFlag =
    form.data.disability526ToxicExposureOptOutDataPurge;

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

  /**
   * Restores and purges toxicExposure data after filterEmptyObjects.
   *
   * 1. Restores the original toxicExposure so empty objects match InProgressForm.
   * 2. Restores the feature flag (stripped by transformForSubmit since not in schema).
   * 3. Purges only explicit user opt-outs (not empty form scaffolding).
   * 4. Removes the feature flag from output (not user data).
   */
  const transformToxicExposure = formData => {
    let restoredData = savedToxicExposure
      ? _.set('toxicExposure', savedToxicExposure, formData)
      : formData;

    // Restore feature flag for purgeToxicExposureData to check
    if (savedToxicExposurePurgeFlag !== undefined) {
      restoredData = _.set(
        'disability526ToxicExposureOptOutDataPurge',
        savedToxicExposurePurgeFlag,
        restoredData,
      );
    }

    const purgedData = purgeToxicExposureData(restoredData);

    // Remove feature flag from output (not user data, only needed for purge logic)
    return _.unset('disability526ToxicExposureOptOutDataPurge', purgedData);
  };

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

  const addRequiredDescriptionsToDisabilitiesBDD = formData => {
    if (!isBDDForm || !formData.newDisabilities) {
      return formData;
    }

    const newDisabilitiesWithRequiredDescriptions =
      formData.newDisabilities.map(disability => {
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
      });

    return _.set(
      'newDisabilities',
      newDisabilitiesWithRequiredDescriptions,
      formData,
    );
  };

  const isSchemaNewRow = d => d?.condition && d?.cause;

  const splitNewDisabilities = formData => {
    if (!formData.newDisabilities) return formData;
    const clonedData = _.cloneDeep(formData);

    const valid = clonedData.newDisabilities.filter(isSchemaNewRow);

    const newPrimaryDisabilities = valid
      .filter(d => d.cause !== causeTypes.SECONDARY)
      .map(entry => truncateDescriptions(entry));

    const newSecondaryDisabilities = valid
      .filter(d => d.cause === causeTypes.SECONDARY)
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
          sideOfBody: sd.sideOfBody,
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

  const COUNTRY_CODE_TO_NAME = constants.countries.reduce((acc, country) => {
    acc[country.value] = country.label;
    return acc;
  }, {});
  const transformCountryCodeToName = formData => {
    if (!formData.mailingAddress?.country) {
      return formData;
    }

    const currentCountry = formData.mailingAddress.country;

    // Keep USA as-is, convert other country codes to full names
    if (currentCountry === 'USA') {
      return formData;
    }

    // If it's a country code, convert to full name
    if (COUNTRY_CODE_TO_NAME[currentCountry]) {
      return _.set(
        'mailingAddress.country',
        COUNTRY_CODE_TO_NAME[currentCountry],
        formData,
      );
    }

    // If it's already a full name, leave it as-is
    return formData;
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
    addBackRatedDisabilities, // Must run after filterEmptyObjects
    addBackAndTransformSeparationLocation, // Must run after filterEmptyObjects
    transformToxicExposure, // Restore + purge toxic exposure (must run after filterEmptyObjects)
    normalizeIncreases,
    sanitizeNewDisabilities,
    setActionTypes, // Must run after addBackRatedDisabilities
    filterRatedViewFields, // Must be run after setActionTypes
    filterServicePeriods,
    removeExtraData, // Removed data EVSS doesn't want
    cleanUpMailingAddress,
    addPOWSpecialIssues,
    addPTSDCause,
    addRequiredDescriptionsToDisabilitiesBDD,
    splitNewDisabilities,
    removeRatedDisabilityFromNew,
    transformSecondaryDisabilities,
    stringifyRelatedDisabilities,
    transformSeparationPayDate,
    sanitizeHomelessnessContact,
    addForm4142,
    addForm0781,
    addForm0781V2,
    addForm8940,
    addFileAttachments,
    transformCountryCodeToName,
    fullyDevelopedClaim,
  ].reduce(
    (formData, transformer) => transformer(formData),
    _.cloneDeep(form.data),
  );

  return JSON.stringify({ form526: transformedData });
}
