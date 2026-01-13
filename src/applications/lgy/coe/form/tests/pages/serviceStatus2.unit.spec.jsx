import { expect } from 'chai';
import serviceStatus2 from '../../pages/serviceStatus2';

describe('COE serviceStatus2 page', () => {
  it('has the identity field in the UI schema', () => {
    expect(serviceStatus2.uiSchema).to.have.property('identity');
  });

  it('requires the identity field in the schema', () => {
    expect(serviceStatus2.schema.required).to.deep.equal(['identity']);
  });
});
