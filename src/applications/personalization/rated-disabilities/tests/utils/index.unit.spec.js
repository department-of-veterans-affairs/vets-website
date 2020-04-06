import { isClientError, isServerError } from '../../util';

describe('Error Handling', () => {
  it('should detect a server error', () => {
    expect(isServerError(503)).toBe(true);
    expect(isServerError(400)).toBe(false);
  });

  it('should detect a client error', () => {
    expect(isClientError(404)).toBe(true);
    expect(isClientError(500)).toBe(false);
  });
});
