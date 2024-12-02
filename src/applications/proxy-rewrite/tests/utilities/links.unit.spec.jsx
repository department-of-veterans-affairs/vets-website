import { expect } from 'chai';
import { updateLinkDomain } from '../../utilities/links';

describe('updateLinkDomain utility', () => {
  it('should correctly format a relative link', () => {
    expect(updateLinkDomain('/health-care')).to.equal(
      'https://www.va.gov/health-care',
    );
  });

  it('should correctly format a staging link with www', () => {
    expect(updateLinkDomain('https://www.staging.va.gov/health-care')).to.equal(
      'https://www.va.gov/health-care',
    );
  });

  it('should correctly format a staging link without www', () => {
    expect(updateLinkDomain('https://staging.va.gov/health-care')).to.equal(
      'https://www.va.gov/health-care',
    );
  });

  it('should correctly format a localhost:3001 link', () => {
    expect(updateLinkDomain('http://localhost:3001/health-care')).to.equal(
      'https://www.va.gov/health-care',
    );
  });

  it('should correctly format a staging link without www', () => {
    expect(updateLinkDomain('http://localhost:3002/health-care')).to.equal(
      'https://www.va.gov/health-care',
    );
  });

  it('should correctly format a prod link without www', () => {
    expect(updateLinkDomain('https://va.gov/health-care')).to.equal(
      'https://www.va.gov/health-care',
    );
  });

  it('should correctly return a link that does not fit into any of the given domains', () => {
    expect(updateLinkDomain('https://prevention.va.gov')).to.equal(
      'https://prevention.va.gov',
    );
  });
});
