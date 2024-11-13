import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
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

    const facilityTable = wrapper.find('table.sl-table');
    expect(facilityTable).to.have.lengthOf(1);

    const tableRows = wrapper.find('tr');
    expect(tableRows).to.have.lengthOf(2);

    const headerRow = tableRows.at(0);
    const headerLabels = headerRow.find('th');

    ['School name', 'Location', 'Estimated housing'].forEach(
      (column, index) => {
        expect(headerLabels.at(index).text()).to.equal(column);
      },
    );

    const dataRow = tableRows.at(1);
    const dataLabels = dataRow.find('td');
    [
      'MAIN FACILITY (Main Campus)',
      'Test, TN 12345',
      '$100per month/mo',
    ].forEach((column, index) => {
      const currentDataLabels = dataLabels.at(index);
      if (currentDataLabels.text() !== '') {
        expect(dataLabels.at(index).text()).equal(column);
      } else {
        const vaLink = currentDataLabels.find('va-link');
        expect(vaLink.length).to.equal(1);
      }
    });

    wrapper.unmount();
  });

  it('should render main row', () => {
    const testState = {
      ...defaultState,
      profile: {
        ...defaultState.profile,
        attributes: {
          facilityCode: '100',
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

    const facilityTable = wrapper.find('table.sl-table');
    expect(facilityTable).to.have.lengthOf(1);

    const tableRows = wrapper.find('tr');
    expect(tableRows).to.have.lengthOf(2);

    const dataRow = tableRows.at(1);
    const dataLabels = dataRow.find('td');

    [
      'MAIN FACILITY (Main Campus)',
      'Test, TN 12345',
      '$100per month/mo',
    ].forEach((column, index) => {
      const currentDataLabels = dataLabels.at(index);
      if (currentDataLabels.text() !== '') {
        expect(dataLabels.at(index).text()).equal(column);
      } else {
        const vaLink = currentDataLabels.find('va-link');
        expect(vaLink.length).to.equal(1);
      }
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

    const facilityTable = wrapper.find('table.sl-table');
    expect(facilityTable).to.have.lengthOf(1);

    const tableRows = wrapper.find('tr');
    expect(tableRows).to.have.lengthOf(4);

    let dataRow = tableRows.at(1);
    let dataLabels = dataRow.find('td');
    [
      'MAIN FACILITY (Main Campus)',
      'Test, TN 12345',
      '$100per month/mo',
    ].forEach((column, index) => {
      const currentDataLabels = dataLabels.at(index);
      if (currentDataLabels.text() !== '') {
        expect(dataLabels.at(index).text()).equal(column);
      } else {
        const vaLink = currentDataLabels.find('va-link');
        expect(vaLink.length).to.equal(1);
      }
    });

    dataRow = tableRows.at(2);
    dataLabels = dataRow.find('td');
    ['MAIN BRANCH FACILITY', 'Test 1, KY 12345', '$150per month/mo'].forEach(
      (column, index) => {
        const currentDataLabels = dataLabels.at(index);
        if (currentDataLabels.text() !== '') {
          expect(dataLabels.at(index).text()).equal(column);
        } else {
          const vaLink = currentDataLabels.find('va-link');
          expect(vaLink.length).to.equal(1);
        }
      },
    );

    dataRow = tableRows.at(3);
    dataLabels = dataRow.find('td');
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
        version="1.0.0"
      />,
    );

    const facilityTable = wrapper.find('table.sl-table');
    expect(facilityTable).to.have.lengthOf(1);

    const tableRows = wrapper.find('tr');
    expect(tableRows).to.have.lengthOf(3);

    let dataRow = tableRows.at(1);
    let dataLabels = dataRow.find('td');

    [
      'MAIN FACILITY (Main Campus)',
      'Test, TN 12345',
      '$100per month/mo',
    ].forEach((column, index) => {
      const currentDataLabels = dataLabels.at(index);
      if (currentDataLabels.text() !== '') {
        expect(dataLabels.at(index).text()).equal(column);
      } else {
        const vaLink = currentDataLabels.find('va-link');
        expect(vaLink.length).to.equal(1);
      }
    });

    dataRow = tableRows.at(2);
    dataLabels = dataRow.find('td');

    ['MAIN EXTENSION FACILITY', 'Test 1, KY 12345', '$150per month/mo'].forEach(
      (column, index) => {
        const currentDataLabels = dataLabels.at(index);
        if (currentDataLabels.text() !== '') {
          expect(dataLabels.at(index).text()).equal(column);
        } else {
          const vaLink = currentDataLabels.find('va-link');
          expect(vaLink.length).to.equal(1);
        }
      },
    );

    wrapper.unmount();
  });

  it('should render show next and view all buttons', () => {
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
                {
                  type: 'FOR PROFIT',
                  facilityCode: '100',
                  institution: 'MAIN EXTENSION FACILITY 2',
                  physicalCity: 'Test 2',
                  physicalState: 'KY',
                  physicalCountry: 'USA',
                  physicalZip: '12345',
                  country: 'USA',
                  dodBah: '150',
                },
                {
                  type: 'FOR PROFIT',
                  facilityCode: '100',
                  institution: 'MAIN EXTENSION FACILITY 3',
                  physicalCity: 'Test 3',
                  physicalState: 'KY',
                  physicalCountry: 'USA',
                  physicalZip: '12345',
                  country: 'USA',
                  dodBah: '150',
                },
                {
                  type: 'FOR PROFIT',
                  facilityCode: '100',
                  institution: 'MAIN EXTENSION FACILITY 4',
                  physicalCity: 'Test 4',
                  physicalState: 'KY',
                  physicalCountry: 'USA',
                  physicalZip: '12345',
                  country: 'USA',
                  dodBah: '150',
                },
                {
                  type: 'FOR PROFIT',
                  facilityCode: '100',
                  institution: 'MAIN EXTENSION FACILITY 5',
                  physicalCity: 'Test 5',
                  physicalState: 'KY',
                  physicalCountry: 'USA',
                  physicalZip: '12345',
                  country: 'USA',
                  dodBah: '150',
                },
                {
                  type: 'FOR PROFIT',
                  facilityCode: '100',
                  institution: 'MAIN EXTENSION FACILITY 6',
                  physicalCity: 'Test 6',
                  physicalState: 'KY',
                  physicalCountry: 'USA',
                  physicalZip: '12345',
                  country: 'USA',
                  dodBah: '150',
                },
                {
                  type: 'FOR PROFIT',
                  facilityCode: '100',
                  institution: 'MAIN EXTENSION FACILITY 7',
                  physicalCity: 'Test 7',
                  physicalState: 'KY',
                  physicalCountry: 'USA',
                  physicalZip: '12345',
                  country: 'USA',
                  dodBah: '150',
                },
                {
                  type: 'FOR PROFIT',
                  facilityCode: '100',
                  institution: 'MAIN EXTENSION FACILITY 8',
                  physicalCity: 'Test 8',
                  physicalState: 'KY',
                  physicalCountry: 'USA',
                  physicalZip: '12345',
                  country: 'USA',
                  dodBah: '150',
                },
                {
                  type: 'FOR PROFIT',
                  facilityCode: '100',
                  institution: 'MAIN EXTENSION FACILITY 9',
                  physicalCity: 'Test 9',
                  physicalState: 'KY',
                  physicalCountry: 'USA',
                  physicalZip: '12345',
                  country: 'USA',
                  dodBah: '150',
                },
                {
                  type: 'FOR PROFIT',
                  facilityCode: '100',
                  institution: 'MAIN EXTENSION FACILITY 10',
                  physicalCity: 'Test 10',
                  physicalState: 'KY',
                  physicalCountry: 'USA',
                  physicalZip: '12345',
                  country: 'USA',
                  dodBah: '150',
                },
              ],
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
    const onViewLess = sinon.spy();

    const wrapper = shallow(
      <SchoolLocations
        institution={testState.profile.attributes}
        facilityMap={testState.profile.attributes.facilityMap}
        calculator={testState.calculator}
        eligibility={testState.eligibility}
        constants={testState.constants}
        onViewLess={onViewLess}
      />,
    );

    const facilityTable = wrapper.find('table.sl-table');
    expect(facilityTable).to.have.lengthOf(1);

    const tableRows = wrapper.find('tr');
    expect(tableRows).to.have.lengthOf(11);

    const buttons = wrapper.find('button');
    expect(buttons).to.have.lengthOf(1);

    const showNextButton = buttons.at(0);
    expect(showNextButton.text()).to.equal('Show next 3');
    showNextButton.simulate('click');

    const showLessButton = wrapper.find('[data-testid="view-less"]');
    showLessButton.simulate('click');
    expect(onViewLess.calledOnce).to.equal(true);

    const viewAllButton = wrapper.find('[data-testid="view-all"]').at(0);
    viewAllButton.simulate('click');
    const newTableRows = wrapper.find('tr');
    expect(newTableRows).to.have.lengthOf(14);

    wrapper.unmount();
  });
  it('should render view next 10 rows when remaining rows is above 10', () => {
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
                {
                  type: 'FOR PROFIT',
                  facilityCode: '100',
                  institution: 'MAIN EXTENSION FACILITY 2',
                  physicalCity: 'Test 2',
                  physicalState: 'KY',
                  physicalCountry: 'USA',
                  physicalZip: '12345',
                  country: 'USA',
                  dodBah: '150',
                },
                {
                  type: 'FOR PROFIT',
                  facilityCode: '100',
                  institution: 'MAIN EXTENSION FACILITY 3',
                  physicalCity: 'Test 3',
                  physicalState: 'KY',
                  physicalCountry: 'USA',
                  physicalZip: '12345',
                  country: 'USA',
                  dodBah: '150',
                },
                {
                  type: 'FOR PROFIT',
                  facilityCode: '100',
                  institution: 'MAIN EXTENSION FACILITY 4',
                  physicalCity: 'Test 4',
                  physicalState: 'KY',
                  physicalCountry: 'USA',
                  physicalZip: '12345',
                  country: 'USA',
                  dodBah: '150',
                },
                {
                  type: 'FOR PROFIT',
                  facilityCode: '100',
                  institution: 'MAIN EXTENSION FACILITY 5',
                  physicalCity: 'Test 5',
                  physicalState: 'KY',
                  physicalCountry: 'USA',
                  physicalZip: '12345',
                  country: 'USA',
                  dodBah: '150',
                },
                {
                  type: 'FOR PROFIT',
                  facilityCode: '100',
                  institution: 'MAIN EXTENSION FACILITY 6',
                  physicalCity: 'Test 6',
                  physicalState: 'KY',
                  physicalCountry: 'USA',
                  physicalZip: '12345',
                  country: 'USA',
                  dodBah: '150',
                },
                {
                  type: 'FOR PROFIT',
                  facilityCode: '100',
                  institution: 'MAIN EXTENSION FACILITY 7',
                  physicalCity: 'Test 7',
                  physicalState: 'KY',
                  physicalCountry: 'USA',
                  physicalZip: '12345',
                  country: 'USA',
                  dodBah: '150',
                },
                {
                  type: 'FOR PROFIT',
                  facilityCode: '100',
                  institution: 'MAIN EXTENSION FACILITY 8',
                  physicalCity: 'Test 8',
                  physicalState: 'KY',
                  physicalCountry: 'USA',
                  physicalZip: '12345',
                  country: 'USA',
                  dodBah: '150',
                },
                {
                  type: 'FOR PROFIT',
                  facilityCode: '100',
                  institution: 'MAIN EXTENSION FACILITY 9',
                  physicalCity: 'Test 9',
                  physicalState: 'KY',
                  physicalCountry: 'USA',
                  physicalZip: '12345',
                  country: 'USA',
                  dodBah: '150',
                },
                {
                  type: 'FOR PROFIT',
                  facilityCode: '100',
                  institution: 'MAIN EXTENSION FACILITY 10',
                  physicalCity: 'Test 10',
                  physicalState: 'KY',
                  physicalCountry: 'USA',
                  physicalZip: '12345',
                  country: 'USA',
                  dodBah: '150',
                },
                {
                  type: 'FOR PROFIT',
                  facilityCode: '100',
                  institution: 'MAIN EXTENSION FACILITY 11',
                  physicalCity: 'Test 11',
                  physicalState: 'KY',
                  physicalCountry: 'USA',
                  physicalZip: '12345',
                  country: 'USA',
                  dodBah: '150',
                },
                {
                  type: 'FOR PROFIT',
                  facilityCode: '100',
                  institution: 'MAIN EXTENSION FACILITY 12',
                  physicalCity: 'Test 12',
                  physicalState: 'KY',
                  physicalCountry: 'USA',
                  physicalZip: '12345',
                  country: 'USA',
                  dodBah: '150',
                },
                {
                  type: 'FOR PROFIT',
                  facilityCode: '100',
                  institution: 'MAIN EXTENSION FACILITY 13',
                  physicalCity: 'Test 13',
                  physicalState: 'KY',
                  physicalCountry: 'USA',
                  physicalZip: '12345',
                  country: 'USA',
                  dodBah: '150',
                },
                {
                  type: 'FOR PROFIT',
                  facilityCode: '100',
                  institution: 'MAIN EXTENSION FACILITY 14',
                  physicalCity: 'Test 14',
                  physicalState: 'KY',
                  physicalCountry: 'USA',
                  physicalZip: '12345',
                  country: 'USA',
                  dodBah: '150',
                },
                {
                  type: 'FOR PROFIT',
                  facilityCode: '100',
                  institution: 'MAIN EXTENSION FACILITY 15',
                  physicalCity: 'Test 15',
                  physicalState: 'KY',
                  physicalCountry: 'USA',
                  physicalZip: '12345',
                  country: 'USA',
                  dodBah: '150',
                },
                {
                  type: 'FOR PROFIT',
                  facilityCode: '100',
                  institution: 'MAIN EXTENSION FACILITY 16',
                  physicalCity: 'Test 16',
                  physicalState: 'KY',
                  physicalCountry: 'USA',
                  physicalZip: '12345',
                  country: 'USA',
                  dodBah: '150',
                },
                {
                  type: 'FOR PROFIT',
                  facilityCode: '100',
                  institution: 'MAIN EXTENSION FACILITY 17',
                  physicalCity: 'Test 17',
                  physicalState: 'KY',
                  physicalCountry: 'USA',
                  physicalZip: '12345',
                  country: 'USA',
                  dodBah: '150',
                },
                {
                  type: 'FOR PROFIT',
                  facilityCode: '100',
                  institution: 'MAIN EXTENSION FACILITY 18',
                  physicalCity: 'Test 18',
                  physicalState: 'KY',
                  physicalCountry: 'USA',
                  physicalZip: '12345',
                  country: 'USA',
                  dodBah: '150',
                },
                {
                  type: 'FOR PROFIT',
                  facilityCode: '100',
                  institution: 'MAIN EXTENSION FACILITY 19',
                  physicalCity: 'Test 19',
                  physicalState: 'KY',
                  physicalCountry: 'USA',
                  physicalZip: '12345',
                  country: 'USA',
                  dodBah: '150',
                },
              ],
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
    const facilityTable = wrapper.find('table.sl-table');
    expect(facilityTable).to.have.lengthOf(1);
    const tableRows = wrapper.find('tr');
    expect(tableRows).to.have.lengthOf(11);
    const viewAllButton = wrapper.find('[data-testid="view-all"]').at(0);
    viewAllButton.simulate('click');
    const newTableRows = wrapper.find('tr');
    expect(newTableRows).to.have.lengthOf(23);
    wrapper.unmount();
  });
});
