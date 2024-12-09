import { expect } from 'chai';

import profileReducer from '../../reducers/index';

const { vaProfile } = profileReducer;

describe('index reducer', () => {
  it('should fetch hero info', () => {
    const state = vaProfile(undefined, {
      type: 'FETCH_HERO_SUCCESS',
      hero: 'heroContent',
    });

    expect(state.hero).to.eql('heroContent');
  });

  it('should populate hero with errors when errors are present', () => {
    const state = vaProfile(undefined, {
      type: 'FETCH_HERO_FAILED',
      hero: {
        errors: ['This is an error'],
      },
    });

    expect(state.hero).to.eql({ errors: ['This is an error'] });
  });

  it('should fetch personalInformation', () => {
    const state = vaProfile(undefined, {
      type: 'FETCH_PERSONAL_INFORMATION_SUCCESS',
      personalInformation: 'personalInformation',
    });

    expect(state.personalInformation).to.eql('personalInformation');
  });

  it('should populate personalInformation with errors when errors are present', () => {
    const state = vaProfile(undefined, {
      type: 'FETCH_PERSONAL_INFORMATION_FAILED',
      personalInformation: {
        errors: ['error'],
      },
    });

    expect(state.personalInformation.errors).to.eql(['error']);
  });

  it('should fetch militaryInformation', () => {
    const state = vaProfile(undefined, {
      type: 'FETCH_MILITARY_INFORMATION_SUCCESS',
      militaryInformation: 'military info',
    });

    expect(state.militaryInformation).to.eql('military info');
  });

  it('should populate militaryInformation with errors when errors are present', () => {
    const state = vaProfile(undefined, {
      type: 'FETCH_MILITARY_INFORMATION_FAILED',
      militaryInformation: {
        errors: ['error'],
      },
    });

    expect(state.militaryInformation.errors).to.eql(['error']);
  });
});
