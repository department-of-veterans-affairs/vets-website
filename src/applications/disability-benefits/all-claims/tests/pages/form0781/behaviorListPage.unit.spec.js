import { expect } from 'chai';
import * as behaviorListPage from '../../../pages/form0781/behaviorListPage';

describe('Behavior List Page', () => {
  it('should define a uiSchema object', () => {
    expect(behaviorListPage.uiSchema).to.be.an('object');
  });

  it('should define a schema object', () => {
    expect(behaviorListPage.schema).to.be.an('object');
  });
});
