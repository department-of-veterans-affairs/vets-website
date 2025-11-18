import React from 'react';
import set from 'platform/utilities/data/set';
import get from 'platform/utilities/data/get';
import omit from 'platform/utilities/data/omit';
import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';
import Autocomplete from '../components/Autocomplete';
import disabilityLabelsRevised from '../content/disabilityLabelsRevised';
import NewDisability from '../components/NewDisability';
import ConfirmationNewDisabilities from '../components/confirmationFields/ConfirmationNewDisabilities';
import {
  validateDisabilityName,
  requireDisability,
  limitNewDisabilities,
  missingConditionMessage,
} from '../validations';
import {
  newConditionsOnly,
  newAndIncrease,
  hasClaimedConditions,
  claimingNew,
  sippableId,
} from '../utils';
import {
  addDisabilitiesInstructions,
  increaseAndNewAlertRevised,
  newOnlyAlertRevised,
} from '../content/addDisabilities';

const getNewDisabilitiesProps = schema => {
  const nd = schema?.definitions?.newDisabilities?.items;
  // New shape (refactor): first 526 schema anyOf branch is the full NEW/SECONDARY/etc. object
  if (nd?.anyOf?.[0]?.properties) return nd.anyOf[0].properties;
  // Old shape (pre-refactor)
  if (nd?.properties) return nd.properties;
  return {};
};

const NEW_PROPS = getNewDisabilitiesProps(fullSchema);
const { condition } = NEW_PROPS;

const autocompleteUiSchema = {
  'ui:field': data => (
    <Autocomplete
      availableResults={Object.values(disabilityLabelsRevised)}
      debounceDelay={200}
      id={data.idSchema.$id}
      formData={data.formData}
      label="Enter your condition"
      onChange={data.onChange}
    />
  ),
  'ui:validations': [validateDisabilityName, limitNewDisabilities],
  'ui:required': () => true,
  'ui:errorMessages': {
    required: missingConditionMessage,
  },
  'ui:options': {
    hideLabelText: true,
  },
};

const platformArrayFieldWithAutocomplete = {
  'ui:description': addDisabilitiesInstructions,
  'ui:options': {
    itemName: 'Condition',
    itemAriaLabel: data => data.condition,
    viewField: NewDisability,
    customTitle: ' ',
    confirmRemove: true,
    useDlWrap: true,
    useVaCards: true,
    showSave: true,
    reviewMode: true,
    keepInPageOnReview: false,
  },
  'ui:validations': [requireDisability],
  items: {
    condition: autocompleteUiSchema,
  },
};

export const uiSchema = {
  newDisabilities: platformArrayFieldWithAutocomplete,
  // This object only shows up when the user tries to continue without claiming either a rated or new condition
  'view:newDisabilityErrors': {
    'view:newOnlyAlert': {
      'ui:description': newOnlyAlertRevised,
      'ui:options': {
        hideIf: formData =>
          !(newConditionsOnly(formData) && !claimingNew(formData)),
      },
    },
    // Only show this alert if the veteran is claiming both rated and new
    // conditions but no rated conditions were selected
    'view:increaseAndNewAlert': {
      'ui:description': increaseAndNewAlertRevised,
      'ui:options': {
        hideIf: formData =>
          !(newAndIncrease(formData) && !hasClaimedConditions(formData)),
      },
    },
  },
  'ui:confirmationField': ConfirmationNewDisabilities,
};

export const schema = {
  type: 'object',
  properties: {
    newDisabilities: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        properties: {
          condition,
        },
      },
    },
    'view:newDisabilityErrors': {
      type: 'object',
      properties: {
        'view:newOnlyAlert': { type: 'object', properties: {} },
        'view:increaseAndNewAlert': { type: 'object', properties: {} },
      },
    },
  },
};

const indexOfFirstChange = (oldArr, newArr) => {
  for (let i = 0; i < newArr.length; i += 1) {
    if (oldArr[i] !== newArr[i]) return i;
  }

  // No difference found
  return undefined;
};

const deleted = (oldArr, newArr) => {
  const i = indexOfFirstChange(oldArr, newArr);
  // If no difference was found, the last item was deleted
  return i !== undefined ? oldArr[i] : oldArr[oldArr.length - 1];
};

const removeDisability = (deletedElement, formData) => {
  const removeFromTreatedDisabilityNames = (disability, data) => {
    const path = 'vaTreatmentFacilities';
    const facilities = get(path, data);
    if (!facilities) return data;

    return set(
      path,
      facilities.map(f =>
        set(
          'treatedDisabilityNames',
          omit(
            [sippableId(disability.condition)],
            get('treatedDisabilityNames', f),
          ),
          f,
        ),
      ),
      data,
    );
  };

  const removeFromPow = (disability, data) => {
    const path = 'view:isPow.powDisabilities';
    const powDisabilities = get(path, data);
    if (!powDisabilities) return data;

    return set(
      path,
      omit([sippableId(disability.condition)], powDisabilities),
      data,
    );
  };

  return removeFromPow(
    deletedElement,
    removeFromTreatedDisabilityNames(deletedElement, formData),
  );
};

// Find the old name -> change to new name
const changeDisabilityName = (oldData, newData, changedIndex) => {
  const oldId = sippableId(oldData.newDisabilities[changedIndex]?.condition);
  const newId = sippableId(newData.newDisabilities[changedIndex]?.condition);

  let result = removeDisability(oldData.newDisabilities[changedIndex], newData);
  // TODO make this also update the value in the providerFacilities
  // Add in the new property with the old value
  const facilitiesPath = 'vaTreatmentFacilities';
  const facilities = get(facilitiesPath, result);
  const oldFacilities = get(facilitiesPath, oldData);
  if (facilities && oldFacilities) {
    result = set(
      facilitiesPath,
      facilities.map((f, i) => {
        const oldValue = oldFacilities[i].treatedDisabilityNames[oldId];
        return oldValue !== undefined
          ? set(['treatedDisabilityNames', newId], oldValue, f)
          : f;
      }),
      result,
    );
  }

  // And for the one view:isPow
  const powDisabilitiesPath = 'view:isPow.powDisabilities';
  const powDisabilities = get(powDisabilitiesPath, result);
  const oldPowDisabilities = get(powDisabilitiesPath, oldData);
  if (powDisabilities && oldPowDisabilities[oldId] !== undefined) {
    result = set(
      `${powDisabilitiesPath}.${newId}`,
      oldPowDisabilities[oldId],
      result,
    );
  }

  return result;
};

export const updateFormData = (oldData, newData) => {
  const oldArr = oldData.newDisabilities;
  const newArr = newData.newDisabilities;
  // Sanity check
  if (!Array.isArray(oldArr) || !Array.isArray(newArr)) return newData;

  // Disability was removed
  if (oldArr.length > newArr.length) {
    const deletedElement = deleted(oldArr, newArr);
    return removeDisability(deletedElement, newData);
  }

  // Disability was modified
  const changedIndex = indexOfFirstChange(oldArr, newArr);
  if (oldArr.length === newArr.length && changedIndex !== undefined) {
    // Update the disability name in treatedDisabilityNames and
    // powDisabilities _if_ it exists already
    return changeDisabilityName(oldData, newData, changedIndex);
  }

  return newData;
};
