import { expect } from 'chai';
import disabilitySeparation from '../../../pages/disabilitySeparation';

describe('COE disabilitySeparation page', () => {
  it('renders the separatedDueToDisability yes/no field', () => {
    expect(disabilitySeparation.uiSchema).to.have.property('militaryHistory');
    expect(disabilitySeparation.uiSchema.militaryHistory).to.have.property(
      'separatedDueToDisability',
    );
  });

  it('requires the separatedDueToDisability field in the schema', () => {
    expect(
      disabilitySeparation.schema.properties.militaryHistory.required,
    ).to.deep.equal(['separatedDueToDisability']);
  });
});
