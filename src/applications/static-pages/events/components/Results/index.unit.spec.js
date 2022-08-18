// Node modules.
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
// Relative imports.
import { Results } from '.';
import { ResultsWhereContent } from './ResultsWhereContent';

// page: PropTypes.number.isRequired,
// perPage: PropTypes.number.isRequired,
// query: PropTypes.string.isRequired,
// results: PropTypes.arrayOf(
//   PropTypes.shape({
//     entityUrl: PropTypes.object.isRequired,
//     fieldDatetimeRangeTimezone: PropTypes.arrayOf(
//       PropTypes.shape({
//         endValue: PropTypes.number.isRequired,
//         timezone: PropTypes.string,
//         value: PropTypes.number.isRequired,
//       }),
//     ).isRequired,
//     fieldDescription: PropTypes.string,
//     title: PropTypes.string.isRequired,
//   }),
// ).isRequired,
// totalResults: PropTypes.number.isRequired,
// onPageSelect: PropTypes.func.isRequired,
// queryId: PropTypes.string,

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
});
