// This is a temporary file used to test that the output from the transform function
//  isn't changing as I'm refactoring it. This file should not be committed to master.

import fs from 'fs';
import path from 'path';
import { expect } from 'chai';

import formConfig from '../../../config/form';

const files = fs.readdirSync(path.join(__dirname, '..'));
files.filter(file => file.endsWith('json')).forEach(file => {
  it(`should validate ${file}`, () => {
    const contents = JSON.parse(
      fs.readFileSync(path.join(__dirname, '..', file), 'utf8'),
    );
    const submitData = JSON.parse(
      formConfig.transformForSubmit(formConfig, contents),
    );

    expect(submitData).to.eql(
      JSON.parse(fs.readFileSync(path.join(__dirname, file))),
    );
  });
});
