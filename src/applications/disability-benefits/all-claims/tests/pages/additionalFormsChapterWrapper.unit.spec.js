import { expect } from 'chai';
import * as additionalFormsChapterWrapper from '../../pages/additionalFormsChapterWrapper';

describe('Additional Forms chapter wrapper page', () => {
  it('should define a uiSchema object', () => {
    expect(additionalFormsChapterWrapper.uiSchema).to.be.an('object');
  });

  it('should define a schema object', () => {
    expect(additionalFormsChapterWrapper.schema).to.be.an('object');
  });
});
