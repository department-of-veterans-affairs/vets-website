import React from 'react';

import { expect } from 'chai';
import { render } from '@testing-library/react';
import ControlsAndMapContainer from '../../components/ControlsAndMapContainer';

describe('<ControlsAndMapContainer>', () => {
  it('Should just render the test-div without a container around it', () => {
    const wrapper = render(
      <ControlsAndMapContainer>
        <div data-testid="test-div">test</div>
      </ControlsAndMapContainer>,
    );
    expect(wrapper).to.not.equal(null);
    const CMC = wrapper.queryAllByTestId('controls-and-map-container');
    expect(CMC).to.have.lengthOf(0);
    wrapper.unmount();
  });
  it('Should have the controls-and-map-container around test-div', () => {
    const wrapper = render(
      <ControlsAndMapContainer isSmallDesktop>
        <div data-testid="test-div">test</div>
      </ControlsAndMapContainer>,
    );
    expect(wrapper).to.not.equal(null);
    const CMC = wrapper.queryAllByTestId('controls-and-map-container');
    expect(CMC).to.have.lengthOf(1);
    wrapper.unmount();
  });
});
