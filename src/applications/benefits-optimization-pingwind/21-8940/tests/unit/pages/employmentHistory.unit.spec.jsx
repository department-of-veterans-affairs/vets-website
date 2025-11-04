import { expect } from 'chai';
import formConfig from '../../../config/form';

const {
  schema,
} = formConfig.chapters.employmentHistoryChapter.pages.employmentHistory;

describe('8940 employmentHistory page schema basics', () => {
  it('defines employersHistory array', () => {
    expect(schema.properties.employersHistory).to.exist;
  });
});
