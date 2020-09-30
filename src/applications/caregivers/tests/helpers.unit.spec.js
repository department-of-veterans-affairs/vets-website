import { submitTransform } from '../helpers';
import { expect } from 'chai';
import formConfig from 'applications/caregivers/config/form';
import { formWithReplacedData } from './e2e/fixtures/data/formObject';
// import { isValidForm } from 'platform/forms-system/src/js/validation';
// import { createFormPageList } from 'platform/forms-system/src/js/helpers';

// data
import requiredOnly from './e2e/fixtures/data/requiredOnly.json';
import oneSecondaryCaregivers from './e2e/fixtures/data/oneSecondaryCaregivers.json';
import twoSecondaryCaregivers from './e2e/fixtures/data/twoSecondaryCaregivers.json';

describe('Caregivers helpers', () => {
  it('should transform required parties correctly', () => {
    // const isFormValid = await isValidForm(form, pageList);
    // const pageList = createFormPageList(formConfig);
    const form = formWithReplacedData(requiredOnly);

    const transformedData = submitTransform(formConfig, form);
    const payloadData = JSON.parse(transformedData);
    const payloadObject = JSON.parse(
      payloadData.caregiversAssistanceClaim.form,
    );

    expect(!!payloadObject.veteran).to.be.true;
    expect(!!payloadObject.primaryCaregiver).to.be.true;
    expect(!!payloadObject.secondaryOne).to.be.false;
    expect(!!payloadObject.secondaryTwo).to.be.false;
  });

  it('should transform required parties plus Secondary One correctly', () => {
    const form = formWithReplacedData(oneSecondaryCaregivers);

    const transformedData = submitTransform(formConfig, form);
    const payloadData = JSON.parse(transformedData);
    const payloadObject = JSON.parse(
      payloadData.caregiversAssistanceClaim.form,
    );

    expect(!!payloadObject.veteran).to.be.true;
    expect(!!payloadObject.primaryCaregiver).to.be.true;
    expect(!!payloadObject.secondaryCaregiverOne).to.be.true;
    expect(!!payloadObject.secondaryCaregiverTwo).to.be.false;
  });

  it('should transform all parties correctly', () => {
    const form = formWithReplacedData(twoSecondaryCaregivers);

    const transformedData = submitTransform(formConfig, form);
    const payloadData = JSON.parse(transformedData);
    const payloadObject = JSON.parse(
      payloadData.caregiversAssistanceClaim.form,
    );

    expect(!!payloadObject.veteran).to.be.true;
    expect(!!payloadObject.primaryCaregiver).to.be.true;
    expect(!!payloadObject.secondaryCaregiverOne).to.be.true;
    expect(!!payloadObject.secondaryCaregiverTwo).to.be.true;
  });
});
