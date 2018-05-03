import React from 'react';
import _ from 'lodash/fp';

// TODO: add proptypes
// import PropTypes from 'prop-types';

import ErrorableSelect from '@department-of-veterans-affairs/jean-pants/ErrorableSelect';
import ErrorableTextInput from '@department-of-veterans-affairs/jean-pants/ErrorableTextInput';


import { focusElement } from '../../../../platform/utilities/ui';
// TODO: hide country if military address, isn't this a clearer contract with the user? or is there some UX reason to display the field and delete the data
// TODO: get consts from schema/uischema config/remove these specifications from the config
import { pciuCountries, pciuStates, militaryStateCodes, militaryPostOfficeTypeCodes, isValidPCIUZipCode, isValidSpecialCharacter } from '../../../../platform/forms/address';

/**
 * Input component for a PCIU address.
 *
 * Additional validation can be specified via ui:validations.
 */

class PCIUAddress extends React.Component {
  // TODO: is this used for navigating to errors etc??
  //componentWillMount() {
    //this.id = _.uniqueId('address-input-');
  //}

  componentDidMount() {
    focusElement('h5');
  }

  getAdjustedStateNames = () => {
    let statesList = [];
    if (true) {
    //if (this.props.address.city && this.isMilitaryCity(this.props.address.city)) {
      statesList = militaryStateCodes;
    } else {
      statesList = pciuStates;
    }
    return statesList;
  }

  //isMilitaryCity = (city) => {
    //const upperCity = city.toUpperCase().trim();

    //return MILITARY_CITIES.has(upperCity);
  //}

  render() {
    debugger;
    // TODO: set view values
    // TODO: set final values
    // TODO: unset other values
    // toggle lists
    // hydrate with errorSchema
    const isMilitary = true;
    const isUSA = true;
    const {formData} = this.props;
    const { 
      type, city, country, state, zipCode,
      addressLine1, addressLine2, addressLine3,
      militaryPostOfficeTypeCode, militaryStateCode
    } = formData;
    const viewCity = formData['view:city'];
    const viewState = formData['view:state'];
    //const errorMessages = this.props.errorMessages;
    //const isUSA = this.props.address.countryName === 'USA';
    const adjustedStateNames = this.getAdjustedStateNames();

    return (
      <div>
        <ErrorableSelect
          label="Country"
          name="country"
          autocomplete="country"
          options={pciuCountries}
          value={{value: country}}
          required={true}
          onValueChange={(thing) => console.log(thing)}/>
        <ErrorableTextInput
          label="Street address"
          name="addressOne"
          autocomplete="address-line1"
          charMax={35}
          field={{value: addressLine1}}
          required={true}
          onValueChange={(thing) => console.log(thing)}/>
        <ErrorableTextInput
          label="Street address (optional)"
          name="addressTwo"
          autocomplete="address-line2"
          charMax={35}
          field={{value: addressLine2}}
          required={true}
          onValueChange={(thing) => console.log(thing)}/>
        <ErrorableTextInput
          label="Street address (optional)"
          name="addressThree"
          autocomplete="address-line3"
          charMax={35}
          field={{value: addressLine3}}
          required={true}
          onValueChange={(thing) => console.log(thing)}/>

        {!isMilitary && <ErrorableTextInput
          label={<span>City <em>(or APO/FPO/DPO)</em></span>}
          name="city"
          autocomplete="address-level2"
          charMax={30}
          field={{value: viewCity}}
          required={true}
          onValueChange={(thing) => console.log(thing)}/>}

        {isMilitary && <ErrorableSelect
          label={<span>City <em>(or APO/FPO/DPO)</em></span>}
          name="city"
          autocomplete="address-level2"
          options={militaryPostOfficeTypeCodes}
          value={{value: viewState}}
          required={true}
          onValueChange={(thing) => console.log(thing)}/>}
        {isUSA && <ErrorableSelect
          label="State"
          name="state"
          autocomplete="address-level1"
          options={adjustedStateNames}
          value={{value: viewState}}
          required={true}
          onValueChange={(thing) => console.log(thing)}/>}
        {isUSA && <ErrorableTextInput
          additionalClass="usa-input-medium"
          label={'Zip code'}
          name="postalCode"
          autocomplete="postal-code"
          field={{value: zipCode}}
          required={true}
          onValueChange={(thing) => console.log(thing)}/>}
        {/* include all missing fields */}
        {/* Conditionally provide city as a select if military state is selected */}
        {/* Hide the state for addresses that aren't in the US */}
        {/* Hide the zip code for addresseses that aren't in the US */}
        {/* replace errorMessage */}
      </div>
    );
  }
}

export default PCIUAddress;
