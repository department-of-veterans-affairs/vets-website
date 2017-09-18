import _ from 'lodash/fp';
import {
  benefitOptionsMap,
  optionsToAlwaysDisplay
} from '../utils/helpers.jsx';
import {
  BACKEND_AUTHENTICATION_ERROR,
  BACKEND_SERVICE_ERROR,
  INVALID_ADDRESS_PROPERTY,
  GET_LETTERS_FAILURE,
  GET_LETTERS_SUCCESS,
  GET_ADDRESS_FAILURE,
  GET_ADDRESS_SUCCESS,
  GET_BENEFIT_SUMMARY_OPTIONS_FAILURE,
  GET_BENEFIT_SUMMARY_OPTIONS_SUCCESS,
  GET_LETTER_PDF_DOWNLOADING,
  GET_LETTER_PDF_SUCCESS,
  GET_LETTER_PDF_FAILURE,
  LETTER_ELIGIBILITY_ERROR,
  UPDATE_BENFIT_SUMMARY_REQUEST_OPTION,
  UPDATE_ADDRESS,
  AVAILABILITY_STATUSES,
  DOWNLOAD_STATUSES,
  SAVE_ADDRESS_PENDING,
  SAVE_ADDRESS_SUCCESS,
  // SAVE_ADDRESS_FAILURE,
  GET_ADDRESS_COUNTRIES_SUCCESS,
  GET_ADDRESS_COUNTRIES_FAILURE,
  GET_ADDRESS_STATES_SUCCESS,
  GET_ADDRESS_STATES_FAILURE
} from '../utils/constants';

const setStates = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY', 'AS', 'DC', 'FM', 'GU', 'MH', 'MP', 'PW', 'PR', 'UM', 'VI', 'PI'];
const setCountries = ['Afghanistan', 'Albania', 'Algeria', 'Angola', 'Anguilla', 'Antigua', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Azores', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Barbuda', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bermuda', 'Bhutan', 'Bolivia', 'Bosnia-Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burma', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 'Cayman Islands', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo, Democratic Republic of', 'Congo, People’s Republic of', 'Costa Rica', 'Cote d’Ivoire', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'England', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Fiji', 'Finland', 'France', 'French Guiana', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Gibraltar', 'Great Britain', 'Great Britain and Gibraltar', 'Greece', 'Greenland', 'Grenada', 'Guadeloupe', 'Guatemala', 'Guinea', 'Guinea,  Republic of Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hong Kong', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel (Jerusalem)', 'Israel (Tel Aviv)', 'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kosovo', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Leeward Islands', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macao', 'Macedonia', 'Madagascar', 'Malawi', 'Malaysia', 'Mali', 'Malta', 'Martinique', 'Mauritania', 'Mauritius', 'Mexico', 'Moldavia', 'Mongolia', 'Montenegro', 'Montserrat', 'Morocco', 'Mozambique', 'Namibia', 'Nepal', 'Netherlands', 'Netherlands Antilles', 'Nevis', 'New Caledonia', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'Northern Ireland', 'Norway', 'Oman', 'Pakistan', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Philippines (restricted payments)', 'Poland', 'Portugal', 'Qatar', 'Republic of Yemen', 'Romania', 'Russia', 'Rwanda', 'Sao-Tome/Principe', 'Saudi Arabia', 'Scotland', 'Senegal', 'Serbia', 'Serbia/Montenegro', 'Seychelles', 'Sicily', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Somalia', 'South Africa', 'South Korea', 'Spain', 'Sri Lanka', 'St. Kitts', 'St. Lucia', 'St. Vincent', 'Sudan', 'Suriname', 'Swaziland', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Togo', 'Trinidad and Tobago', 'Tunisia', 'Turkey (Adana only)', 'Turkey (except Adana)', 'Turkmenistan', 'USA', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Venezuela', 'Vietnam', 'Wales', 'Western Samoa', 'Yemen Arab Republic', 'Zambia', 'Zimbabwe'];

const initialState = {
  countries: setCountries,
  countriesAvailable: false,
  states: setStates,
  statesAvailable: false,
  letters: [],
  lettersAvailability: AVAILABILITY_STATUSES.awaitingResponse,
  letterDownloadStatus: {},
  fullName: {},
  address: {},
  optionsAvailable: false,
  requestOptions: {},
  serviceInfo: [],
  savePending: false,
  benefitInfo: {},
};

function letters(state = initialState, action) {
  switch (action.type) {
    case GET_LETTERS_SUCCESS: {
      const letterDownloadStatus = {};
      _.forEach((letter) => {
        letterDownloadStatus[letter.letterType] = DOWNLOAD_STATUSES.pending;
      }, action.data.data.attributes.letters);

      return {
        ...state,
        letters: action.data.data.attributes.letters,
        fullName: action.data.data.attributes.fullName,
        lettersAvailability: AVAILABILITY_STATUSES.available,
        letterDownloadStatus
      };
    }
    case BACKEND_SERVICE_ERROR:
      return _.set('lettersAvailability', AVAILABILITY_STATUSES.backendServiceError, state);
    case BACKEND_AUTHENTICATION_ERROR:
      return _.set('lettersAvailability', AVAILABILITY_STATUSES.backendAuthenticationError, state);
    case INVALID_ADDRESS_PROPERTY:
      return _.set('lettersAvailability', AVAILABILITY_STATUSES.invalidAddressProperty, state);
    case GET_LETTERS_FAILURE:
      return _.set('lettersAvailability', AVAILABILITY_STATUSES.unavailable, state);
    case LETTER_ELIGIBILITY_ERROR:
      return _.set('lettersAvailability', AVAILABILITY_STATUSES.letterEligibilityError, state);
    case GET_ADDRESS_SUCCESS: {
      const { attributes } = action.data.data;
      return {
        ...state,
        address: attributes.address,
        canUpdate: attributes.controlInformation.canUpdate,
        addressAvailable: true
      };
    }
    case GET_ADDRESS_FAILURE:
      return _.set('addressAvailable', false, state);
    case GET_BENEFIT_SUMMARY_OPTIONS_SUCCESS: {
    // Gather all possible displayed options that the user may toggle on/off.
      const benefitInfo = action.data.data.attributes.benefitInformation;
      const possibleOptions = [];
      Object.keys(benefitInfo).forEach(key => {
        if ((optionsToAlwaysDisplay.includes(key) || (benefitInfo[key] !== false)) &&
            !possibleOptions.includes[key]) {
          possibleOptions.push(key);
        }
      });

      // Initialize the benefit summary letter request body by mapping each
      // option in possibleOptions to its corresponding request option key.
      // Set all request body options to true so that on page load, all options
      // are checked.
      const requestOptions = { militaryService: true };
      _.forEach((option) => {
        requestOptions[benefitOptionsMap[option]] = true;
      }, possibleOptions);

      return {
        ...state,
        benefitInfo: action.data.data.attributes.benefitInformation,
        serviceInfo: action.data.data.attributes.militaryService,
        optionsAvailable: true,
        requestOptions
      };
    }
    case GET_BENEFIT_SUMMARY_OPTIONS_FAILURE:
      return _.set('optionsAvailable', false, state);
    case UPDATE_BENFIT_SUMMARY_REQUEST_OPTION:
      return _.set(['requestOptions', action.propertyPath], action.value, state);
    case GET_LETTER_PDF_DOWNLOADING:
      return _.set(['letterDownloadStatus', action.data], DOWNLOAD_STATUSES.downloading, state);
    case GET_LETTER_PDF_SUCCESS:
      return _.set(['letterDownloadStatus', action.data], DOWNLOAD_STATUSES.success, state);
    case GET_LETTER_PDF_FAILURE:
      return _.set(['letterDownloadStatus', action.data], DOWNLOAD_STATUSES.failure, state);
    case UPDATE_ADDRESS:
      return _.set('address', action.address, state);
    case SAVE_ADDRESS_PENDING:
      return _.set('savePending', true, state);
    case SAVE_ADDRESS_SUCCESS: {
      const newState = Object.assign({}, state, { savePending: false });
      return _.set('address', action.address, newState);
    }
    // Add SAVE_ADDRESS_FAILURE
    case GET_ADDRESS_COUNTRIES_SUCCESS:
      // return _.set('countries', action.countries, state);
      return {
        ...state,
        countries: action.countries,
        countriesAvailable: true
      };
    case GET_ADDRESS_COUNTRIES_FAILURE:
      return _.set('countriesAvailable', false, state);
    case GET_ADDRESS_STATES_SUCCESS:
      // return _.set('states', action.states, state);
      return {
        ...state,
        states: action.states,
        statesAvailable: true
      };
    case GET_ADDRESS_STATES_FAILURE:
      return _.set('statesAvailable', false, state);
    default:
      return state;
  }
}

export default {
  letters
};
