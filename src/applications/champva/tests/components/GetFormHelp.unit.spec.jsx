import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import GetFormHelp from '../../components/GetFormHelp';

const props = {
  applicantName: {
    first: 'firstname',
    middle: 'middlename',
    last: 'lastname',
    suffix: 'Jr.',
  },
};

const mockStore = {
  getState: () => {},
  subscribe: () => {},
  dispatch: () => {},
};

describe('GetFormHelp', () => {
  it('should render', () => {
    const { container } = render(
      <Provider store={mockStore}>
        <GetFormHelp formData={props} />
      </Provider>,
    );
    expect(container).to.exist;
  });
});
