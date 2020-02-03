// Dependencies.
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { times } from 'lodash';
// Relative imports.
import { YellowRibbonApp } from './index';

describe('Yellow Ribbon container <YellowRibbonApp>', () => {
  it('renders what we expect with NO results', () => {
    const tree = shallow(<YellowRibbonApp />);
    const text = tree.text();

    // Expect there to be:
    expect(tree.find('Breadcrumbs')).to.have.lengthOf(1);
    expect(text).to.include('Find a Yellow Ribbon school');
    expect(text).to.include('Learn more about the Yellow Ribbon Program.');
    expect(text).to.include(
      'You may be eligible for Yellow Ribbon program funding if you:',
    );

    tree.unmount();
  });

  it('renders what we expect with results', () => {
    const results = times(10, index => ({
      address1: '309 HARDIN ADMINISTRATION BLDG',
      address2: 'ACU BOX 29141',
      address3: null,
      bah: 1151,
      books: 1250,
      campusType: 'Y',
      cautionFlag: true,
      cautionFlagReason:
        'Warning or Equivalent-Factors Affecting Academic Quality (Concerns about issues affecting academic quality)',
      city: 'ABILENE',
      closure109: null,
      country: 'USA',
      createdAt: '2019-12-11T17:31:21.000Z',
      distanceLearning: true,
      dodBah: 1062,
      eightKeys: null,
      facilityCode: '31000143',
      highestDegree: 4,
      id: `${index}-3333112`,
      independentStudy: true,
      localeType: 'city',
      name: 'ABILENE CHRISTIAN UNIVERSITY',
      onlineOnly: false,
      parentFacilityCodeId: null,
      physicalCity: 'ABILENE',
      physicalCountry: 'USA',
      physicalState: 'TX',
      physicalZip: '79699',
      poe: false,
      preferredProvider: false,
      priorityEnrollment: false,
      schoolClosing: false,
      state: 'TX',
      stemOffered: false,
      studentCount: 257,
      studentVeteran: null,
      tuitionInState: 29450,
      tuitionOutOfState: 29450,
      type: 'institutions',
      updatedAt: '2019-12-11T17:31:21.000Z',
      vetTecProvider: false,
      yr: true,
      zip: '79699',
    }));

    const tree = shallow(<YellowRibbonApp results={results} />);
    const text = tree.text();

    // Expect there to be:
    expect(tree.find('Breadcrumbs')).to.have.lengthOf(1);
    expect(text).to.include('Find a Yellow Ribbon school');

    // Expect there NOT to be:
    expect(text).to.not.include('Learn more about the Yellow Ribbon Program.');
    expect(text).to.not.include(
      'You may be eligible for Yellow Ribbon program funding if you:',
    );

    tree.unmount();
  });
});
