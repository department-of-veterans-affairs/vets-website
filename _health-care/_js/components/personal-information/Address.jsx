import React from 'react';
import _ from 'lodash';

import State from './State';
import { isValidAddress } from '../../utils/validations';

/**
 * Input component for an address.
 *
 * No validation is provided through a currently stubbed isAddressValid function.
 */
class Address extends React.Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount() {
    this.id = _.uniqueId('address-input-');
  }

  handleChange() {
    const address = {
      street: this._street.value,
      city: this._city.value,
      country: this._country.value,
      state: this._state.value,
      zipcode: this._zipcode.value,
      county: this._county.value
    };

    this.props.onValueChange(address);
  }

  render() {
    const arrayOfCountry = {
      USA: 'United',
      AFG: 'Afghanistan',
      ALB: 'Albania',
      DZA: 'Algeria',
      AND: 'Andorra',
      AGO: 'Angola',
      AIA: 'Anguilla',
      ATA: 'Antarctica',
      ATG: 'Antigua',
      ARG: 'Argentina',
      ARM: 'Armenia',
      ABW: 'Aruba',
      AUS: 'Australia',
      AUT: 'Austria',
      AZE: 'Azerbaijan',
      BHS: 'Bahamas',
      BHR: 'Bahrain',
      BGD: 'Bangladesh',
      BRB: 'Barbados',
      BLR: 'Belarus',
      BEL: 'Belgium',
      BLZ: 'Belize',
      BEN: 'Benin',
      BMU: 'Bermuda',
      BTN: 'Bhutan',
      BOL: 'Bolivia',
      BIH: 'Bosnia',
      BWA: 'Botswana',
      BVT: 'Bouvet',
      BRA: 'Brazil',
      IOT: 'British',
      BRN: 'Brunei',
      BGR: 'Bulgaria',
      BFA: 'Burkina',
      BDI: 'Burundi',
      KHM: 'Cambodia',
      CMR: 'Cameroon',
      CAN: 'Canada',
      CPV: 'Cape',
      CYM: 'Cayman',
      CAF: 'Central',
      TCD: 'Chad',
      CHL: 'Chile',
      CHN: 'China',
      CXR: 'Christmas',
      CCK: 'Cocos',
      COL: 'Colombia',
      COM: 'Comoros',
      COG: 'Congo',
      COD: 'Congo',
      COK: 'Cook',
      CRI: 'Costa',
      CIV: 'Cote',
      HRV: 'Croatia',
      CUB: 'Cuba',
      CYP: 'Cyprus',
      CZE: 'Czech',
      DNK: 'Denmark',
      DJI: 'Djibouti',
      DMA: 'Dominica',
      DOM: 'Dominican',
      ECU: 'Ecuador',
      EGY: 'Egypt',
      SLV: 'El',
      GNQ: 'Equatorial',
      ERI: 'Eritrea',
      EST: 'Estonia',
      ETH: 'Ethiopia',
      FLK: 'Falkland',
      FRO: 'Faroe',
      FJI: 'Fiji',
      FIN: 'Finland',
      FRA: 'France',
      GUF: 'French',
      PYF: 'French',
      ATF: 'French',
      GAB: 'Gabon',
      GMB: 'Gambia',
      GEO: 'Georgia',
      DEU: 'Germany',
      GHA: 'Ghana',
      GIB: 'Gibraltar',
      GRC: 'Greece',
      GRL: 'Greenland',
      GRD: 'Grenada',
      GLP: 'Guadeloupe',
      GTM: 'Guatemala',
      GIN: 'Guinea',
      GNB: 'Guinea-Bissau',
      GUY: 'Guyana',
      HTI: 'Haiti',
      HMD: 'Heard',
      HND: 'Honduras',
      HKG: 'Hong',
      HUN: 'Hungary',
      ISL: 'Iceland',
      IND: 'India',
      IDN: 'Indonesia',
      IRN: 'Iran',
      IRQ: 'Iraq',
      IRL: 'Ireland',
      ISR: 'Israel',
      ITA: 'Italy',
      JAM: 'Jamaica',
      JPN: 'Japan',
      JOR: 'Jordan',
      KAZ: 'Kazakhstan',
      KEN: 'Kenya',
      KIR: 'Kiribati',
      PRK: 'Korea,',
      KOR: 'Korea,',
      KWT: 'Kuwait',
      KGZ: 'Kyrgyzstan',
      LAO: 'Laos',
      LVA: 'Latvia',
      LBN: 'Lebanon',
      LSO: 'Lesotho',
      LBR: 'Liberia',
      LBY: 'Libya',
      LIE: 'Liechtenstein',
      LTU: 'Lithuania',
      LUX: 'Luxembourg',
      MAC: 'Macao',
      MKD: 'Macedonia',
      MDG: 'Madagascar',
      MWI: 'Malawi',
      MYS: 'Malaysia',
      MDV: 'Maldives',
      MLI: 'Mali',
      MLT: 'Malta',
      MTQ: 'Martinique',
      MRT: 'Mauritania',
      MUS: 'Mauritius',
      MYT: 'Mayotte',
      MEX: 'Mexico',
      FSM: 'Micronesia',
      MDA: 'Moldova',
      MCO: 'Monaco',
      MNG: 'Mongolia',
      MSR: 'Montserrat',
      MAR: 'Morocco',
      MOZ: 'Mozambique',
      MMR: 'Myanmar',
      NAM: 'Namibia',
      NRU: 'Nauru',
      NPL: 'Nepal',
      ANT: 'Netherlands',
      NLD: 'Netherlands',
      NCL: 'New',
      NZL: 'New',
      NIC: 'Nicaragua',
      NER: 'Niger',
      NGA: 'Nigeria',
      NIU: 'Niue',
      NFK: 'Norfolk',
      NOR: 'Norway',
      OMN: 'Oman',
      PAK: 'Pakistan',
      PAN: 'Panama',
      PNG: 'Papua',
      PRY: 'Paraguay',
      PER: 'Peru',
      PHL: 'Philippines',
      PCN: 'Pitcairn',
      POL: 'Poland',
      PRT: 'Portugal',
      QAT: 'Qatar',
      REU: 'Reunion',
      ROU: 'Romania',
      RUS: 'Russian',
      RWA: 'Rwanda',
      SHN: 'Saint',
      KNA: 'Saint',
      LCA: 'Saint',
      SPM: 'Saint',
      VCT: 'Saint',
      SMR: 'San',
      STP: 'Sao',
      SAU: 'Saudi',
      SEN: 'Senegal',
      SCG: 'Serbia',
      SYC: 'Seychelles',
      SLE: 'Sierra',
      SGP: 'Singapore',
      SVK: 'Slovakia',
      SVN: 'Slovenia',
      SLB: 'Solomon',
      SOM: 'Somalia',
      ZAF: 'South',
      SGS: 'South',
      ESP: 'Spain',
      LKA: 'Sri',
      SDN: 'Sudan',
      SUR: 'Suriname',
      SWZ: 'Swaziland',
      SWE: 'Sweden',
      CHE: 'Switzerland',
      SYR: 'Syrian',
      TWN: 'Taiwan',
      TJK: 'Tajikistan',
      TZA: 'Tanzania',
      THA: 'Thailand',
      TLS: 'Timor-Leste',
      TGO: 'Togo',
      TKL: 'Tokelau',
      TON: 'Tonga',
      TTO: 'Trinidad',
      TUN: 'Tunisia',
      TUR: 'Turkey',
      TKM: 'Turkmenistan',
      TCA: 'Turks',
      TUV: 'Tuvalu',
      UGA: 'Uganda',
      UKR: 'Ukraine',
      ARE: 'United',
      GBR: 'United',
      URY: 'Uruguay',
      UZB: 'Uzbekistan',
      VUT: 'Vanuatu',
      VAT: 'Vatican',
      VEN: 'Venezuela',
      VNM: 'Viet',
      VGB: 'Virgin',
      WLF: 'Wallis',
      ESH: 'Western',
      YEM: 'Yemen',
      ZMB: 'Zambia',
      ZWE: 'Zimbabwe',
    };

    const options = _.map(arrayOfCountry, (val, key) => {
      return (
        <option
            key={key}
            value={key}>
          {val}
        </option>
      );
    });

    const isValid = isValidAddress(
      this.props.street,
      this.props.city,
      this.props.country,
      this.props.state,
      this.props.zipcode,
      this.props.county);

    return (
      <div className={isValid ? undefined : 'usa-input-error'}>
        <h4>Address</h4>

        <p>For locations outside the U.S., enter "City,Country" in the City field
          (e.g., "Paris,France"), and select Foreign Country for State.
        </p>

        <label
            className={isValid ? undefined : 'usa-input-error-label'}
            htmlFor={`${this.id}-street`}>
          Street
        </label>
        <input type="text" name="street"
            className="usa-form-control"
            id={`${this.id}-street`}
            ref={(c) => { this._street = c; }}
            value={this.props.street}
            onChange={this.handleChange}/>

        <label
            className={isValid ? undefined : 'usa-input-error-label'}
            htmlFor={`${this.id}-city`}>
          City
        </label>
        <input type="text" name="city"
            className="usa-form-control"
            id={`${this.id}-city`}
            ref={(c) => { this._city = c; }}
            value={this.props.city}
            onChange={this.handleChange}/>

        <label
            className={isValid ? undefined : 'usa-input-error-label'}
            htmlFor={`${this.id}-country`}>
          Country
        </label>
        <select name="country"
            id={`${this.id}-country`}
            onChange={this.handleChange}
            ref={(c) => { this._country = c; }}
            value={this.props.country}>
          <option value=""></option>
          {options}
        </select>

        <State value={this.props.state}
            onUserInput={(update) => {this.props.onStateChange('state', update);}}/>

        <label
            className={isValid ? undefined : 'usa-input-error-label'}
            htmlFor={`${this.id}-zipcode`}>
          Zip Code
        </label>
        <input type="text" name="zipcode"
            className="usa-form-control"
            id={`${this.id}-zipcode`}
            ref={(c) => { this._zipcode = c; }}
            value={this.props.zipcode}
            onChange={this.handleChange}/>

        <label
            className={isValid ? undefined : 'usa-input-error-label'}
            htmlFor={`${this.id}-county`}>
          County
        </label>
        <input type="text" name="county"
            className="usa-form-control"
            id={`${this.id}-county`}
            ref={(c) => { this._county = c; }}
            value={this.props.county}
            onChange={this.handleChange}/>
      </div>
    );
  }
}

export default Address;
