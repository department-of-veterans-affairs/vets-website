// Node modules.
import { expect } from 'chai';
// Relative imports.
import { deriveStorage } from '.';

describe('deriveStorage', () => {
  it('uses localStorage by default', () => {
    expect(deriveStorage()?.constructor?.name).to.equal('Storage');
  });

  it('uses undefined when dismissibleStatus is "perm"', () => {
    const banner = {
      dataset: {
        dismissibleStatus: 'perm',
      },
    };

    expect(deriveStorage(banner)).to.equal(undefined);
  });

  it('uses sessionStorage when dismissibleStatus is "dismiss-session"', () => {
    const banner = {
      dataset: {
        dismissibleStatus: 'dismiss-session',
      },
    };

    expect(deriveStorage(banner)?.constructor?.name).to.equal('Storage');
  });

  it('uses localStorage when dismissibleStatus is "dismiss"', () => {
    const banner = {
      dataset: {
        dismissibleStatus: 'dismiss',
      },
    };

    expect(deriveStorage(banner)?.constructor?.name).to.equal('Storage');
  });
});
