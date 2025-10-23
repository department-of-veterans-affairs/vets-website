import React from 'react';
import _ from 'lodash';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import RepresentativeDirectionsLink from '../../components/results/RepresentativeDirectionsLink';
import testDataRepresentative from '../../constants/mock-representative-v0.json';

const verifyLink = data => {
  const wrapper = shallow(
    <RepresentativeDirectionsLink
      representative={data}
      query={{ context: { location: 'my house' } }}
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
    '7901 Metropolis Drive Austin, TX 78744-3111',
  );

  wrapper.unmount();
};

describe('RepresentativeDirectionsLink', () => {
  it('should render RepresentativeDirectionsLink', () => {
    verifyLink(testDataRepresentative.data);
  });
});
