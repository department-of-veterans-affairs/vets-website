import { states } from 'platform/forms/address';
import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

export const MDOT_ERROR_MESSAGES = Object.freeze({
  MDOT_SUPPLIES_NOT_FOUND: {
    ALERT_BOX: ({ reorderDate }) => (
      <AlertBox
        status="warning"
        headline="You can't reorder your items at this time"
      >
        <div className="vads-u-display--flex vads-u-flex-direction--column">
          <span>
            Our records show that your items arent available for reorder until{' '}
            {reorderDate}. You can only order items once every 5 months.
          </span>
          <span className="vads-u-margin-top--1">
            If you need an item sooner, call the DLC Customer Service Section at{' '}
            <a href="tel:303-273-6200">303-273-6200</a> or email{' '}
            <a href="mailto:dalc.css@va.gov">dalc.css@va.gov</a>.
          </span>
        </div>
      </AlertBox>
    ),
  },
  MDOT_VETERAN_NOT_FOUND: {
    ALERT_BOX: _props => (
      <AlertBox
        status="warning"
        headline="We can't find your records in our system"
      >
        <div className="vads-u-display--flex vads-u-flex-direction--column">
          <span>
            You can't order hearing aid batteries or accessories at this time
            because we can't find your records in our system or we're missing
            some information needed for you to order.
          </span>

          <span className="vads-u-margin-top--1">
            If you think this is incorrect, call your audiologist to update your
            record.{' '}
            <a
              href="https://www.va.gov/find-locations/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Find contact information for your local medical center.
            </a>
          </span>
        </div>
      </AlertBox>
    ),
  },
  MDOT_DECEASED_VETERAN: {
    ALERT_BOX: _props => (
      <AlertBox
        status="warning"
        headling="Our records show that this Veteran is deceased"
      >
        <div className="vads-u-display--flex vads-u-flex-direction--column">
          <span>We can't fulfill an order for this Veteran</span>
          <span className="vads-u-margin-top--1">
            If this information is incorrect, please call Veterans Benefits
            Assistance at <a href="tel:800-827-1000">800-827-1000</a>, Monday
            through Friday, 8:00 a.m. to 9:00 p.m. E.T.
          </span>
        </div>
      </AlertBox>
    ),
  },
});

export const MDOT_API_ERROR = 'MDOT_API_ERROR';
export const MDOT_RESET_ERRORS = 'MDOT_RESET_ERRORS';
export const MDOT_API_CALL_INITIATED = 'MDOT_API_CALL_INITIATED';

export const schemaFields = {
  fullName: 'vetFullName',
  permAddressField: 'permanentAddress',
  tempAddressField: 'temporaryAddress',
  emailField: 'email',
  confirmationEmailField: 'confirmationEmail',
  suppliesField: 'supplies',
  viewAddBatteriesField: 'view:AddBatteries',
  currentAddressField: 'currentAddress',
  newAddressField: 'newAddress',
  typeOfNewAddressField: 'typeOfNewAddress',
};

export const militaryStates = states.USA.filter(
  state => state.value === 'AE' || state.value === 'AP' || state.value === 'AA',
).map(state => state.value);

export const militaryLabels = states.USA.filter(
  state => state.value === 'AE' || state.value === 'AP' || state.value === 'AA',
).map(state => state.label);

export const militaryCities = ['APO', 'DPO', 'FPO'];
export const USA = 'USA';
export const CAN = 'CAN';
export const MEX = 'MEX';
export const states50AndDC = [
  { label: 'Alabama', value: 'AL' },
  { label: 'Alaska', value: 'AK' },
  { label: 'Arizona', value: 'AZ' },
  { label: 'Arkansas', value: 'AR' },
  { label: 'California', value: 'CA' },
  { label: 'Colorado', value: 'CO' },
  { label: 'Connecticut', value: 'CT' },
  { label: 'Delaware', value: 'DE' },
  { label: 'District Of Columbia', value: 'DC' },
  { label: 'Florida', value: 'FL' },
  { label: 'Georgia', value: 'GA' },
  { label: 'Hawaii', value: 'HI' },
  { label: 'Idaho', value: 'ID' },
  { label: 'Illinois', value: 'IL' },
  { label: 'Indiana', value: 'IN' },
  { label: 'Iowa', value: 'IA' },
  { label: 'Kansas', value: 'KS' },
  { label: 'Kentucky', value: 'KY' },
  { label: 'Louisiana', value: 'LA' },
  { label: 'Maine', value: 'ME' },
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
  { label: 'Ohio', value: 'OH' },
  { label: 'Oklahoma', value: 'OK' },
  { label: 'Oregon', value: 'OR' },
  { label: 'Pennsylvania', value: 'PA' },
  { label: 'Rhode Island', value: 'RI' },
  { label: 'South Carolina', value: 'SC' },
  { label: 'South Dakota', value: 'SD' },
  { label: 'Tennessee', value: 'TN' },
  { label: 'Texas', value: 'TX' },
  { label: 'Utah', value: 'UT' },
  { label: 'Vermont', value: 'VT' },
  { label: 'Virginia', value: 'VA' },
  { label: 'Washington', value: 'WA' },
  { label: 'West Virginia', value: 'WV' },
  { label: 'Wisconsin', value: 'WI' },
  { label: 'Wyoming', value: 'WY' },
];

export const HEARING_AID_ACCESSORIES = 'hearing aid accessories';
export const HEARING_AID_BATTERIES = 'hearing aid batteries';
export const BLUE_BACKGROUND =
  'radio-button vads-u-background-color--primary button-dimensions vads-u-color--white vads-u-border-color--primary vads-u-border--2px';
export const WHITE_BACKGROUND =
  'radio-button vads-u-background-color--white vads-u-color--link-default button-dimensions vads-u-border-color--primary vads-u-border--2px';
