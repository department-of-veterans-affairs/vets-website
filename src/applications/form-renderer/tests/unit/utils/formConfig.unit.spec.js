import { expect } from 'chai';
import { normalizedForm } from '../../../_config/formConfig';
import { createFormConfig } from '../../../utils/formConfig';

describe('createFormConfig', () => {
  it('returns a properly formatted Form Config object', () => {
    const formConfig = createFormConfig(normalizedForm);

    expect(formConfig.title).to.eq('Form with Two Steps');
    expect(formConfig.formId).to.eq('2121212');
    expect(formConfig.subTitle).to.eq('VA Form 2121212');
    expect(formConfig.chapters.length).to.eq(2);
  });
});
