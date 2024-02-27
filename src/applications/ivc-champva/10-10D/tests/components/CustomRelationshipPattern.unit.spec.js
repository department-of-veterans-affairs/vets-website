import { expect } from 'chai';
import { relationshipToVeteranUI } from '../../components/CustomRelationshipPattern';

describe('Custom relationship pattern', () => {
  it('should default to veteran', () => {
    const relationship = relationshipToVeteranUI();
    expect(relationship.relationshipToVeteran?.['ui:title']).to.contain(
      'Veteran',
    );
  });
  it('should use functions for titles', () => {
    const relationship = relationshipToVeteranUI({
      relativeTitle: () => '',
    });
    expect(relationship.relationshipToVeteran['ui:title']).to.exist;
  });
  it('should allow past-tense wording', () => {
    const relationship = relationshipToVeteranUI({ tense: 'past' });
    expect(relationship.relationshipToVeteran?.['ui:title']).to.contain(
      'What’s your relationship',
    );
  });
});
