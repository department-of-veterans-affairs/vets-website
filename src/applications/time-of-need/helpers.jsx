import React from 'react';
import { transformForSubmit } from 'us-forms-system/lib/js/helpers';
import environment from '../../platform/utilities/environment';

function transform(formConfig, form) {
  const newCase = JSON.parse(transformForSubmit(formConfig, form));
  return JSON.stringify({
    newCase
  });
}

export function submit(form, formConfig) {
  const headers = {
    'Content-Type': 'application/json',
    'X-Key-Inflection': 'snake',
  };

  const body = transform(formConfig, form);

  return fetch(`${environment.API_URL}/v0/time_of_need/time_of_need_submission`, {
    body,
    headers,
    method: 'POST'
  }).then((res) => {
    if (res.ok) {
      return res.json();
    }

    return new Error('vets_client_error: Network request failed');
  }).catch(respOrError => {
    if (respOrError instanceof Response) {
      return new Error(`vets_server_error: ${respOrError.statusText}`);
    }

    return respOrError;
  });
}

export const directDepositWarning = (
  <div className="pension-dd-warning">
    The Department of Treasury requires all federal benefit payments be made by electronic funds transfer (EFT), also called direct deposit. If you don’t have a bank account, you must get your payment through Direct Express Debit MasterCard. To request a Direct Express Debit MasterCard you must apply at <a href="http://www.usdirectexpress.com" target="_blank">www.usdirectexpress.com</a> or by telephone at <a href="tel:8003331795" target="_blank">1-800-333-1795</a>. If you chose not to enroll, you must contact representatives handling waiver requests for the Department of Treasury at <a href="tel:8882242950" target="_blank">1-888-224-2950</a>. They will address any questions or concerns you may have and encourage your participation in EFT.
  </div>
);
