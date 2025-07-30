import { expect } from 'chai';
import movingYesNo from '../../../pages/movingYesNo';

describe('28‑1900 movingYesNo page', () => {
  it('renders a yes/no radio button field', () => {
    expect(movingYesNo.uiSchema).to.have.property('isMoving');
  });

  it('flags the moving question radio buttons as required in the schema', () => {
    expect(movingYesNo.schema.required).to.deep.equal(['isMoving']);
  });
});
