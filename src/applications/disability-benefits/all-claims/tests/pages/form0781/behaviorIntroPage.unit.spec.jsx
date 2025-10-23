import { expect } from 'chai';
import * as behaviorIntroPage from '../../../pages/form0781/behaviorIntroPage';

describe('Behavior Intro Page', () => {
  it('should define a uiSchema object', () => {
    expect(behaviorIntroPage.uiSchema).to.be.an('object');
  });

  it('should define a schema object', () => {
    expect(behaviorIntroPage.schema).to.be.an('object');
  });
});
