import { nameWording } from '../../shared/utilities';

export function isRequiredFile(formContext, requiredFiles) {
  return Object.keys(formContext?.schema?.properties || {}).filter(v =>
    Object.keys(requiredFiles).includes(v),
  ).length >= 1
    ? '(Required)'
    : '(Optional)';
}

/**
 * Return a few different forms of direct address to the user.
 * Main logic is housed in `nameWording` fn.
 * e.g.,
 *   posessive: ["your" | "Jim's"],
 *   nonPosessive: ["you" | "Jim"],
 *   beingVerb: ["you're" | "Jim is"]
 * @param {Object} formData Obj containing `certifierRole` and `applicantName` properties
 * @returns Object with three properties, each mapped to a string value
 */
export function nameWordingExt(formData) {
  const posessive = nameWording(formData, true, false, true);
  const nonPosessive = nameWording(formData, false, false, true);
  const beingVerb =
    nonPosessive === 'you' ? `${nonPosessive}’re` : `${nonPosessive} is`;
  return { posessive, nonPosessive, beingVerb };
}
