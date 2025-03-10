import React from 'react';

import { expect } from 'chai';
import { render } from '@testing-library/react';
import ControlResultsHolder from '../../components/ControlResultsHolder';

describe('<ControlResultsHolder>', () => {
  it('Should just render the test-div without a container around it', () => {
    const wrapper = render(
      <ControlResultsHolder>
        <div data-testid="test-div">test</div>
      </ControlResultsHolder>,
    );
    expect(wrapper).to.not.equal(null);
    const VLControls = wrapper.queryAllByTestId(
      'vertical-oriented-left-controls',
    );
    expect(VLControls).to.have.lengthOf(0);
    wrapper.unmount();
  });
  it('Should have the search-controls-bottom-row around test-div', () => {
    const wrapper = render(
      <ControlResultsHolder isSmallDesktop>
        <div data-testid="test-div">test</div>
      </ControlResultsHolder>,
    );
    expect(wrapper).to.not.equal(null);
    const VLControls = wrapper.queryAllByTestId(
      'vertical-oriented-left-controls',
    );
    expect(VLControls).to.have.lengthOf(1);
    wrapper.unmount();
  });
});
