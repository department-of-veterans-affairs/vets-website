import { USA } from '@@vap-svc/constants';

export const getInitialFormValues = ({ props }) => {
  let initialFormValues;

  if (props.type === 'address') {
    initialFormValues = this.props.modalData ||
      this.transformInitialFormValues(this.props.data) || {
        countryCodeIso3: USA.COUNTRY_ISO3_CODE,
      };
  }

  if (props.type === 'phone') {
    initialFormValues = {
      countryCode: '1',
      extension: '',
      inputPhoneNumber: '',
      isTextable: false,
      isTextPermitted: false,
      'view:showSMSCheckbox': props.showSMSCheckbox,
    };

    if (props.data) {
      const {
        data,
        data: { extension, areaCode, phoneNumber, isTextPermitted },
        showSMSCheckbox,
      } = props;
      initialFormValues = {
        ...data,
        extension: extension || '',
        inputPhoneNumber: `${areaCode}${phoneNumber}`,
        isTextPermitted: isTextPermitted || false,
        'view:showSMSCheckbox': showSMSCheckbox,
      };
    }
  }

  if (props.type === 'email') {
    initialFormValues = props.data
      ? { ...this.props.data }
      : { emailAddress: '' };
  }

  return initialFormValues;
};
