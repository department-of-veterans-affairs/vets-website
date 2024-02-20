import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import SchoolLocations from '../../../components/profile/SchoolLocations';
import { getDefaultState } from '../../helpers';

const defaultState = getDefaultState();

describe('<SchoolLocations>', () => {
  it('should have columns and tableClassName', () => {
    const testState = {
      ...defaultState,
      profile: {
        ...defaultState.profile,
        attributes: {
          facilityMap: {
            main: {
              institution: {
                type: 'FOR PROFIT',
                facilityCode: '100',
                institution: 'MAIN FACILITY',
                physicalCity: 'Test',
                physicalState: 'TN',
                physicalCountry: 'USA',
                physicalZip: '12345',
                country: 'USA',
                dodBah: '100',
              },
              extensions: [],
              branches: [],
            },
          },
        },
      },
    };

    const wrapper = shallow(
      <SchoolLocations
        institution={testState.profile.attributes}
        facilityMap={testState.profile.attributes.facilityMap}
        calculator={testState.calculator}
        eligibility={testState.eligibility}
        constants={testState.constants}
      />,
    );

    const facilityTable = wrapper.find('va-table');
    expect(facilityTable).to.have.lengthOf(1);
    expect(facilityTable.prop('class')).to.equal('school-locations');

    const tableRows = wrapper.find('va-table-row');
    expect(tableRows).to.have.lengthOf(2);

    const headerRow = tableRows.at(0);
    const headerLabels = headerRow.find('span');

    ['School name', 'Location', 'Estimated housing'].forEach(
      (column, index) => {
        expect(headerLabels.at(index).text()).to.equal(column);
      },
    );

    const dataRow = tableRows.at(1);
    expect(dataRow.prop('class')).to.equal('main-row');

    const dataLabels = dataRow.find('span');
    [
      'MAIN FACILITY (Main Campus)',
      'Test, TN 12345',
      '$100per month/mo',
    ].forEach((column, index) => {
      expect(dataLabels.at(index).text()).equal(column);
    });

    wrapper.unmount();
  });

  it('should render main row', () => {
    const testState = {
      ...defaultState,
      profile: {
        ...defaultState.profile,
        attributes: {
          facilityMap: {
            main: {
              institution: {
                type: 'FOR PROFIT',
                facilityCode: '100',
                institution: 'MAIN FACILITY',
                physicalCity: 'Test',
                physicalState: 'TN',
                physicalCountry: 'USA',
                physicalZip: '12345',
                country: 'USA',
                dodBah: '100',
              },
              extensions: [],
              branches: [],
            },
          },
        },
      },
    };
    const { facilityMap } = testState.profile.attributes;
    const wrapper = shallow(
      <SchoolLocations
        institution={testState.profile.attributes}
        facilityMap={facilityMap}
        calculator={testState.calculator}
        eligibility={testState.eligibility}
        constants={testState.constants}
      />,
    );

    const facilityTable = wrapper.find('va-table');
    expect(facilityTable).to.have.lengthOf(1);

    const tableRows = wrapper.find('va-table-row');
    expect(tableRows).to.have.lengthOf(2);

    const dataRow = tableRows.at(1);
    const dataLabels = dataRow.find('span');

    [
      'MAIN FACILITY (Main Campus)',
      'Test, TN 12345',
      '$100per month/mo',
    ].forEach((column, index) => {
      expect(dataLabels.at(index).text()).equal(column);
    });

    wrapper.unmount();
  });

  it('should render main branch with extensions', () => {
    const testState = {
      ...defaultState,
      profile: {
        ...defaultState.profile,
        attributes: {
          facilityMap: {
            main: {
              institution: {
                type: 'FOR PROFIT',
                facilityCode: '100',
                institution: 'MAIN FACILITY',
                physicalCity: 'Test',
                physicalState: 'TN',
                physicalCountry: 'USA',
                physicalZip: '12345',
                country: 'USA',
                dodBah: '100',
              },
              extensions: [],
              branches: [
                {
                  institution: {
                    type: 'FOR PROFIT',
                    facilityCode: '101',
                    institution: 'MAIN BRANCH FACILITY',
                    physicalCity: 'Test 1',
                    physicalState: 'KY',
                    physicalCountry: 'USA',
                    physicalZip: '12345',
                    country: 'USA',
                    dodBah: '150',
                  },
                  extensions: [
                    {
                      type: 'FOR PROFIT',
                      facilityCode: '102',
                      institution: 'BRANCH EXTENSION FACILITY',
                      physicalCity: 'Test 2',
                      physicalState: 'OH',
                      physicalCountry: 'USA',
                      physicalZip: '12345',
                      country: 'USA',
                      dodBah: '200',
                    },
                  ],
                },
              ],
            },
          },
        },
      },
    };

    const wrapper = shallow(
      <SchoolLocations
        institution={testState.profile.attributes}
        facilityMap={testState.profile.attributes.facilityMap}
        calculator={testState.calculator}
        eligibility={testState.eligibility}
        constants={testState.constants}
      />,
    );

    const facilityTable = wrapper.find('va-table');
    expect(facilityTable).to.have.lengthOf(1);

    const tableRows = wrapper.find('va-table-row');
    expect(tableRows).to.have.lengthOf(4);

    let dataRow = tableRows.at(1);
    let dataLabels = dataRow.find('span');
    [
      'MAIN FACILITY (Main Campus)',
      'Test, TN 12345',
      '$100per month/mo',
    ].forEach((column, index) => {
      expect(dataLabels.at(index).text()).equal(column);
    });

    dataRow = tableRows.at(2);
    dataLabels = dataRow.find('span');
    ['MAIN BRANCH FACILITY', 'Test 1, KY 12345', '$150per month/mo'].forEach(
      (column, index) => {
        expect(dataLabels.at(index).text()).equal(column);
      },
    );

    dataRow = tableRows.at(3);
    dataLabels = dataRow.find('span');
    [
      'BRANCH EXTENSION FACILITY',
      'Test 2, OH 12345',
      '$200per month/mo',
    ].forEach((column, index) => {
      expect(dataLabels.at(index).text()).equal(column);
    });

    wrapper.unmount();
  });

  it('should render extension', () => {
    const testState = {
      ...defaultState,
      profile: {
        ...defaultState.profile,
        attributes: {
          facilityMap: {
            main: {
              institution: {
                institution: 'MAIN FACILITY',
                type: 'FOR PROFIT',
                facilityCode: '100',
                physicalCity: 'Test',
                physicalState: 'TN',
                physicalCountry: 'USA',
                physicalZip: '12345',
                country: 'USA',
                dodBah: '100',
              },
              extensions: [
                {
                  type: 'FOR PROFIT',
                  facilityCode: '100',
                  institution: 'MAIN EXTENSION FACILITY',
                  physicalCity: 'Test 1',
                  physicalState: 'KY',
                  physicalCountry: 'USA',
                  physicalZip: '12345',
                  country: 'USA',
                  dodBah: '150',
                },
              ],
              branches: [],
            },
          },
        },
      },
    };

    const wrapper = shallow(
      <SchoolLocations
        institution={testState.profile.attributes}
        facilityMap={testState.profile.attributes.facilityMap}
        calculator={testState.calculator}
        eligibility={testState.eligibility}
        constants={testState.constants}
      />,
    );

    const facilityTable = wrapper.find('va-table');
    expect(facilityTable).to.have.lengthOf(1);

    const tableRows = wrapper.find('va-table-row');
    expect(tableRows).to.have.lengthOf(3);

    let dataRow = tableRows.at(1);
    let dataLabels = dataRow.find('span');

    [
      'MAIN FACILITY (Main Campus)',
      'Test, TN 12345',
      '$100per month/mo',
    ].forEach((column, index) => {
      expect(dataLabels.at(index).text()).equal(column);
    });

    dataRow = tableRows.at(2);
    dataLabels = dataRow.find('span');

    ['MAIN EXTENSION FACILITY', 'Test 1, KY 12345', '$150per month/mo'].forEach(
      (column, index) => {
        expect(dataLabels.at(index).text()).equal(column);
      },
    );

    wrapper.unmount();
  });
});
