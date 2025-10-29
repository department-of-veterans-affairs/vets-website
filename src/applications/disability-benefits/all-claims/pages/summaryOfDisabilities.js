import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import isEqual from 'lodash.isequal';
import { setData as setDataAction } from 'platform/forms-system/src/js/actions';
import { SummaryOfDisabilitiesDescription } from '../content/summaryOfDisabilities';

/**
 *  This function takes ratedDisabilities and adds them to the newDisabilities
 *  while deduping by name.
 */
export const deriveNewDisabilities = (data = {}) => {
  const explicit = Array.isArray(data.newDisabilities)
    ? data.newDisabilities
    : [];

  const explicitIds = new Set(
    explicit
      .filter(e => e && e.ratedDisabilityId != null)
      .map(e => String(e.ratedDisabilityId)),
  );

  const list = Array.isArray(data.ratedDisabilities)
    ? data.ratedDisabilities
    : [];

  const selectedRated = list
    .filter(
      d =>
        d &&
        (d['view:selected'] === true ||
          d.selected === true ||
          d.disabilityActionType === 'INCREASE'),
    )
    .map(d => ({
      ratedDisability: d.name,
      ratedDisabilityId: String(d.ratedDisabilityId),
    }))
    .filter(e => !explicitIds.has(e.ratedDisabilityId));

  const merged = [...explicit, ...selectedRated];

  const removeDupes = new Set();
  const uniqueArr = [];

  for (const item of merged) {
    const name = item?.ratedDisability?.trim().toLowerCase();
    if (name && !removeDupes.has(name)) {
      removeDupes.add(name);
      uniqueArr.push(item);
    }
  }

  return uniqueArr;
};

/**
 * When the flag is ON (new workflow),
 * use newDisabilities to set "view:selected": true on matching ratedDisabilities.
 * We match by ID (preferred) or by normalized name. Non-destructive: only adds selections.
 */
const addSelectionsFromNewToRated = (data = {}) => {
  const rated = Array.isArray(data.ratedDisabilities)
    ? data.ratedDisabilities
    : [];
  const newList = Array.isArray(data.newDisabilities)
    ? data.newDisabilities
    : [];

  // Normalize strings: trim, lowercase, collapse spaces, strip accents
  const norm = s => (typeof s === 'string' ? s.trim().toLowerCase() : '');

  const newNames = new Set(
    newList.map(n => norm(n && n.ratedDisability)).filter(Boolean),
  );

  let changed = false;

  const updatedRated = rated.map(d => {
    const name = norm(d && d.name);
    const shouldSelect = name && newNames.has(name);
    if (shouldSelect && d && d['view:selected'] !== true) {
      changed = true;
      return { ...d, 'view:selected': true }; // non-destructive: only add true
    }
    return d;
  });

  return { updatedRated, changed };
};

/**
 * Centralized sync: direction depends on FF.
 * - FF OFF: rated ➜ new (existing behavior)
 * - FF ON : new ➜ rated (add "view:selected" flags)
 */
const syncDisabilityData = (data, flagEnabled) => {
  if (!data) return data;

  if (flagEnabled) {
    const { updatedRated, changed } = addSelectionsFromNewToRated(data);
    if (changed) {
      return { ...data, ratedDisabilities: updatedRated };
    }
    return data;
  }

  // Flag OFF: keep your existing merging into newDisabilities
  const merged = deriveNewDisabilities(data);
  if (!isEqual(merged, data.newDisabilities)) {
    return { ...data, newDisabilities: merged };
  }
  return data;
};

export const EnsureDisabilitiesSync = () => {
  const dispatch = useDispatch();
  const data = useSelector(state => state?.form?.data || {});
  const flagEnabled = !!data.disabilityCompNewConditionsWorkflow;

  useEffect(
    () => {
      const next = syncDisabilityData(data, flagEnabled);
      if (next && !isEqual(next, data)) {
        dispatch(setDataAction(next));
      }
    },
    [dispatch, data, flagEnabled],
  );

  return null;
};

export const uiSchema = {
  'ui:title': 'Summary of conditions',
  'ui:description': SummaryOfDisabilitiesDescription,

  'view:ensureNewDisabilities': { 'ui:field': EnsureDisabilitiesSync },

  newDisabilities: {
    'ui:options': { hideOnReview: true },
    'ui:field': () => null,
  },
};

export const schema = {
  type: 'object',
  properties: {
    'view:ensureNewDisabilities': { type: 'object', properties: {} },
  },
};

export default EnsureDisabilitiesSync;
