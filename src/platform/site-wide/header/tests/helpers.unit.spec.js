import { expect } from 'chai';
import { createShouldShowMinimal } from '../helpers';

describe('Header helper functions', () => {
  it('createShouldShowMinimal should return a function that properly parses exclude paths', () => {
    const minimalHeaderEnabled = true;
    const excludePaths = ['/introduction', '/confirmation'];
    const showMinimal = createShouldShowMinimal({
      enabled: minimalHeaderEnabled,
      excludePaths,
    });

    expect(showMinimal('/introduction')).to.be.false;
    expect(showMinimal('/introduction-to-forms')).to.be.true;
    expect(showMinimal('/confirmation')).to.be.false;
    expect(showMinimal('/some-other-path')).to.be.true;
    expect(showMinimal(undefined)).to.be.true;
    expect(showMinimal(null)).to.be.true;
  });

  it('createShouldShowMinimal should always return true if enabled and excludePaths not provided', () => {
    const minimalHeaderEnabled = true;
    const excludePaths = undefined;
    const showMinimal = createShouldShowMinimal({
      enabled: minimalHeaderEnabled,
      excludePaths,
    });

    expect(showMinimal).to.be.true;
  });

  it('createShouldShowMinimal should always return false if not enabled', () => {
    const minimalHeaderEnabled = false;
    const excludePaths = ['/introduction', '/confirmation'];
    const showMinimal = createShouldShowMinimal({
      enabled: minimalHeaderEnabled,
      excludePaths,
    });

    expect(showMinimal).to.be.false;
  });

  it('createShouldShowMinimal should return true if excludePaths is empty', () => {
    const minimalHeaderEnabled = true;
    const excludePaths = [];
    const showMinimal = createShouldShowMinimal({
      enabled: minimalHeaderEnabled,
      excludePaths,
    });

    expect(showMinimal).to.be.true;
  });
});
