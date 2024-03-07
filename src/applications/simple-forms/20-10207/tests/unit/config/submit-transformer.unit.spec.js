import { expect } from 'chai';

import formConfig from '../../../config/form';
import transformForSubmit from '../../../config/submit-transformer';
import fixtureVet from '../../e2e/fixtures/data/veteran.json';

const fullNameLong = {
  first: 'AbcdefghijklZZZ',
  middle: 'AZZZ',
  last: 'AbcdefghijklmnopqrZZZ',
};
const fullNameTruncated = {
  first: 'Abcdefghijkl',
  middle: 'A',
  last: 'Abcdefghijklmnopqr',
};

formConfig.chapters.preparerTypeChapter.pages.preparerTypePage.initialData = undefined;

describe('transformForSubmit', () => {
  it('truncates names for PDF', () => {
    const data = {
      data: {
        ...fixtureVet.data,
        veteranFullName: fullNameLong,
      },
    };
    const transformedData = {
      ...fixtureVet.data,
      veteranFullName: fullNameTruncated,
      formNumber: '20-10207',
    };

    const transformedResult = JSON.parse(transformForSubmit(formConfig, data));
    expect(transformedResult).to.deep.equal(transformedData);
  });
});
