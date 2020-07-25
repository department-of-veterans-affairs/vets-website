import { expect } from 'chai';
import sinon from 'sinon';

import { saveFormApi } from 'platform/forms/save-in-progress/api';
import { submitForm } from 'platform/forms-system/src/js/actions';

export const setupFormSubmitTest = (formConfig, formData) => {
  // Actual request expects string, but interaction request expects object.
  const requestBody = JSON.parse(
    formConfig.transformForSubmit(formConfig, formData),
  );

  const testFormSubmit = async () => {
    const dispatch = sinon.spy();
    await submitForm(formConfig, formData)(dispatch);

    const [firstAction] = dispatch.firstCall.args;
    expect(firstAction.type).to.eq('SET_SUBMISSION');
    expect(firstAction.field).to.eq('status');
    expect(firstAction.value).to.eq('submitPending');

    const [secondAction] = dispatch.secondCall.args;
    expect(secondAction.type).to.eq('SET_SUBMITTED');
    expect(secondAction.response.success).to.be.true;
  };

  return [requestBody, testFormSubmit];
};

export const setupInProgressFormTest = (formConfig, formData) => {
  const returnUrl = '/form-url/review-and-submit';
  const savedAt = Date.now();
  const { formId, trackingPrefix, version } = formConfig;

  const requestBody = {
    formData,
    metadata: { returnUrl, savedAt, version },
  };

  const testSaveInProgress = async () => {
    const response = await saveFormApi(
      formId,
      formData,
      version,
      returnUrl,
      savedAt,
      trackingPrefix,
    );

    expect(response.data.attributes.formData).to.eql(formData);
  };

  return [requestBody, testSaveInProgress];
};
