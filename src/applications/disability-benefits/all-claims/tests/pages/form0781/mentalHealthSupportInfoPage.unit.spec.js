import { expect } from 'chai';

import * as mentalHealthSupportInfoPage from '../../../pages/form0781/mentalHealthSupportInfoPage';

describe('Form 0781 manual upload page', () => {
  it('should define a uiSchema object', () => {
    expect(mentalHealthSupportInfoPage.uiSchema).to.be.an('object');
  });

  it('should define a schema object', () => {
    expect(mentalHealthSupportInfoPage.schema).to.be.an('object');
  });
});
