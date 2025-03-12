import { expect } from 'chai';
import _ from 'lodash';
import formConfig from '../config/form';
import { transform } from '../submit-transformer';
import maximal from './e2e/fixtures/data/maximal.json';

describe('transform', () => {
  it('should transform Form', () => {
    const clonedData = _.cloneDeep(maximal);
    clonedData.data.prefillBankAccount = {
      accountType: 'Checking',
      accountNumber: '*********1234',
      routingNumber: '*****2115',
      bankAccountType: '01234567889',
    };

    const transformedResult = JSON.parse(transform(formConfig, clonedData));
    const form = JSON.parse(transformedResult.educationBenefitsClaim.form);
    expect(form).to.not.be.null;
  });
  it('should transform Form vetTecPrograms', () => {
    const clonedData = _.cloneDeep(maximal);
    clonedData.data.vetTecPrograms = {
      'ui:options': {
        itemName: 'Program',
        viewField: {},
      },
    };
    const transformedResult = JSON.parse(transform(formConfig, clonedData));
    const form = JSON.parse(transformedResult.educationBenefitsClaim.form);
    expect(form).to.not.be.null;
  });
  it('should not transform missing view:phoneAndEmail', () => {
    const clonedData = _.cloneDeep(maximal);
    delete clonedData.data['view:phoneAndEmail'];
    const transformedResult = JSON.parse(transform(formConfig, clonedData));
    const form = JSON.parse(transformedResult.educationBenefitsClaim.form);
    expect(form).to.not.be.null;
  });
});
