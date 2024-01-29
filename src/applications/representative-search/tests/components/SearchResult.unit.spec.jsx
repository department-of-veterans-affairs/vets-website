import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import SearchResult from '../../components/results/SearchResult';

describe('SearchResults', () => {
  it('should render rep email if rep email exists', () => {
    const wrapper = shallow(
      <SearchResult
        phone="614-249-9393"
        email="rep@example.com"
        addressLine1="123 test place"
      />,
    );

    const emailLink = wrapper.find('a[href="mailto:rep@example.com"]');

    // Check if the emailLink exists and has the correct length
    expect(emailLink.exists(), 'Email link exists').to.be.true;
    expect(emailLink, 'Email link length').to.have.lengthOf(1);

    wrapper.unmount();
  });
});
