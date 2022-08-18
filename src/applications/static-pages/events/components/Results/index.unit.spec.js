// Node modules.
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
// Relative imports.
import { Results } from '.';
import { ResultsWhereContent } from './ResultsWhereContent';

describe('Events <Results>', () => {
  it('renders what we expect', () => {
    // Set up.
    const wrapper = shallow(<Results />);

    // Assertions.
    expect(wrapper.text()).includes('No results found');

    // Clean up.
    wrapper.unmount();
  });
});

describe('Events <ResultsWhereContent>', () => {
  function getProps(locationObj, locationString, locationArray) {
    return {
      fieldFacilityLocation: locationObj,
      fieldLocationType: locationString,
      locations: locationArray,
    };
  }
  it('renders online event prompt when event location type is online', () => {
    const onlineProps = getProps({}, 'online', []);
    const wrapper = shallow(<ResultsWhereContent {...onlineProps} />);
    expect(wrapper.text()).includes('This is an online event.');
    wrapper.unmount();
  });
  it('render given location when included in location array', () => {
    const locationArrayProps = getProps({}, '', ['pittsburgh']);
    const wrapper = shallow(<ResultsWhereContent {...locationArrayProps} />);
    expect(wrapper.text()).includes('pittsburgh');
    wrapper.unmount();
  });
  it('renders location name when given in location object', () => {
    const fieldLocationExample = {
      entity: {
        title: 'test location',
        entityUrl: {},
      },
    };
    const locationObjectProps = getProps(fieldLocationExample, '', []);
    const wrapper = shallow(<ResultsWhereContent {...locationObjectProps} />);
    expect(wrapper.text()).includes('test location');
    wrapper.unmount();
  });
});
