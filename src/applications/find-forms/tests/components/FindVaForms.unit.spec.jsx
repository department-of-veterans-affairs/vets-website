// Dependencies.
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
// Relative imports.
import FindVaForms from '../../components/FindVaForms';

const getData = ({
  showNod = true,
  isLoading = false,
  loggedIn = true,
} = {}) => ({
  props: {
    isLoading,
    loggedIn,
  },
  mockStore: {
    getState: () => ({
      featureToggles: {
        // eslint-disable-next-line camelcase
        form10182_nod: showNod,
      },
      user: {
        login: {
          currentlyLoggedIn: loggedIn,
        },
      },
    }),
    subscribe: () => {},
    dispatch: () => {},
  },
});

describe('Find VA Forms <FindVaForms>', () => {
  it('should render', () => {
    const { mockStore } = getData();
    const tree = shallow(
      <Provider store={mockStore}>
        <FindVaForms />
      </Provider>,
    );

    expect(tree.find('SearchForm')).to.exist;
    tree.unmount();
  });
});
