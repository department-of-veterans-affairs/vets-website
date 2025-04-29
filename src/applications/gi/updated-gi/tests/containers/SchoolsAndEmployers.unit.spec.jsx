import React from 'react';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import SchoolsAndEmployers from '../../containers/SchoolsAndEmployers';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('Schools and employers', () => {
  const store = mockStore({
    search: {
      query: {
        distance: '25',
        location: '',
        streetAddress: { searchString: '' },
      },
    },
  });

  it('Renders without crashing', () => {
    const { getByText } = render(
      <Provider store={store}>
        <SchoolsAndEmployers />
      </Provider>,
    );
    expect(getByText('Schools and employers')).to.exist;
  });

  it('Renders with Search by name as default tab', () => {
    const { getByRole } = render(
      <Provider store={store}>
        <SchoolsAndEmployers />
      </Provider>,
    );
    const nameTab = getByRole('tab', { name: 'Search by name' });
    expect(nameTab.getAttribute('aria-selected')).to.equal('true');
  });
});
