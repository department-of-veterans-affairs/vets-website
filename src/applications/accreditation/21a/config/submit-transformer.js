import _ from 'platform/utilities/data';

import { transformForSubmit as platformTransformForSubmit } from '~/platform/forms-system/exportsFile';

const transformForSubmit = (formConfig, form) => {
  let formData = {};

  const setName = () => {

    formData['firstName'] = form.data.fullName.first;
    formData['lastName'] = form.data.fullName.last;
    
    if(form.data.fullName?.middle) formData['middleName'] = form.data.fullName.middle;
    if(form.data.fullName?.suffix) formData['suffix'] = form.data.fullName.suffix;
  };

  const setHomeAddress = () => {
    formData['homeAddress'] = {};
    formData['homeAddress'].addressType = form.data.homeAddress.isMilitary;
    formData['homeAddress'].line1 = form.data.homeAddress.street;
    if(form.data.homeAddress?.street2) formData['homeAddress'].line2 = form.data.homeAddress.street2;
    formData['homeAddress'].city = form.data.homeAddress.city;
    formData['homeAddress'].postalCode = form.data.homeAddress.postalCode;
    formData['homeAddress'].country = form.data.homeAddress.country;
  }

  const setContactInfo = () => {
    formData['homePhone'] = form.data.phone;
    formData['phoneType'] = {};
    formData['phoneType'].name = form.data.typeOfPhone;
    formData['homeEmail'] = form.data.email;
  };
  console.log('formData');
  console.log(formData);
  console.log('dpone');

  setName();
  setHomeAddress();
  setContactInfo();

  return JSON.stringify({ ...formData });
};

export default transformForSubmit;
