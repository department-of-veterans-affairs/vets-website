import { expect } from 'chai';
import { hasDescriptions } from '../../../utils/responseOptions';

describe('hasDescriptions', () => {
  context('when at least one description is included', () => {
    const responseOptions = [
      {
        id: '172743',
        label: 'My described option',
        description: 'This option has optional description text.',
      },
      {
        id: '172744',
        label: 'A second option',
        description: null,
      },
    ];

    it('returns true', () => {
      expect(hasDescriptions(responseOptions)).to.eq(true);
    });
  });

  context('when no descriptions are included', () => {
    const responseOptions = [
      {
        id: '172743',
        label: 'Simple option',
        description: null,
      },
      {
        id: '172744',
        label: 'A second option',
        description: null,
      },
    ];

    it('returns false', () => {
      expect(hasDescriptions(responseOptions)).to.eq(false);
    });
  });
});
