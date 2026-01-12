import { expect } from 'chai';
import purpleHeartRecipient from '../../../pages/purpleHeartRecipient';

describe('COE purpleHeartRecipient page', () => {
  it('renders the purpleHeartRecipient yes/no field', () => {
    expect(purpleHeartRecipient.uiSchema).to.have.property('militaryHistory');
    expect(purpleHeartRecipient.uiSchema.militaryHistory).to.have.property(
      'purpleHeartRecipient',
    );
  });
  it('renders the accordion view field', () => {
    expect(purpleHeartRecipient.uiSchema).to.have.property(
      'view:purpleHeartWhyAccordion',
    );
  });
  it('requires the purpleHeartRecipient field in the schema', () => {
    expect(
      purpleHeartRecipient.schema.properties.militaryHistory.required,
    ).to.deep.equal(['purpleHeartRecipient']);
  });
});
