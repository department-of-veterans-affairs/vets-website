import { expect } from 'chai';

import { isBot, canInitDatadog } from '../utilities';

describe('isBot', () => {
  it('should return true for a known bot user agent', () => {
    expect(isBot('Mozilla/5.0 (compatible; Googlebot/2.1)')).to.be.true;
    expect(isBot('Mozilla/5.0 (content crawler spider)')).to.be.true;
    expect(isBot('Mozilla/5.0 IOI')).to.be.true;
  });

  it('should return false for a non-bot user agent', () => {
    expect(isBot('Mozilla/5.0 (Windows NT 10.0; Win64; x64)')).to.be.false;
    expect(isBot('AppleWebKit/537.36 (KHTML, like Gecko)')).to.be.false;
  });
});

describe('canInitDatadog', () => {
  let undef;
  const getProps = (local, mocha = undef, cypress = undef, agent = undef) => ({
    env: { isLocalhost: () => local },
    win: { Mocha: mocha, Cypress: cypress },
    agent,
  });

  it('should return true for production & dev environment', () => {
    expect(canInitDatadog(getProps(false))).to.be.true;
  });

  context('should return false', () => {
    it('should return false local environment', () => {
      expect(canInitDatadog(getProps(true))).to.be.false;
    });
    it('should return false when running unit tests', () => {
      expect(canInitDatadog(getProps(false, {}))).to.be.false;
    });
    it('should return false when running E2E tests', () => {
      expect(canInitDatadog(getProps(false, undef, {}))).to.be.false;
    });
    it('should return false when a bot is running the site', () => {
      expect(canInitDatadog(getProps(false, undef, undef, 'Googlebot'))).to.be
        .false;
    });
  });
});
