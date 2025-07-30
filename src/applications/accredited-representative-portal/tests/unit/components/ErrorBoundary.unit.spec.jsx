import { expect } from 'chai';
import { renderHook } from '@testing-library/react-hooks';

const mockUseRouteError = error => () => {
  return error;
};
describe('ErrorBoundary', () => {
  it('should return an error', () => {
    const testError = new Error('Test error message');
    const { result } = renderHook(mockUseRouteError(testError));

    expect(result.current.message).to.equal('Test error message');
  });
});
