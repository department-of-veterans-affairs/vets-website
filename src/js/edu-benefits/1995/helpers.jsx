import React from 'react';
import _ from 'lodash/fp';
import { transformForSubmit } from '../../common/schemaform/helpers';

export const bankAccountChangeLabels = {
  startUpdate: 'Start or update direct deposit',
  stop: 'Stop direct deposit',
  noChange: 'No change to payment method'
};

export const preferredContactMethodLabels = {
  mail: 'Mail',
  email: 'Email',
  phone: 'Phone'
};

export function transform(formConfig, form) {
  // All the king's horses and all the king's men
  //  Put newSchool back together again.
  const repairedForm = _.set('newSchool.data.newSchool', {
    name: form.newSchool.data.newSchoolName,
    address: form.newSchool.data.newSchoolAddress
  }, form);
  delete repairedForm.newSchool.data.newSchoolName;
  delete repairedForm.newSchool.data.newSchoolAddress;

  const formData = transformForSubmit(formConfig, repairedForm);
  return JSON.stringify({
    educationBenefitsClaim: {
      form: formData
    }
  });
}

export const directDepositWarning = (
  <div className="edu-dd-warning">
    The Department of Treasury requires all Federal benefit payments be made by electronic funds transfer (EFT), also called direct deposit (direct deposit isn't an option for Chapter 32 (VEAP) recipients). If you don't have a bank account, you must get your payment through Direct Express Debit MasterCard. To request a Direct Express Debit MasterCard you must apply at <a href="http://www.usdirectexpress.com" target="_blank">www.usdirectexpress.com</a> or by telephone at <a href="tel:8003331795" target="_blank">800-333-1795</a>. If you chose not to enroll, you must contact representatives handling waiver requests for the Department of Treasury at <a href="tel:8882242950" target="_blank">888-224-2950</a>. They will address any questions or concerns you may have and encourage your participation in EFT.
  </div>
);
