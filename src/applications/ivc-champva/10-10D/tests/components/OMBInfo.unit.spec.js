import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import OMBInfo from '../../components/IntroductionPage/OMBInfo';

const mockStore = {
  getState: () => {},
  subscribe: () => {},
  dispatch: () => {},
};

describe('OMB Info component', () => {
  it('should render', () => {
    const { container } = render(
      <Provider store={mockStore}>
        <OMBInfo />
      </Provider>,
    );
    expect(container).to.exist;
  });
});
