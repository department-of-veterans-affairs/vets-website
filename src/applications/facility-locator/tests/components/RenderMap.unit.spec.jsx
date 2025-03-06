import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import RenderMap from '../../components/RenderMap';

describe('<RenderMap>', () => {
  it('Map should render.', () => {
    const wrapper = render(<RenderMap />);
    expect(wrapper).to.not.equal(null);
    wrapper.unmount();
  });
  it('Map should render with Search Area Control but be disabled.', () => {
    const wrapper = render(<RenderMap shouldRenderSearchArea />);
    expect(wrapper).to.not.equal(null);
    const button = wrapper.findByText('Zoom in to search');
    expect(button).to.not.equal(null);
    expect(button).to.have.class('fl-disabled');
    wrapper.unmount();
  });
});
