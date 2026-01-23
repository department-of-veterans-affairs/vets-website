/**
 * sync-conditions.js
 *
 * This module contains synchronization and normalization helpers that reconcile
 * disability condition data across multiple claim workflows (New Conditions,
 * Rated Disability Increases, VA treatment, etc.).
 *
 * These workflows historically store condition data in two different shapes:
 *
 * 1) A "new conditions" (NC) shape, where key fields are stored at the top level
 *    of each newDisabilities item for form rendering and submission.
 *
 * 2) A "disability benefits" (DB) shape, where related follow-up data is nested under
 *    workflow-specific keys (e.g. `view:secondaryFollowUp`,
 *    `view:worsenedFollowUp`, `view:vaFollowUp`) to support persistence and
 *    schema validation.
 *
 * Because users can switch between workflows mid-flow, the application must
 * safely migrate data between these shapes without losing user-entered values,
 * duplicating conditions, or violating schema requirements.
 *
 * The functions in this file are responsible for:
 * - Synchronizing rated disabilities ↔ new conditions when switching workflows
 * - Preventing duplicate or conflicting condition entries
 * - Normalizing data so both top-level (NC) and nested (DB) shapes remain
 *   consistent and complete
 *
 * All transformations are designed to be defensive and backward-compatible,
 * preserving existing values whenever possible and only applying defaults when
 * required by the target workflow.
 *
 * NOTE: This module exists to support in-progress forms during the transition
 * to the new conditions workflow. Once all active forms have been migrated and
 * the legacy workflow is fully retired, this file can be safely removed.
 */
import { NEW_CONDITION_OPTION } from '../constants';

const normalize = s => (s ?? '').trim().toLowerCase();

export const syncRatedDisabilitiesToNewConditions = formData => {
  const rated = formData?.ratedDisabilities || [];
  const newDisabilities = formData?.newDisabilities || [];
  const selectedRated = rated.filter(rd => rd['view:selected']);

  if (!selectedRated.length) return formData;

  const existingNames = new Set(
    newDisabilities.map(nd => normalize(nd?.ratedDisability)).filter(Boolean),
  );
  const toAdd = selectedRated
    .filter(rd => !existingNames.has(normalize(rd.name)))
    .map(rd => ({
      ratedDisability: rd.name,
      cause: 'WORSENED',
      condition: 'Rated Disability',
      worsenedDescription: 'Rated Disability Increase',
      worsenedEffects: 'Rated Disability Increase',
    }));

  if (!toAdd.length) return formData;

  return {
    ...formData,
    newDisabilities: [...newDisabilities, ...toAdd],
  };
};

export const syncNewConditionsToRatedDisabilities = formData => {
  const newDisabilities = formData?.newDisabilities || [];
  const ratedDisabilities = formData?.ratedDisabilities || [];

  const ratedIncreaseNames = newDisabilities
    .filter(
      nd =>
        nd?.cause === 'WORSENED' &&
        nd?.condition === 'Rated Disability' &&
        nd?.ratedDisability &&
        nd.ratedDisability !== NEW_CONDITION_OPTION,
    )
    .map(nd => nd.ratedDisability);

  if (!ratedIncreaseNames.length) return formData;

  const ratedNameSet = new Set(
    ratedDisabilities.map(rd => normalize(rd.name)).filter(Boolean),
  );
  const removableSet = new Set(
    ratedIncreaseNames
      .map(name => normalize(name))
      .filter(name => ratedNameSet.has(name)),
  );

  if (!removableSet.size) return formData;

  let ratedChanged = false;
  const updatedRated = ratedDisabilities.map(rd => {
    if (removableSet.has(normalize(rd.name)) && !rd['view:selected']) {
      ratedChanged = true;
      return { ...rd, 'view:selected': true };
    }
    return rd;
  });

  const filteredNewDisabilities = newDisabilities.filter(
    nd =>
      !(
        nd?.cause === 'WORSENED' &&
        nd?.condition === 'Rated Disability' &&
        removableSet.has(normalize(nd?.ratedDisability))
      ),
  );

  const claimType = formData['view:claimType'] || {};
  const claimingIncreaseAlready = claimType['view:claimingIncrease'] === true;

  if (
    !ratedChanged &&
    filteredNewDisabilities.length === newDisabilities.length &&
    claimingIncreaseAlready
  ) {
    return formData;
  }

  return {
    ...formData,
    ratedDisabilities: updatedRated,
    newDisabilities: filteredNewDisabilities,
    'view:claimType': claimingIncreaseAlready
      ? claimType
      : {
          ...claimType,
          'view:claimingIncrease': true,
        },
  };
};

const currentYearDate = () => `${new Date().getFullYear()}`;

const ensure = (obj, key, value) => {
  if (obj[key] === undefined || obj[key] === null || obj[key] === '') {
    // eslint-disable-next-line no-param-reassign
    obj[key] = value;
  }
};

export const normalizeNewDisabilities = formData => {
  const list = Array.isArray(formData?.newDisabilities)
    ? formData.newDisabilities
    : null;

  if (!list) return formData;

  let changed = false;

  const next = list.map(item => {
    if (!item || typeof item !== 'object') return item;

    let nextItem = item;

    const getMutable = () => {
      if (nextItem === item) {
        nextItem = { ...item };
        changed = true;
      }
      return nextItem;
    };

    const ensureNestedObj = key => {
      const m = getMutable();
      if (!m[key] || typeof m[key] !== 'object') {
        m[key] = {};
      }
      return m[key];
    };

    switch (item.cause) {
      case 'SECONDARY': {
        // Hoist nested → top-level (NC shape)
        if (!item.causedByDisability || !item.causedByDisabilityDescription) {
          const nested = item['view:secondaryFollowUp'];
          if (nested && typeof nested === 'object') {
            const m = getMutable();
            ensure(m, 'causedByDisability', nested.causedByDisability);
            ensure(
              m,
              'causedByDisabilityDescription',
              nested.causedByDisabilityDescription,
            );
          }
        }

        // Ensure nested (DB shape)
        if (item.causedByDisability || item.causedByDisabilityDescription) {
          const nested = ensureNestedObj('view:secondaryFollowUp');
          if (!nested.causedByDisability && item.causedByDisability) {
            changed = true;
            nested.causedByDisability = item.causedByDisability;
          }
          if (
            !nested.causedByDisabilityDescription &&
            item.causedByDisabilityDescription
          ) {
            changed = true;
            nested.causedByDisabilityDescription =
              item.causedByDisabilityDescription;
          }
        }
        break;
      }

      case 'WORSENED': {
        // Hoist nested → top-level (NC shape)
        if (!item.worsenedDescription || !item.worsenedEffects) {
          const nested = item['view:worsenedFollowUp'];
          if (nested && typeof nested === 'object') {
            const m = getMutable();
            ensure(m, 'worsenedDescription', nested.worsenedDescription);
            ensure(m, 'worsenedEffects', nested.worsenedEffects);
          }
        }

        // Ensure nested (DB shape)
        if (item.worsenedDescription || item.worsenedEffects) {
          const nested = ensureNestedObj('view:worsenedFollowUp');
          if (!nested.worsenedDescription && item.worsenedDescription) {
            changed = true;
            nested.worsenedDescription = item.worsenedDescription;
          }
          if (!nested.worsenedEffects && item.worsenedEffects) {
            changed = true;
            nested.worsenedEffects = item.worsenedEffects;
          }
        }
        break;
      }

      case 'VA': {
        // Hoist nested → top-level (NC shape), except date
        if (!item.vaMistreatmentDescription || !item.vaMistreatmentLocation) {
          const nested = item['view:vaFollowUp'];
          if (nested && typeof nested === 'object') {
            const m = getMutable();
            ensure(
              m,
              'vaMistreatmentDescription',
              nested.vaMistreatmentDescription,
            );
            ensure(m, 'vaMistreatmentLocation', nested.vaMistreatmentLocation);
          }
        }

        // Ensure nested (DB shape)
        const nested = ensureNestedObj('view:vaFollowUp');
        if (
          !nested.vaMistreatmentDescription &&
          item.vaMistreatmentDescription
        ) {
          changed = true;
          nested.vaMistreatmentDescription = item.vaMistreatmentDescription;
        }
        if (!nested.vaMistreatmentLocation && item.vaMistreatmentLocation) {
          changed = true;
          nested.vaMistreatmentLocation = item.vaMistreatmentLocation;
        }
        if (!nested.vaMistreatmentDate) {
          changed = true;
          nested.vaMistreatmentDate =
            item.vaMistreatmentDate || currentYearDate();
        }
        break;
      }

      case 'NEW':
      default:
        // No normalization needed
        break;
    }

    return nextItem;
  });

  if (!changed) return formData;

  return {
    ...formData,
    newDisabilities: next,
  };
};
