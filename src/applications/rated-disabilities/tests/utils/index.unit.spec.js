import { expect } from 'chai';
import { isClientError, isServerError } from '../../util';

describe('Error Handling', () => {
  it('should detect a server error', () => {
    expect(isServerError(503)).to.be.true;
    expect(isServerError(400)).to.be.false;
  });

  it('should detect a client error', () => {
    expect(isClientError(404)).to.be.true;
    expect(isClientError(500)).to.be.false;
  });
});
