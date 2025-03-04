import { expect } from 'chai';
import * as behaviorIntroCombatPage from '../../../pages/form0781/behaviorIntroCombatPage';

describe('Behavior Intro Page when Combat is the only type selected', () => {
  it('should define a uiSchema object', () => {
    expect(behaviorIntroCombatPage.uiSchema).to.be.an('object');
  });

  it('should define a schema object', () => {
    expect(behaviorIntroCombatPage.schema).to.be.an('object');
  });
});
