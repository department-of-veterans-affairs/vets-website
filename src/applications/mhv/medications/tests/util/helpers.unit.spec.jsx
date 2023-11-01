import { expect } from 'chai';
import * as helpers from '../../util/helpers';
import { imageRootUri } from '../../util/constants';

describe('Date Format function', () => {
  it("should return 'None noted'", () => {
    expect(helpers.dateFormat()).to.equal('None noted');
  });
  it('should return a formatted date', () => {
    expect(
      helpers.dateFormat('2023-10-26T20:18:00.000Z', 'MMMM D, YYYY'),
    ).to.equal('October 26, 2023');
  });
});

describe('Generate PDF function', () => {
  it('should throw an error', () => {
    const error = helpers.generateMedicationsPDF();
    expect(error).to.exist;
  });
});

describe('Validate Field function', () => {
  it('should return the value', () => {
    expect(helpers.validateField('Test')).to.equal('Test');
  });

  it("should return 'None noted'", () => {
    expect(helpers.validateField()).to.equal('None noted');
  });

  it('should return 0', () => {
    expect(helpers.validateField(0)).to.equal(0);
  });
});

describe('Image URI function', () => {
  it('should return the URI', () => {
    expect(helpers.getImageUri('1test')).to.equal(
      `${imageRootUri}1/NDC1test.jpg`,
    );
  });

  it('should support OTHER folder', () => {
    expect(helpers.getImageUri()).to.equal(
      `${imageRootUri}other/NDCundefined.jpg`,
    );
  });
});
