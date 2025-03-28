import { expect } from 'chai';
import { getAuthError } from '../../authentication/errors';

describe('getAuthError', () => {
  it('should return a 007 for an unknown error', () => {
    const { errorCode } = getAuthError('150');
    expect(errorCode).to.eql('007');
  });
  it('should return the appropriately mapped error', () => {
    const { errorCode } = getAuthError('009');
    expect(errorCode).to.eql('009');
  });
});
