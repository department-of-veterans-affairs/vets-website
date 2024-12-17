import { expect } from 'chai';

import * as manualUploadPage from '../../../pages/form0781/manualUploadPage';

describe('Form 0781 manual upload page', () => {
  it('should define a uiSchema object', () => {
    expect(manualUploadPage.uiSchema).to.be.an('object');
  });

  it('should define a schema object', () => {
    expect(manualUploadPage.schema).to.be.an('object');
  });
});
