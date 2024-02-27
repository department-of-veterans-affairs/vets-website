import { expect } from 'chai';
import { relationshipToVeteranUI } from '../../components/CustomRelationshipPattern';

describe('Custom relationship pattern', () => {
  it('should default to veteran', async () => {
    const relationship = relationshipToVeteranUI();
    expect(relationship.relationshipToVeteran?.['ui:title']).to.contain(
      'Veteran',
    );
  });
});

describe('Custom relationship pattern', () => {
  it('should use functions for titles', async () => {
    const relationship = relationshipToVeteranUI({
      relativeTitle: () => '',
    });
    expect(relationship.relationshipToVeteran['ui:title']).to.exist;
  });
});

describe('Custom relationship pattern', () => {
  it('should allow past-tense wording', async () => {
    const relationship = relationshipToVeteranUI({ tense: 'past' });
    expect(relationship.relationshipToVeteran?.['ui:title']).to.contain(
      'What’s your relationship',
    );
  });
});
