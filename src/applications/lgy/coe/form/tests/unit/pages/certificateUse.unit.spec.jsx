import { expect } from 'chai';
import certificateUse from '../../../pages/certificateUse';

describe('COE certificateUse page', () => {
  it('renders the certificateUse radio field', () => {
    expect(certificateUse.uiSchema).to.have.property('loanHistory');
    expect(certificateUse.uiSchema.loanHistory).to.have.property(
      'certificateUse',
    );
  });

  it('renders the COE options accordion view field', () => {
    expect(certificateUse.uiSchema).to.have.property('view:optionsAccordion');
  });

  it('requires the certificateUse field in the schema', () => {
    expect(certificateUse.schema.properties.loanHistory.required).to.deep.equal(
      ['certificateUse'],
    );
  });
});
