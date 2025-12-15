import PropTypes from 'prop-types';

/**
 * Depedent's data
 * @typedef {object} ItemData
 * @property {string} key Unique key based on first name + last 4 of SSN
 * @property {string} ssn Dependent's SSN
 * @property {FullName} fullName Dependent's full name
 * @property {string} firstName Dependent's first name
 * @property {string} awardIndicator Dependent's award indicator (Y or N)
 * @property {string} dateOfBirth Dependent's date of birth
 * @property {number} age Dependent's age
 * @property {string} labeledAge Dependent's age with year/month/day label
 * @property {string} relationshipToVeteran Dependent's relationship
 * @property {string} removalReason Dependent's removal reason
 * @property {boolean} selected Dependent's selected state
 * @property {boolean} isStepchild Whether the dependent is a stepchild
 * @property {string} endDate Dependent's end date
 * @property {boolean} endOutsideUs Whether the end location is outside the US
 * @property {string} endCity Dependent's end city
 * @property {string} endProvince Dependent's end province
 * @property {string} endCountry Dependent's end country
 * @property {string} endState Dependent's end state
 */
/**
 * onSubmit parameters
 * @typedef {{
 *   event: Event,
 *   itemData: ItemData,
 *   formSubmitted: boolean,
 *   goForward: function,
 *   returnToMainPage: function
 * }} OnSubmitParams
 */
/**
 * goForward parameters
 * @typedef {{
 *   itemData: ItemData,
 *   index: number,
 *   fullData: object
 * }} GoForwardParams
 */
/**
 * handlers object
 * @typedef {object} Handlers
 * @property {props: OnSubmitParams => void} onChange Change handler
 * @property {props: ItemData => void} onSubmit Submit handler
 * @property {props: GoForwardParams => void } goForward Function to go to the
 * next page
 */
/**
 * FullName
 * @typedef {object} FullName
 * @param {string} firstName Dependent's first name
 * @param {string} lastName Dependent's last name
 */
/**
 * Picklist Component parameters
 * @typedef {object} PicklistComponentProps
 * @property {ItemData} itemData Dependent's data
 * @property {FullName} fullName Dependent's full name
 * @property {boolean} formSubmitted Whether the form has been submitted
 * @property {string} firstName Dependent's first name
 * @property {object} handlers The handlers for the component
 * @property {function} goBack Function to go back to the previous page
 * @property {function} returnToMainPage Function to return to main picklist
 * page
 * @property {boolean} isEditing Is the form is being edited from review page?
 * @property {boolean} isShowingExitLink Is the exit form link is showing?
 * @returns {React.ReactElement} Page component
 */

export default {
  Page: {
    Component: PropTypes.func,
  },

  Component: {
    firstName: PropTypes.string,
    formSubmitted: PropTypes.bool,
    fullName: PropTypes.string,
    goBack: PropTypes.func,
    handlers: PropTypes.shape({
      onChange: PropTypes.func,
      onSubmit: PropTypes.func,
    }),
    isEditing: PropTypes.bool,
    isShowingExitLink: PropTypes.bool,
    itemData: PropTypes.shape({
      age: PropTypes.number,
      awardIndicator: PropTypes.string,
      dateOfBirth: PropTypes.string,
      fullName: PropTypes.shape({
        firstName: PropTypes.string,
        lastName: PropTypes.string,
      }),
      key: PropTypes.string,
      labeledAge: PropTypes.string,
      relationshipToVeteran: PropTypes.string,
      removalReason: PropTypes.string,
      selected: PropTypes.bool,
      ssn: PropTypes.string,

      endCity: PropTypes.string,
      endCountry: PropTypes.string,
      endDate: PropTypes.string,
      endOutsideUs: PropTypes.bool,
      endProvince: PropTypes.string,
      endState: PropTypes.string,
    }),
    returnToMainPage: PropTypes.func,
  },
};
