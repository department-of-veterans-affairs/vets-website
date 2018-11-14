import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import { Validator } from 'jsonschema';

import get from '../../../../../platform/utilities/data/get';

import formConfig from '../../config/form';
import fullSchema from '../../config/schema';

const conditionListPaths = [
  'powDisabilities',
  'vaTreatmentFacilities.relatedDisabilities',
];

/**
 * Returns a list of conditions that don't have a matching claimed condition.
 * @param {Object} data - The form data after it's been transformed
 * @return {Array<String>} - An array of condition names that aren't being claimed
 */
function getMismatchedConditions(data) {
  const claimedConditions = data.ratedDisabilities
    ? data.ratedDisabilities.map(d => d.name)
    : [];
  if (data.newDisabilities) {
    data.newDisabilities.forEach(d => claimedConditions.push(d.condition));
  }

  const unmatchedConditions = new Set();
  conditionListPaths.forEach(dataPath => {
    const relatedConditions = get(dataPath, data, []);
    relatedConditions.forEach(name => {
      if (!claimedConditions.includes(name)) {
        unmatchedConditions.add(name);
      }
    });
  });

  return Array.from(unmatchedConditions);
}

describe('526 all claims schema tests', () => {
  const v = new Validator();
  const files = fs.readdirSync(__dirname);
  files.filter(file => file.endsWith('json')).forEach(file => {
    it(`should validate ${file}`, () => {
      const contents = JSON.parse(
        fs.readFileSync(path.join(__dirname, file), 'utf8'),
      );
      const submitData = JSON.parse(
        formConfig.transformForSubmit(formConfig, contents),
      ).form526;
      const result = v.validate(JSON.parse(submitData), fullSchema);

      const mismatchedConditions = getMismatchedConditions(submitData);

      if (mismatchedConditions.length) {
        // eslint-disable-next-line
        console.log(
          "Related conditions found that aren't being claimed:",
          mismatchedConditions,
        );
      }

      if (!result.valid) {
        console.log(`Validation errors found in ${file}`); // eslint-disable-line
        console.log(JSON.stringify(result.errors, null, 2)); // eslint-disable-line
      }
      expect(result.valid).to.be.true;
      expect(mismatchedConditions).to.eql([]);
    });
  });
});

describe('checkConditionNames', () => {
  it('should return a list of unmatched conditions', () => {
    const formData = {
      powDisabilities: ['Something', 'Ninja condition'],
      vaTreatmentFacilities: {
        relatedDisabilities: ['Something else', 'Ghost condition'],
      },
      ratedDisabilities: [{ name: 'Something' }],
      newDisabilities: [{ condition: 'Something else' }],
    };

    expect(getMismatchedConditions(formData)).to.eql([
      'Ninja condition',
      'Ghost condition',
    ]);
  });
});
