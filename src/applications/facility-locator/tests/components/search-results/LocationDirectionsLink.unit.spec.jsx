import React from 'react';
import _ from 'lodash';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import LocationDirectionsLink from '../../../components/search-results-items/common/LocationDirectionsLink';
import testDataFacilities from '../../../constants/mock-facility-v1.json';
import testDataProviders from '../../../constants/mock-facility-data-v1.json';

const verifyLink = data => {
  const wrapper = shallow(
    <LocationDirectionsLink
      location={{
        ...data,
        ...{ searchString: 'my house' },
      }}
      from="SearchResult"
    />,
  );

  const anchorProps = wrapper.find('a').props();
  const testProps = _.pick(anchorProps, ['href', 'rel', 'target']);

  expect(testProps).to.eql({
    href:
      'https://maps.google.com?saddr=my house&daddr=7901 Metropolis Drive, Austin, TX 78744-3111',
    rel: 'noopener noreferrer',
  });
  expect(wrapper.find('a').text()).to.equal(
    'Get directions on Google Maps to Austin VA Clinic',
  );
  expect(wrapper.find('.sr-only').text()).to.equal('to Austin VA Clinic');

  wrapper.unmount();
};

describe('LocationDirectionsLink', () => {
  it('should render LocationDirectionsLink for VA facilities', () => {
    verifyLink(testDataFacilities.data);
  });

  it('should render LocationDirectionsLink for CPP Providers', () => {
    verifyLink(testDataProviders.data[0]);
  });
});
