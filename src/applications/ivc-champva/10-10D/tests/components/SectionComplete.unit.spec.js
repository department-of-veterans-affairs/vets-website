import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import SectionCompleteAlert from '../../components/SectionCompleteAlert';

const mockStore = {
  getState: () => {},
  subscribe: () => {},
  dispatch: () => {},
};

describe('Section Complete alert', () => {
  it('should render', () => {
    const { container } = render(
      <Provider store={mockStore}>
        <SectionCompleteAlert />
      </Provider>,
    );
    expect(container).to.exist;
  });

  it('should display section complete message', () => {
    const { getByText } = render(
      <Provider store={mockStore}>
        <SectionCompleteAlert />
      </Provider>,
    );

    expect(getByText(/Section Complete/)).to.exist;
  });
});
