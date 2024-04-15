import { expect } from 'chai';
import { extractLocation } from '../../reducers/vitals';
import { EMPTY_FIELD } from '../../util/constants';

describe('extractLocation function', () => {
  it('should return the location name when vital.performer[0].extension[0].valueReference.reference is valid', () => {
    const vital = {
      contained: [{ id: 'location1', name: 'Location Name' }],
      performer: [
        { extension: [{ valueReference: { reference: '#location1' } }] },
      ],
    };
    expect(extractLocation(vital)).to.eq('Location Name');
  });

  it('should return EMPTY_FIELD when vital.performer is not an array or empty', () => {
    const vital = {};
    expect(extractLocation(vital)).to.eq(EMPTY_FIELD);

    vital.performer = [];
    expect(extractLocation(vital)).to.eq(EMPTY_FIELD);
  });

  it('should return EMPTY_FIELD when vital.performer[0].extension is not an array or empty', () => {
    const vital = {
      performer: [{}],
    };
    expect(extractLocation(vital)).to.eq(EMPTY_FIELD);

    vital.performer[0].extension = [];
    expect(extractLocation(vital)).to.eq(EMPTY_FIELD);
  });

  it('should return EMPTY_FIELD when vital.performer[0].extension[0].valueReference.reference is not present', () => {
    const vital = {
      performer: [{ extension: [{}] }],
    };
    expect(extractLocation(vital)).to.eq(EMPTY_FIELD);
  });

  it('should return EMPTY_FIELD when extractContainedResource returns a location without a name', () => {
    const vital = {
      contained: [{ id: 'location1' }],
      performer: [
        { extension: [{ valueReference: { reference: '#location1' } }] },
      ],
    };

    expect(extractLocation(vital)).to.eq(EMPTY_FIELD);
  });
});
