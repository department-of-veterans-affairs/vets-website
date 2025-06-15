import React from 'react';

import { expect } from 'chai';
import { render } from '@testing-library/react';
import MobileMapSearchResult from '../../components/MobileMapSearchResult';
import NoResultsMessage from '../../components/NoResultsMessage';
import { query } from './mocks/query';
import { mobilePin } from './mocks/mobilePin';

describe('<NoResultsMessage> unreachable state', () => {
  it('Should render with mobileListView', () => {
    const wrapper = render(<NoResultsMessage isMobileListView />);
    expect(wrapper).to.not.equal(null);
    const NRLV = wrapper.queryAllByTestId('no-results-mobile-list-view');
    expect(NRLV).to.have.lengthOf(1);
  });
});

describe('<MobileMapSearchResult>', () => {
  it('Should render with error that there is no valid search', () => {
    const wrapper = render(
      <MobileMapSearchResult query={{ searchString: undefined }} />,
    );
    expect(wrapper).to.not.equal(null);
    const NRM = wrapper.queryAllByTestId('no-results-message');
    expect(NRM).to.have.lengthOf(1);
    wrapper.unmount();
  });
  it('Should render without error for invalid search but select a pin message', () => {
    const wrapper = render(
      <MobileMapSearchResult query={{ searchString: 'abc' }} />,
    );
    const NRM = wrapper.queryAllByTestId('no-results-message');
    expect(NRM).to.have.lengthOf(0);
    const SPN = wrapper.queryAllByTestId('select-a-pin-number');
    expect(SPN).to.have.lengthOf(1);
    wrapper.unmount();
  });

  it('Should render without error and with pin information', () => {
    const wrapper = render(
      <MobileMapSearchResult mobileMapPinSelected={mobilePin} query={query} />,
    );
    const NRM = wrapper.queryAllByTestId('no-results-message');
    expect(NRM).to.have.lengthOf(0);
    const MSR = wrapper.queryAllByTestId('mobile-search-result');
    expect(MSR).to.have.lengthOf(1);
    const MSRFirst = MSR[0];
    expect(MSRFirst.children).to.have.lengthOf(1);
    wrapper.unmount();
  });
});
