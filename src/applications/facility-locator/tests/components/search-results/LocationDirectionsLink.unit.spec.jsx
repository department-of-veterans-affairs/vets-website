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
      }}
    />,
  );

  const anchorProps = wrapper.find('va-link').props();
  const testProps = _.pick(anchorProps, ['href', 'rel', 'target']);

  expect(testProps).to.eql({
    href:
      'https://maps.google.com?saddr=Current+Location&daddr=7901%20Metropolis%20Drive%2C%20Austin%2C%20TX%2078744-3111',
  });
  expect(wrapper.find('va-link').prop('text')).to.equal(
    'Get directions on Google Maps',
  );
  expect(wrapper.find('va-link').prop('label')).to.equal(
    'Get directions on Google Maps to Austin VA Clinic',
  );

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
