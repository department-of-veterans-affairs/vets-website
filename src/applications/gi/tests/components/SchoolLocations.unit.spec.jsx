import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import createCommonStore from 'platform/startup/store';
import reducer from '../../reducers';
import { calculatorConstants } from '../gibct-helpers';
import SchoolLocations from '../../components/profile/SchoolLocations';
import sinon from 'sinon';

const defaultState = createCommonStore(reducer).getState();

defaultState.constants = {
  constants: {},
  version: calculatorConstants.meta.version,
  inProgress: false,
};

calculatorConstants.data.forEach(c => {
  defaultState.constants.constants[c.attributes.name] = c.attributes.value;
});

describe('<SchoolLocations>', () => {
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

    const wrapper = mount(
      <SchoolLocations
        institution={testState.profile.attributes}
        facilityMap={testState.profile.attributes.facilityMap}
        calculator={testState.calculator}
        eligibility={testState.eligibility}
        constants={testState.constants}
      />,
    );

    expect(wrapper.find('.main-row')).to.have.lengthOf(1);
    expect(wrapper.find('.extension-row')).to.have.lengthOf(0);
    expect(wrapper.find('.branch-row')).to.have.lengthOf(0);
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
                      facilityCode: '102',
                      institution: 'BRANCH EXTENSION FACILITY',
                      physicalCity: 'Test',
                      physicalState: 'TN',
                      physicalCountry: 'USA',
                      physicalZip: '12345',
                      country: 'USA',
                      dodBah: '100',
                    },
                  ],
                },
              ],
            },
          },
        },
      },
    };

    const wrapper = mount(
      <SchoolLocations
        institution={testState.profile.attributes}
        facilityMap={testState.profile.attributes.facilityMap}
        calculator={testState.calculator}
        eligibility={testState.eligibility}
        constants={testState.constants}
      />,
    );

    expect(wrapper.find('.main-row')).to.have.lengthOf(1);
    expect(wrapper.find('.extension-row')).to.have.lengthOf(1);
    expect(wrapper.find('.branch-row')).to.have.lengthOf(1);
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
                  physicalCity: 'Test',
                  physicalState: 'TN',
                  physicalCountry: 'USA',
                  physicalZip: '12345',
                  country: 'USA',
                  dodBah: '100',
                },
              ],
              branches: [],
            },
          },
        },
      },
    };

    const wrapper = mount(
      <SchoolLocations
        institution={testState.profile.attributes}
        facilityMap={testState.profile.attributes.facilityMap}
        calculator={testState.calculator}
        eligibility={testState.eligibility}
        constants={testState.constants}
      />,
    );

    expect(wrapper.find('.main-row')).to.have.lengthOf(1);
    expect(wrapper.find('.extension-row')).to.have.lengthOf(1);
    expect(wrapper.find('.branch-row')).to.have.lengthOf(0);
    wrapper.unmount();
  });

  it('should handle view more and view less clicks', () => {
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

    for (let i = 0; i < 15; i++) {
      testState.profile.attributes.facilityMap.main.extensions.push({
        type: 'FOR PROFIT',
        facilityCode: i,
        institution: `EXTENSION {i}`,
        physicalCity: 'Test',
        physicalState: 'TN',
        physicalCountry: 'USA',
        physicalZip: '12345',
        country: 'USA',
        dodBah: '100',
      });
    }

    const onViewLess = sinon.spy();

    const wrapper = mount(
      <SchoolLocations
        institution={testState.profile.attributes}
        facilityMap={testState.profile.attributes.facilityMap}
        calculator={testState.calculator}
        eligibility={testState.eligibility}
        constants={testState.constants}
        onViewLess={onViewLess}
      />,
    );

    expect(wrapper.find('.extension-row')).to.have.lengthOf(9);
    wrapper
      .find('button')
      .at(0)
      .simulate('click');
    expect(wrapper.find('.extension-row')).to.have.lengthOf(
      testState.profile.attributes.facilityMap.main.extensions.length,
    );
    wrapper
      .find('button')
      .at(0)
      .simulate('click');
    expect(wrapper.find('.extension-row')).to.have.lengthOf(9);
    expect(onViewLess.called).to.be.true;

    wrapper.unmount();
  });
});
