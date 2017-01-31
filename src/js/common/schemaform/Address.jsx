import React from 'react';
import _ from 'lodash';
import { set } from 'lodash/fp';

import ErrorableSelect from '../components/form-elements/ErrorableSelect';
import ErrorableTextInput from '../components/form-elements/ErrorableTextInput';
// import { isNotBlank, isBlankAddress, validateIfDirty, isValidUSZipCode, isValidCanPostalCode } from '../utils/validations';
import { countries, states } from '../utils/options-for-select';

/**
 * Input component for an address.
 *
 * No validation is provided through a currently stubbed isAddressValid function.
 */
class Address extends React.Component {
  constructor(props) {
    super();
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    // this.validateAddressField = this.validateAddressField.bind(this);
    // this.validatePostalCode = this.validatePostalCode.bind(this);
    this.state = { value: props.formData, touched: { street: false, city: false, state: false, country: false, postalCode: false } };
  }

  componentWillMount() {
    this.id = _.uniqueId('address-input-');
  }

  handleBlur(field) {
    const newState = _.set(['touched', field], true, this.state);
    this.setState(newState, () => {
      if (newState.touched.street && newState.touched.city && newState.touched.state && newState.touched.country && newState.touched.postalCode) {
        this.props.onBlur(this.props.id, newState.value);
      }
    });
  }

  // TODO: Look into if this is the best way to update address,
  // it is incredibly slow right now
  handleChange(path, update) {
    let newState = _.set(this.state, ['value', path], update);
    newState = _.set(newState, ['touched', path], true);
    
    // if country is changing we should clear the state
    if (path === 'country') {
      newState = _.set(newState, ['value', 'state'], '');
    }

    this.props.onChange(newState.value);
  }

  // validateAddressField(field) {
  //   if (this.props.required || !isBlankAddress(this.props.value)) {
  //     return validateIfDirty(field, isNotBlank);
  //   }

  //   return true;
  // }

  // validatePostalCode(postalCodeField) {
  //   let isValid = true;

  //   if (this.props.required || !isBlankAddress(this.props.formData)) {
  //     isValid = isValid && validateIfDirty(postalCodeField, isNotBlank);
  //   }

  //   if (this.props.formData.country === 'USA' && isNotBlank(postalCodeField.value)) {
  //     isValid = isValid && validateIfDirty(postalCodeField, isValidUSZipCode);
  //   }

  //   if (this.props.formData.country === 'CAN' && isNotBlank(postalCodeField.value)) {
  //     isValid = isValid && validateIfDirty(postalCodeField, isValidCanPostalCode);
  //   }

  //   return isValid;
  // }

  isMilitaryCity(city) {
    const lowerCity = city.toLowerCase().trim();

    return lowerCity === 'apo' || lowerCity === 'fpo' || lowerCity === 'dpo';
  }

  render() {
    let stateList = [];

    const states = {
      CAN: [
        { label: 'Alberta', value: 'AB' },
        { label: 'British Columbia', value: 'BC' },
        { label: 'Manitoba', value: 'MB' },
        { label: 'New Brunswick', value: 'NB' },
        { label: 'Newfoundland', value: 'NF' },
        { label: 'Northwest Territories', value: 'NT' },
        { label: 'Nova Scotia', value: 'NV' },
        { label: 'Nunavut Province', value: 'NU' },
        { label: 'Ontario', value: 'ON' },
        { label: 'Prince Edward Island', value: 'PE' },
        { label: 'Quebec', value: 'QC' },
        { label: 'Saskatchewan', value: 'SK' },
        { label: 'Yukon Territory', value: 'YT' }
      ],
      MEX: [
        { label: 'Aguascalientes', value: 'aguascalientes' },
        { label: 'Baja California Norte', value: 'baja-california-norte' },
        { label: 'Baja California Sur', value: 'baja-california-sur' },
        { label: 'Campeche', value: 'campeche' },
        { label: 'Chiapas', value: 'chiapas' },
        { label: 'Chihuahua', value: 'chihuahua' },
        { label: 'Coahuila', value: 'coahuila' },
        { label: 'Colima', value: 'colima' },
        { label: 'Distrito Federal', value: 'distrito-federal' },
        { label: 'Durango', value: 'durango' },
        { label: 'Guanajuato', value: 'guanajuato' },
        { label: 'Guerrero', value: 'guerrero' },
        { label: 'Hidalgo', value: 'hidalgo' },
        { label: 'Jalisco', value: 'jalisco' },
        { label: 'México', value: 'mexico' },
        { label: 'Michoacán', value: 'michoacan' },
        { label: 'Morelos', value: 'morelos' },
        { label: 'Nayarit', value: 'nayarit' },
        { label: 'Nuevo León', value: 'nuevo-leon' },
        { label: 'Oaxaca', value: 'oaxaca' },
        { label: 'Puebla', value: 'puebla' },
        { label: 'Querétaro', value: 'queretaro' },
        { label: 'Quintana Roo', value: 'quintana-roo' },
        { label: 'San Luis Potosí', value: 'san-luis-potosi' },
        { label: 'Sinaloa', value: 'sinaloa' },
        { label: 'Sonora', value: 'sonora' },
        { label: 'Tabasco', value: 'tabasco' },
        { label: 'Tamaulipas', value: 'tamaulipas' },
        { label: 'Tlaxcala', value: 'tlaxcala' },
        { label: 'Veracruz', value: 'veracruz' },
        { label: 'Yucatán', value: 'yucatan' },
        { label: 'Zacatecas', value: 'zacatecas' }
      ],
      USA: [
        { label: 'Alabama', value: 'AL' },
        { label: 'Alaska', value: 'AK' },
        { label: 'American Samoa', value: 'AS' },
        { label: 'Arizona', value: 'AZ' },
        { label: 'Arkansas', value: 'AR' },
        { label: 'Armed Forces Americas (AA)', value: 'AA' },
        { label: 'Armed Forces Europe (AE)', value: 'AE' },
        { label: 'Armed Forces Pacific (AP)', value: 'AP' },
        { label: 'California', value: 'CA' },
        { label: 'Colorado', value: 'CO' },
        { label: 'Connecticut', value: 'CT' },
        { label: 'Delaware', value: 'DE' },
        { label: 'District Of Columbia', value: 'DC' },
        { label: 'Federated States Of Micronesia', value: 'FM' },
        { label: 'Florida', value: 'FL' },
        { label: 'Georgia', value: 'GA' },
        { label: 'Guam', value: 'GU' },
        { label: 'Hawaii', value: 'HI' },
        { label: 'Idaho', value: 'ID' },
        { label: 'Illinois', value: 'IL' },
        { label: 'Indiana', value: 'IN' },
        { label: 'Iowa', value: 'IA' },
        { label: 'Kansas', value: 'KS' },
        { label: 'Kentucky', value: 'KY' },
        { label: 'Louisiana', value: 'LA' },
        { label: 'Maine', value: 'ME' },
        { label: 'Marshall Islands', value: 'MH' },
        { label: 'Maryland', value: 'MD' },
        { label: 'Massachusetts', value: 'MA' },
        { label: 'Michigan', value: 'MI' },
        { label: 'Minnesota', value: 'MN' },
        { label: 'Mississippi', value: 'MS' },
        { label: 'Missouri', value: 'MO' },
        { label: 'Montana', value: 'MT' },
        { label: 'Nebraska', value: 'NE' },
        { label: 'Nevada', value: 'NV' },
        { label: 'New Hampshire', value: 'NH' },
        { label: 'New Jersey', value: 'NJ' },
        { label: 'New Mexico', value: 'NM' },
        { label: 'New York', value: 'NY' },
        { label: 'North Carolina', value: 'NC' },
        { label: 'North Dakota', value: 'ND' },
        { label: 'Northern Mariana Islands', value: 'MP' },
        { label: 'Ohio', value: 'OH' },
        { label: 'Oklahoma', value: 'OK' },
        { label: 'Oregon', value: 'OR' },
        { label: 'Palau', value: 'PW' },
        { label: 'Pennsylvania', value: 'PA' },
        { label: 'Puerto Rico', value: 'PR' },
        { label: 'Rhode Island', value: 'RI' },
        { label: 'South Carolina', value: 'SC' },
        { label: 'South Dakota', value: 'SD' },
        { label: 'Tennessee', value: 'TN' },
        { label: 'Texas', value: 'TX' },
        { label: 'Utah', value: 'UT' },
        { label: 'Vermont', value: 'VT' },
        { label: 'Virgin Islands', value: 'VI' },
        { label: 'Virginia', value: 'VA' },
        { label: 'Washington', value: 'WA' },
        { label: 'West Virginia', value: 'WV' },
        { label: 'Wisconsin', value: 'WI' },
        { label: 'Wyoming', value: 'WY' }
      ]
    };

    debugger;
    const selectedCountry = this.props.formData.country.value || this.props.formData.country;
    if (states[selectedCountry]) {
      stateList = states[selectedCountry];
      if (this.props.formData.city && this.isMilitaryCity(this.props.formData.city)) {
        stateList = stateList.filter(state => state.value === 'AE' || state.value === 'AP' || state.value === 'AA');
      }
    }

    const stateProvince = _.hasIn(states, selectedCountry)
      ? <ErrorableSelect //errorMessage={this.validateAddressField(this.props.formData.state) ? undefined : 'Please enter a valid state/province'}
          label={selectedCountry === 'CAN' ? 'Province' : 'State'}
          name="state"
          autocomplete="address-level1"
          options={stateList}
          value={{dirty: false, value: this.props.formData.state}}
          required={this.props.required}
          onValueChange={(update) => {this.handleChange('state', update);}}/>
      : <ErrorableTextInput label="State/province"
          name="province"
          autocomplete="address-level1"
          field={{value: this.props.formData.state, dirty: false}}
          required={false}
          onValueChange={(update) => {this.handleChange('state', update);}}/>;

    return (
      <div>
        <ErrorableSelect //errorMessage={this.validateAddressField(this.props.formData.country) ? undefined : 'Please enter a country'}
            label="Country"
            name="country"
            autocomplete="country"
            options={countries}
            value={{dirty: false, value: selectedCountry}}
            required={this.props.required}
            onValueChange={(update) => {this.handleChange('country', update);}}/>
        <ErrorableTextInput //errorMessage={this.validateAddressField(this.props.formData.street) ? undefined : 'Please enter a street address'}
            label="Street"
            name="address"
            autocomplete="street-address"
            charMax={30}
            field={{dirty: false, value: this.props.formData.street}}
            required={this.props.required}
            onValueChange={(update) => {this.handleChange('street', update);}}/>
        <ErrorableTextInput //errorMessage={this.validateAddressField(this.props.formData.street) ? undefined : 'Please enter a street address'}
            label="Line 2"
            name="address2"
            autocomplete="street-address2"
            charMax={30}
            field={{dirty: false, value: this.props.formData.street2}}
            required={this.props.required}
            onValueChange={(update) => {this.handleChange('street', update);}}/>
        <ErrorableTextInput //errorMessage={this.validateAddressField(this.props.formData.city) ? undefined : 'Please enter a city'}
            label={<span>City <em>(or APO/FPO/DPO)</em></span>}
            name="city"
            autocomplete="address-level2"
            charMax={30}
            field={{dirty: false, value: this.props.formData.city}}
            required={this.props.required}
            onValueChange={(update) => {this.handleChange('city', update);}}/>
        {stateProvince}
        <ErrorableTextInput //errorMessage={this.validatePostalCode(this.props.formData.postalCode) ? undefined : 'Please enter a valid Postal code'}
            additionalClass="usa-input-medium"
            label={this.props.formData.country === 'USA' ? 'Zip code' : 'Postal code'}
            name="postalCode"
            autocomplete="postal-code"
            field={{dirty: false, value: this.props.formData.postalCode}}
            required={this.props.required}
            onValueChange={(update) => {this.handleChange('postalCode', update);}}/>
      </div>
    );
  }
}

export default Address;
