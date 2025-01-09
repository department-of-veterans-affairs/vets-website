/* Update to rep phone to match Lighthouse v2 (missed in first migration)
 * https://github.com/department-of-veterans-affairs/vets-api/blob/master/modules/appeals_api/config/schemas/higher_level_reviews/v0/200996.json
 * Update: remove rep phone processing. Rep phone in saved form is a string. It
 * is converted into a phone object upon submission
 */
export default savedData => savedData;
