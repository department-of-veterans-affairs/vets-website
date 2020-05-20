import * as autosuggest from 'platform/forms-system/src/js/definitions/autosuggest';
import set from 'platform/utilities/data/set';
import get from 'platform/utilities/data/get';
import omit from 'platform/utilities/data/omit';
import disabilityLabels from '../content/disabilityLabels';
import {
  descriptionInfo,
  autoSuggestTitle,
  newOnlyAlert,
  increaseAndNewAlert,
} from '../content/addDisabilities';
import NewDisability from '../components/NewDisability';
import ArrayField from '../components/ArrayField';
import { validateDisabilityName, requireDisability } from '../validations';
import {
  newConditionsOnly,
  newAndIncrease,
  hasClaimedConditions,
  sippableId,
} from '../utils';

import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';

const { condition } = fullSchema.definitions.newDisabilities.items.properties;

export const uiSchema = {
  'ui:description': 'Please tell us the new conditions you want to claim.',
  newDisabilities: {
    'ui:title': 'New condition',
    'ui:field': ArrayField,
    'ui:options': {
      viewField: NewDisability,
      reviewTitle: 'New Disabilities',
      itemName: 'Disability',
    },
    // Ideally, this would show the validation on the array itself (or the name field in an array
    //  item), but that's not working.
    'ui:validations': [requireDisability],
    items: {
      condition: autosuggest.uiSchema(
        autoSuggestTitle,
        () =>
          Promise.resolve(
            Object.entries(disabilityLabels).map(([key, value]) => ({
              id: key,
              label: value,
            })),
          ),
        {
          'ui:options': {
            debounceRate: 200,
            freeInput: true,
            inputTransformers: [
              // Replace a bunch of things that aren't valid with valid equivalents
              input => input.replace(/["”’]/g, `'`),
              input => input.replace(/[;–]/g, ' -- '),
              input => input.replace(/[&]/g, ' and '),
              input => input.replace(/[\\]/g, '/'),
              // TODO: Remove the period replacer once permanent fix in place
              input => input.replace(/[.]/g, ' '),
              // Strip out everything that's not valid and doesn't need to be replaced
              // TODO: Add period back into allowed chars regex
              input => input.replace(/([^a-zA-Z0-9\-',/() ]+)/g, ''),
              // Get rid of extra whitespace characters
              input => input.trim(),
              input => input.replace(/\s{2,}/g, ' '),
            ],
          },
          // autoSuggest schema doesn't have any default validations as long as { `freeInput: true` }
          'ui:validations': [validateDisabilityName],
          'ui:required': () => true,
        },
      ),
      'view:descriptionInfo': {
        'ui:description': descriptionInfo,
      },
      'ui:options': {
        ariaLabelForEditButtonOnReview: 'Edit New condition',
      },
    },
  },
  // This object only shows up when the user tries to continue without claiming either a rated or new condition
  'view:newDisabilityErrors': {
    'view:newOnlyAlert': {
      'ui:description': newOnlyAlert,
      'ui:options': {
        hideIf: formData =>
          !newConditionsOnly(formData) || hasClaimedConditions(formData),
      },
    },
    'view:increaseAndNewAlert': {
      'ui:description': increaseAndNewAlert,
      'ui:options': {
        hideIf: formData =>
          // Only show this alert if the veteran is claiming both rated and new conditions
          !newAndIncrease(formData) || hasClaimedConditions(formData),
      },
    },
  },
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
          'view:descriptionInfo': { type: 'object', properties: {} },
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
  for (let i = 0; i < newArr.length; i++) {
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
  const oldId = sippableId(oldData.newDisabilities[changedIndex].condition);
  const newId = sippableId(newData.newDisabilities[changedIndex].condition);

  let result = removeDisability(oldData.newDisabilities[changedIndex], newData);

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
