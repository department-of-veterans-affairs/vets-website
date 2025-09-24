import fetch from 'isomorphic-fetch';
import { expect } from 'chai';

describe('MSW hook is active', () => {
  it('should return an empty body for GET /feature_toggles', async () => {
    const res = await fetch('http://localhost/feature_toggles');
    expect(res.status).to.equal(200);
    const text = await res.text();
    expect(text).to.equal('');
  });
});
