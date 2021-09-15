import _ from 'platform/utilities/data';

import {
  transformForSubmit,
  filterViewFields,
} from 'platform/forms-system/src/js/helpers';
import removeDeeplyEmptyObjects from 'platform/utilities/data/removeDeeplyEmptyObjects';

import {
  causeTypes,
  specialIssueTypes,
  ATTACHMENT_KEYS,
  CHAR_LIMITS,
  defaultDisabilityDescriptions,
} from './constants';

import { isBDD, isDisabilityPtsd, truncateDescriptions } from './utils';
import {
  customReplacer,
  transformProviderFacilities,
  getDisabilities,
  getDisabilityName,
  getClaimedConditionNames,
  setActionTypes,
  transformRelatedDisabilities,
  removeExtraData,
  getFlatIncidentKeys,
  getPtsdChangeText,
  filterServicePeriods,
  stringifyRelatedDisabilities,
  cleanUpPersonsInvolved,
  cleanUpMailingAddress,
} from './utils/submit';

import disabilityLabels from './content/disabilityLabels';

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
    savedRatedDisabilities
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

  // Add 'cause' of 'NEW' to new ptsd disabilities since form does not ask
  const addPTSDCause = formData =>
    formData.newDisabilities
      ? _.set(
          'newDisabilities',
          formData.newDisabilities.map(
            disability =>
              isDisabilityPtsd(disability.condition)
                ? _.set('cause', causeTypes.NEW, disability)
                : disability,
          ),
          formData,
        )
      : formData;

  // new disabilities that match a name on our mapped list need their
  // respective classification code added
  const addClassificationCodeToNewDisabilities = formData => {
    const { newDisabilities } = formData;
    if (!newDisabilities) {
      return formData;
    }

    const flippedDisabilityLabels = {};
    Object.entries(disabilityLabels).forEach(([code, description]) => {
      flippedDisabilityLabels[description?.toLowerCase()] = code;
    });

    const newDisabilitiesWithClassificationCodes = newDisabilities.map(
      disability => {
        const { condition } = disability;
        if (!condition) {
          return disability;
        }
        const loweredDisabilityName = condition?.toLowerCase();
        return flippedDisabilityLabels[loweredDisabilityName]
          ? _.set(
              'classificationCode',
              flippedDisabilityLabels[loweredDisabilityName],
              disability,
            )
          : disability;
      },
    );

    return _.set(
      'newDisabilities',
      newDisabilitiesWithClassificationCodes,
      formData,
    );
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

        return Object.assign({}, disability, disabilityDescription);
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

  const addForm4142 = formData => {
    if (!formData.providerFacility) {
      return formData;
    }
    const clonedData = _.cloneDeep(formData);
    clonedData.form4142 = {
      ...(clonedData.limitedConsent && {
        limitedConsent: clonedData.limitedConsent,
      }),
      ...(clonedData.providerFacility && {
        providerFacility: transformProviderFacilities(
          clonedData.providerFacility,
        ),
      }),
    };
    delete clonedData.limitedConsent;
    delete clonedData.providerFacility;
    return clonedData;
  };

  const addForm0781 = formData => {
    const clonedData = _.cloneDeep(formData);
    const incidentKeys = getFlatIncidentKeys();
    const incidents = incidentKeys
      .filter(incidentKey => clonedData[incidentKey])
      .map(incidentKey => ({
        ...cleanUpPersonsInvolved(clonedData[incidentKey]),
        personalAssault: incidentKey.includes('secondary'),
      }));
    incidentKeys.forEach(incidentKey => {
      delete clonedData[incidentKey];
    });
    if (incidents.length > 0) {
      clonedData.form0781 = {
        incidents,
        remarks: clonedData.additionalRemarks781,
        additionalIncidentText: clonedData.additionalIncidentText,
        additionalSecondaryIncidentText:
          clonedData.additionalSecondaryIncidentText,
        otherInformation: [
          ...getPtsdChangeText(clonedData.physicalChanges),
          _.get('physicalChanges.otherExplanation', clonedData, ''),
          ...getPtsdChangeText(clonedData.socialBehaviorChanges),
          _.get('socialBehaviorChanges.otherExplanation', clonedData, ''),
          ...getPtsdChangeText(clonedData.mentalChanges),
          _.get('mentalChanges.otherExplanation', clonedData, ''),
          ...getPtsdChangeText(clonedData.workBehaviorChanges),
          _.get('workBehaviorChanges.otherExplanation', clonedData, ''),
          _.get('additionalChanges', clonedData, ''),
        ].filter(info => info.length > 0),
      };
      delete clonedData.physicalChanges;
      delete clonedData.socialBehaviorChanges;
      delete clonedData.mentalChanges;
      delete clonedData.workBehaviorChanges;
      delete clonedData.additionalChanges;
      delete clonedData.additionalRemarks781;
      delete clonedData.additionalIncidentText;
      delete clonedData.additionalSecondaryIncidentText;
    }
    return clonedData;
  };

  const addForm8940 = formData => {
    const clonedData = _.cloneDeep(formData);
    const { unemployability } = clonedData;

    if (unemployability) {
      const disabilities = getDisabilities(formData);

      clonedData.form8940 = {
        unemployability: {
          ...unemployability,
          disabilityPreventingEmployment: disabilities
            .filter(disability => disability.unemployabilityDisability)
            .map(disability => getDisabilityName(disability))
            .join(),
          underDoctorHopitalCarePast12M:
            unemployability.underDoctorsCare || unemployability.hospitalized,
          mostEarningsInAYear: (
            unemployability.mostEarningsInAYear || ''
          ).toString(),
          disabilityPreventMilitaryDuties:
            unemployability.disabilityPreventMilitaryDuties === 'yes',
        },
      };

      delete clonedData.form8940.unemployability.underDoctorsCare;
      delete clonedData.form8940.unemployability.hospitalized;
      delete clonedData.unemployability;
    }

    return clonedData;
  };
  // Flatten all attachment pages into attachments ARRAY
  const addFileAttachments = formData => {
    const clonedData = _.cloneDeep(formData);
    let attachments = [];

    ATTACHMENT_KEYS.forEach(key => {
      const documentArr = _.get(key, clonedData, []);
      attachments = [...attachments, ...documentArr];
      delete clonedData[key];
    });
    return { ...clonedData, ...(attachments.length && { attachments }) };
  };

  const fullyDevelopedClaim = formData => {
    if (isBDD) {
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
    setActionTypes, // Must run after addBackRatedDisabilities
    filterRatedViewFields, // Must be run after setActionTypes
    filterServicePeriods,
    removeExtraData, // Removed data EVSS doesn't want
    cleanUpMailingAddress,
    addPOWSpecialIssues,
    addPTSDCause,
    addClassificationCodeToNewDisabilities,
    addRequiredDescriptionsToDisabilitiesBDD,
    splitNewDisabilities,
    transformSecondaryDisabilities,
    stringifyRelatedDisabilities,
    transformSeparationPayDate,
    sanitizeHomelessnessContact,
    addForm4142,
    addForm0781,
    addForm8940,
    addFileAttachments,
    fullyDevelopedClaim,
  ].reduce(
    (formData, transformer) => transformer(formData),
    _.cloneDeep(form.data),
  );

  return JSON.stringify({ form526: transformedData });
}
