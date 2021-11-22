import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import SearchAreaControl from '../../components/SearchAreaControl';

describe('SearchAreaControl', () => {
  it('renders "Zoom in to search" when zoomed out too far', () => {
    const query = {
      currentRadius: 501,
    };

    const wrapper = shallow(<SearchAreaControl query={query} />);

    expect(
      wrapper
        .render()
        .find('button#search-area-control')
        .text(),
    ).to.equal('Zoom in to search');
    wrapper.unmount();
  });

  it('renders "Search this area of the map" when zoomed out too far', () => {
    const query = {
      currentRadius: 500,
    };

    const wrapper = shallow(<SearchAreaControl query={query} />);

    expect(
      wrapper
        .render()
        .find('button#search-area-control')
        .text(),
    ).to.equal('Search this area of the map');
    wrapper.unmount();
  });

  it('renders button disabled', () => {
    const handleSearchArea = sinon.spy();
    const wrapper = shallow(
      <SearchAreaControl
        isEnabled={false}
        handleSearchArea={handleSearchArea}
      />,
    );

    const button = wrapper.find('button#search-area-control');
    button.simulate('click');

    expect(handleSearchArea.called).to.be.false;
    wrapper.unmount();
  });

  it('renders button enabled', () => {
    const handleSearchArea = sinon.spy();
    const wrapper = shallow(
      <SearchAreaControl isEnabled handleSearchArea={handleSearchArea} />,
    );

    const button = wrapper.find('button#search-area-control');
    button.simulate('click');

    expect(handleSearchArea.called).to.be.true;

    wrapper.unmount();
  });
});
