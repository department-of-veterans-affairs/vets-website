import { expect } from 'chai';
import { selectPrescriptionApiError } from '../../selectors/selectPrescription';

describe('selectPrescriptionApiError', () => {
  it('returns apiError when present in state', () => {
    const state = {
      rx: {
        prescriptions: {
          apiError: 'Some error',
        },
      },
    };
    expect(selectPrescriptionApiError(state)).to.equal('Some error');
  });

  it('returns undefined if apiError is missing', () => {
    const state = {
      rx: {
        prescriptions: {},
      },
    };
    expect(selectPrescriptionApiError(state)).to.be.undefined;
  });

  it('returns undefined if prescriptions is missing', () => {
    const state = {
      rx: {},
    };
    expect(selectPrescriptionApiError(state)).to.be.undefined;
  });
});
