import { expect } from 'chai';

import profileReducer from '../../reducers/index';

const { vaProfile } = profileReducer;

describe('index reducer', () => {
  it('should fetch hero info', () => {
    const state = vaProfile(
      {},
      {
        type: 'FETCH_HERO_SUCCESS',
        hero: 'heroContent',
      },
    );

    expect(state.hero).to.eql('heroContent');
  });

  it('should fetch personalInformation', () => {
    const state = vaProfile(
      {},
      {
        type: 'FETCH_PERSONAL_INFORMATION_SUCCESS',
        personalInformation: 'personalInformation',
      },
    );

    expect(state.personalInformation).to.eql('personalInformation');
  });
});
