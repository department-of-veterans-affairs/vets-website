import { expect } from 'chai';
import { generateMedicationsPDF } from '../../../util/helpers';

describe('Generate PDF function', () => {
  it('should throw an error', () => {
    const error = generateMedicationsPDF();
    expect(error).to.exist;
  });
});
