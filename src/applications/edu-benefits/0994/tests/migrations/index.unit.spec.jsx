import { expect } from 'chai';
import version2 from '../../migrations/version2';

describe('Edu 0994 version2 Function', () => {
  it("should return same input when 'view:trainingProgramsChoice' is undefined", () => {
    const savedData = { formData: {} };

    const data = version2(savedData);
    expect(data).to.deep.equal(savedData);
  });
  it("should return modified input when 'view:trainingProgramsChoice' is defined", () => {
    const formData = {
      'view:trainingProgramsChoice': {},
    };
    const metadata = {};
    const result = {
      formData,
      metadata,
    };
    const savedData = { formData, metadata };
    const data = version2(savedData);
    expect(data).to.deep.equal(result);
  });
});
