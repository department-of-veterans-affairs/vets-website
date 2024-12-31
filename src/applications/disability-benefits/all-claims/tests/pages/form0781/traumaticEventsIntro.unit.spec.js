import { expect } from 'chai';
import * as traumaticEvents from '../../../pages/form0781/traumaticEventsIntro';

describe('Traumatic events', () => {
  it('should define a uiSchema object', () => {
    expect(traumaticEvents.uiSchema).to.be.an('object');
  });

  it('should define a schema object', () => {
    expect(traumaticEvents.schema).to.be.an('object');
  });
});
