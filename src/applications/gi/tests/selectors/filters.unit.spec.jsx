import { expect } from 'chai';

import { getFiltersChanged, buildSearchFilters } from '../../selectors/filters';
import { getDefaultState } from '../helpers';

const defaultState = getDefaultState();

describe('getFiltersChanged', () => {
  it('compares default state filters to initial state filters', () => {
    expect(getFiltersChanged(defaultState.filters)).to.be.false;
  });

  it('compares modified filters to initial state filters', () => {
    expect(getFiltersChanged({ ...defaultState.filters, employers: false })).to
      .be.true;
  });
});

describe('buildSearchFilters', () => {
  it('returns boolean fields whose values are true', () => {
    const filters = {
      ...defaultState.filters,
      excludeCautionFlags: true,
      accredited: true,
      studentVeteran: true,
      yellowRibbonScholarship: true,
      preferredProvider: true,
    };

    expect(buildSearchFilters(filters)).to.have.all.keys(
      'excludeCautionFlags',
      'accredited',
      'studentVeteran',
      'yellowRibbonScholarship',
      'preferredProvider',
    );
  });

  it('returns country, state, specialMission when does not have a value of ALL', () => {
    const filters = {
      ...defaultState.filters,
      country: 'CAN',
      state: 'ALB',
      specialMission: 'hbcu',
    };

    expect(buildSearchFilters(filters)).to.have.all.keys(
      'country',
      'state',
      'specialMission',
    );
  });

  it('returns excluded flip values schools, employers, vettec when false', () => {
    const filters = {
      ...defaultState.filters,
      schools: false,
      employers: false,
      vettec: false,
    };

    expect(buildSearchFilters(filters)).to.have.all.keys(
      'excludeSchools',
      'excludeEmployers',
      'excludeVettec',
    );
  });

  it('returns excludedSchoolTypes', () => {
    const filters = {
      ...defaultState.filters,
      excludedSchoolTypes: [
        'PUBLIC',
        'PRIVATE',
        'FOREIGN',
        'FLIGHT',
        'CORRESPONDENCE',
      ],
    };

    expect(buildSearchFilters(filters)).to.have.all.keys('excludedSchoolTypes');
  });
});
