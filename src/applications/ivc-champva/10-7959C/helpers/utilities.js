import { nameWording as sharedNameWording } from '../../shared/utilities';

export function isRequiredFile(formContext, requiredFiles) {
  return Object.keys(formContext?.schema?.properties || {}).filter(v =>
    Object.keys(requiredFiles).includes(v),
  ).length >= 1
    ? '(Required)'
    : '(Optional)';
}

// Return either 'your' or the applicant's name depending
export function nameWording(
  formData,
  isPosessive = true,
  cap = true,
  firstNameOnly = false,
) {
  // Moved contents of this function to shared utilities file,
  // leaving this stub in place so existing imports still work.
  // TODO: update all imports of nameWording to point directly to shared
  return sharedNameWording(formData, isPosessive, cap, firstNameOnly);
}

export function nameWordingExt(formData) {
  const posessive = nameWording(formData, true, false, true);
  const nonPosessive = nameWording(formData, false, false, true);
  const beingVerb =
    nonPosessive === 'you' ? `${nonPosessive}’re` : `${nonPosessive} is`;
  return { posessive, nonPosessive, beingVerb };
}
