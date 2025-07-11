import { parse, isValid, differenceInYears, format } from 'date-fns';

export const hasSession = () => {
  return localStorage.getItem('hasSession') === 'true';
};

/**
 * @typedef DependentsArrayFromAPI
 * @type {Array}
 * @property {Boolean} awardIndicator - Award indicator ('Y' or 'N')
 * @property {String} dateOfBirth - Date of birth in MM/dd/yyyy
 * @property {String} firstName - First name of the dependent
 * @property {String} lastName - Last name of the dependent
 * @property {String} relatedToVet - Related to the veteran ('Y' or 'N')
 * @property {String} relationship - Relationship to the veteran
 * @property {String} removalDate - Removal date of the dependent
 * @property {String} ssn - Full Social Security Number
 * @property {Boolean} veteranIndicator - Is a Veteran ('Y' or 'N')
 */
/**
 * @typedef DependentsArrayProcessed
 * @type {Array}
 * @property {Number} age - Age in years
 * @property {Boolean} awardIndicator - Award indicator ('Y' ONLY)
 * @property {String} dateOfBirth - Date of birth in MM/dd/yyyy
 * @property {String} dob - Formatted date of birth (MMMM d, yyyy)
 * @property {String} firstName - First name of the dependent
 * @property {String} fullName - Full name of the dependent (first + last)
 * @property {String} lastName - Last name of the dependent
 * @property {String} relatedToVet - Related to the veteran ('Y' or 'N')
 * @property {String} relationship - Relationship to the veteran
 * @property {String} removalDate - Removal date of the dependent
 * @property {String} ssn - Social Security Number (only the last four)
 * @property {Boolean} veteranIndicator - Is a Veteran ('Y' or 'N')
 */
/**
 * Process API response for dependent persons
 * @param {DependentsArrayFromAPI} persons - Array of dependents objects
 * @returns {DependentsArrayProcessed} - Processed array of dependents
 */
export const processDependents = (persons = []) => {
  if (persons.length > 0) {
    return persons
      .filter(person => person.awardIndicator === 'Y')
      .map(person => {
        // Format the date of birth and calculate age
        const dobObj = parse(person.dateOfBirth, 'MM/dd/yyyy', new Date());
        const dobStr = isValid(dobObj) ? format(dobObj, 'MMMM d, yyyy') : '';
        const removalDate = person.upcomingRemoval
          ? parse(person.upcomingRemoval, 'MM/dd/yyyy', new Date())
          : '';
        const ageInYears = dobStr ? differenceInYears(new Date(), dobObj) : '';

        return {
          ...person,
          dob: dobStr || '',
          ssn: (person.ssn || '').toString().slice(-4),
          fullName: `${person.firstName || ''} ${person.lastName || ''}`.trim(),
          age: ageInYears || '',
          removalDate: removalDate ? format(removalDate, 'MMMM d, yyyy') : '',
        };
      });
  }
  return [];
};
