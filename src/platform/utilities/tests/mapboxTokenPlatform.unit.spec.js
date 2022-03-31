import { expect } from 'chai';

import environment from 'platform/utilities/environment';
import mapboxTokenPlatform from '../mapboxTokenPlatform';

const fallback = 'Tried Utilizing fallback but Fallback not found';
const dev =
  'pk.eyJ1IjoiYWRob2MiLCJhIjoiY2tvbHI5aDQ2MDAxaTJvcW5xYThremM1MyJ9.pEZjlJcYPfCNwoUEnMnagg';
const prod =
  'pk.eyJ1IjoiYWRob2MiLCJhIjoiY2l2Y3VlNWp5MDBoNjJvbHZ2a3R4bnN2cyJ9.2LoUhwRmz2OiCtRirnc6Pw';
export const expectedToken = environment.isProduction() ? prod : dev;

describe('mapboxTokenPlatform', () => {
  it('should match expected token', () => {
    mapboxTokenPlatform.then(
      result => {
        expect(result).to.satisfy(token => {
          !!(token === expectedToken || token === fallback);
        });
      },
      err => {
        throw new Error(err);
      },
    );
  });
});
