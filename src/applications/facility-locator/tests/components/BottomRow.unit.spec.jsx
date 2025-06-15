import React from 'react';

import { expect } from 'chai';
import { render } from '@testing-library/react';
import BottomRow from '../../components/search-form/BottomRow';

describe('<BottomRow>', () => {
  it('Should just render the test-div without a container around it', () => {
    const wrapper = render(
      <BottomRow>
        <div data-testid="test-div">test</div>
      </BottomRow>,
    );
    expect(wrapper).to.not.equal(null);
    const bottomRow = wrapper.queryAllByTestId('search-controls-bottom-row');
    expect(bottomRow).to.have.lengthOf(0);
    wrapper.unmount();
  });
  it('Should have the search-controls-bottom-row around test-div', () => {
    const wrapper = render(
      <BottomRow isSmallDesktop>
        <div data-testid="test-div">test</div>
      </BottomRow>,
    );
    expect(wrapper).to.not.equal(null);
    const bottomRow = wrapper.queryAllByTestId('search-controls-bottom-row');
    expect(bottomRow).to.have.lengthOf(1);
    expect(bottomRow).to.have.lengthOf(1);
    wrapper.unmount();
  });
});
