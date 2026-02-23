import { expect } from 'chai';
import { extractDisabilityLabels } from '../../../helpers/disabilityOptions';

describe('21-8940 disabilityOptions helpers', () => {
  it('returns unique, trimmed labels from mixed entries', () => {
    const result = extractDisabilityLabels({
      disabilityDescription: [
        ' Knee pain ',
        { disability: 'PTSD' },
        { name: 'Tinnitus' },
        { disability: 'Knee pain' },
        '  ',
        123,
        null,
      ],
    });

    expect(result).to.deep.equal(['Knee pain', 'PTSD', 'Tinnitus']);
  });

  it('accepts objects with data, records, or items arrays', () => {
    const fromData = extractDisabilityLabels({
      disabilityDescription: { data: ['A'] },
    });
    const fromRecords = extractDisabilityLabels({
      disabilityDescription: { records: ['B'] },
    });
    const fromItems = extractDisabilityLabels({
      disabilityDescription: { items: ['C'] },
    });

    expect(fromData).to.deep.equal(['A']);
    expect(fromRecords).to.deep.equal(['B']);
    expect(fromItems).to.deep.equal(['C']);
  });

  it('returns an empty array for unsupported inputs', () => {
    expect(
      extractDisabilityLabels({ disabilityDescription: 42 }),
    ).to.deep.equal([]);
    expect(extractDisabilityLabels()).to.deep.equal([]);
  });
});
