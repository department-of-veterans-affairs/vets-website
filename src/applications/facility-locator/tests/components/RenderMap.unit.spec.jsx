import React from 'react';

import { expect } from 'chai';
import { fireEvent, render } from '@testing-library/react';
import RenderMap from '../../components/RenderMap';

const sinon = require('sinon');

describe('<RenderMap>', () => {
  it('Map should render.', () => {
    const wrapper = render(<RenderMap />);
    expect(wrapper).to.not.equal(null);
    wrapper.unmount();
  });
  it('Map should render with Search Area Control but be disabled', () => {
    const wrapper = render(<RenderMap shouldRenderSearchArea results={['']} />);
    expect(wrapper).to.not.equal(null);
    const button = wrapper.getAllByTestId('search-area-control');
    expect(button).to.have.length(1);
    expect(button[0]).to.have.class('fl-disabled');
    const srInfo = wrapper.getAllByTestId('map-of-results-sr');
    expect(srInfo).to.have.length(1);
    expect(srInfo[0]).to.have.text('Map of Results');
    wrapper.unmount();
  });
  it('Map should render with Search Area Control enabled', () => {
    const wrapper = render(
      <RenderMap shouldRenderSearchArea searchAreaButtonEnabled />,
    );
    expect(wrapper).to.not.equal(null);
    const button = wrapper.getAllByTestId('search-area-control');
    expect(button).to.have.length(1);
    expect(button[0]).to.not.have.class('fl-disabled');
    wrapper.unmount();
  });
  it('Map should render as Mobile with Search Area Control enabled and be disabled.', () => {
    const wrapper = render(
      <RenderMap shouldRenderSearchArea mobileMapUpdateEnabled />,
    );
    expect(wrapper).to.not.equal(null);
    const button = wrapper.getAllByTestId('search-area-control');
    expect(button).to.have.length(1);
    expect(button[0]).to.have.class('fl-disabled');
    wrapper.unmount();
  });
  it('Map should render as Mobile', async () => {
    const wrapper = render(
      <RenderMap
        mobileMapUpdateEnabled
        mapboxGlContainer="mapbox-gl-container"
      />,
    );
    const mapboxContainer = wrapper.getAllByTestId('mapbox-gl-container');
    expect(mapboxContainer).to.have.length(1);
    fireEvent.focus(mapboxContainer[0]);
    const mapInstructions = wrapper.getAllByTestId('map-instructions');
    expect(mapInstructions).to.have.length(1);
  });
  it('Map should render as Small Desktop', async () => {
    const wrapper = render(
      <RenderMap smallDesktop mapboxGlContainer="mapbox-gl-container" />,
    );
    const mapboxContainer = wrapper.getAllByTestId('mapbox-gl-container');
    expect(mapboxContainer).to.have.length(1);
    fireEvent.focus(mapboxContainer[0]);
    const mapInstructions = wrapper.getAllByTestId('map-instructions');
    expect(mapInstructions).to.have.length(1);
  });
  it('Map should render as searching', async () => {
    const wrapper = render(
      <RenderMap isSearching mapboxGlContainer="mapbox-gl-container" />,
    );
    const mapboxContainer = wrapper.getAllByTestId('mapbox-gl-container');
    expect(mapboxContainer).to.have.length(1);
    fireEvent.focus(mapboxContainer[0]);
    const mapInstructions = wrapper.getAllByTestId('map-instructions');
    expect(mapInstructions).to.have.length(1);
    wrapper.unmount();
  });
  it('Should call resize on map on load', async () => {
    const map = {
      resize: sinon.spy(),
    };
    const wrapper = render(
      <RenderMap map={map} mapboxGlContainer="mapbox-gl-container" />,
    );
    const mapboxContainer = wrapper.getAllByTestId('mapbox-gl-container');
    expect(mapboxContainer).to.have.length(1);
    fireEvent.focus(mapboxContainer[0]);
    expect(map.resize.called).to.be.true;
    wrapper.unmount();
  });
});
