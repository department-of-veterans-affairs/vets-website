/**
 * @typedef {Object} BenefitDescription
 * @prop {string} benefitType - The type of benefit; e.g. 'health care benefits'
 * @prop {string|boolean} [subText=] - The subtext to be wrapped in (). e.g.
 *                             '10-10EZ'. Defaults to the formId. If set to
 *                             false or an empty string, the subtext will be
 *                             omitted from the benefit description text.
 */

/**
 * Return the benefit description string in the following format:
 * 'benefit description (subtext or form ID)'
 *
 * @param {BenefitDescription} formConfig.benefitDescription
 * @param {string} formConfig.formId
 * @returns {string} - The benefit description as a string;
 *                     e.g. 'health care benefits (10-10EZ)'
 */
export default function getBenefitString(formConfig) {
  const { benefitType } = formConfig.benefitDescription;
  let { subText } = formConfig.benefitDescription;

  if (typeof benefitType !== 'string') {
    throw new TypeError(
      `Form ${
        formConfig.formId
      }: Expected benefitDescription.benefitType to be a string.
        Instead found ${typeof benefitType}.`,
    );
  }
  if (subText && typeof subText !== 'string') {
    throw new TypeError(
      `Form ${
        formConfig.formId
      }: Expected benefitDescription.subText to be a string. Instead found ${typeof subText}.`,
    );
  }

  // Only use the formId if the subText is undefined; we want to keep the falsey
  // values of false and ''
  if (subText === undefined) subText = `${formConfig.formId}`;

  return subText
    ? `${formConfig.benefitDescription.benefitType} (${subText})`
    : formConfig.benefitDescription.benefitType;
}
