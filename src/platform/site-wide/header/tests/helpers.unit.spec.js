import { expect } from 'chai';
import { createShouldShowMinimalFunction } from '../helpers';

describe('Header helper functions', () => {
  it('createShouldShowMinimalFunction should return a function that properly parses exclude paths', () => {
    const minimalHeaderEnabled = true;
    const excludePaths = ['/introduction', '/confirmation'];
    const showMinimal = createShouldShowMinimalFunction({
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

  it('createShouldShowMinimalFunction should use default exclude paths if not provided', () => {
    const minimalHeaderEnabled = true;
    const excludePaths = undefined;
    const showMinimal = createShouldShowMinimalFunction({
      enabled: minimalHeaderEnabled,
      excludePaths,
    });

    expect(showMinimal('/introduction')).to.be.false;
    expect(showMinimal('/confirmation')).to.be.false;
    expect(showMinimal('/some-other-path')).to.be.true;
  });

  it('createShouldShowMinimalFunction should always return false if not enabled', () => {
    const minimalHeaderEnabled = false;
    const excludePaths = undefined;
    const showMinimal = createShouldShowMinimalFunction({
      enabled: minimalHeaderEnabled,
      excludePaths,
    });

    expect(showMinimal('/introduction')).to.be.false;
    expect(showMinimal('/confirmation')).to.be.false;
    expect(showMinimal('/some-other-path')).to.be.false;
    expect(showMinimal(undefined)).to.be.false;
    expect(showMinimal(null)).to.be.false;
  });

  it('createShouldShowMinimalFunction should allow for empty excludePaths', () => {
    const minimalHeaderEnabled = true;
    const excludePaths = [];
    const showMinimal = createShouldShowMinimalFunction({
      enabled: minimalHeaderEnabled,
      excludePaths,
    });

    expect(showMinimal('/introduction')).to.be.true;
    expect(showMinimal('/confirmation')).to.be.true;
    expect(showMinimal('/some-other-path')).to.be.true;
    expect(showMinimal(undefined)).to.be.true;
    expect(showMinimal(null)).to.be.true;
  });

  it('createShouldShowMinimalFunction should allow for custom excludePaths', () => {
    const minimalHeaderEnabled = true;
    const excludePaths = ['/new-form'];
    const showMinimal = createShouldShowMinimalFunction({
      enabled: minimalHeaderEnabled,
      excludePaths,
    });

    expect(showMinimal('/introduction')).to.be.true;
    expect(showMinimal('/confirmation')).to.be.true;
    expect(showMinimal('/new-form')).to.be.false;
  });
});
