import React from 'react';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';
import userEvent from '@testing-library/user-event';
import SearchByProgram from '../../containers/SearchByProgram';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('Search by program', () => {
  let store;

  it('Renders inputs and search button', () => {
    store = mockStore({
      search: {
        query: {
          distance: '25',
          location: '',
          streetAddress: { searchString: '' },
        },
      },
    });
    const { container } = render(
      <Provider store={store}>
        <SearchByProgram />
      </Provider>,
    );
    expect($$('va-text-input', container).length).to.equal(2);
    expect($$('va-select', container).length).to.equal(1);
    expect($$('va-button', container).length).to.equal(1);
  });

  it('Shows required input errors', () => {
    store = mockStore({
      search: {
        query: {
          distance: '',
          location: '',
          streetAddress: { searchString: '' },
        },
      },
    });
    const { container } = render(
      <Provider store={store}>
        <SearchByProgram />
      </Provider>,
    );
    userEvent.click(container.getElementsByTagName('va-button')[0]);
    expect(container.querySelectorAll('va-text-input[error]').length).to.equal(
      2,
    );
    expect(container.querySelectorAll('va-select[error]').length).to.equal(1);
  });

  it('Shows failed attempt to locate user - user not sharing location', () => {
    store = mockStore({
      search: {
        query: {
          distance: '25',
          location: '',
          streetAddress: { searchString: '' },
        },
      },
    });
    delete global.navigator.geolocation;
    const { getByText } = render(
      <Provider store={store}>
        <SearchByProgram />
      </Provider>,
    );
    userEvent.click(getByText('Use my location'));
    expect(
      getByText(
        'Sorry, something went wrong when trying to find your location. Please make sure location sharing is enabled and try again.',
      ),
    ).to.exist;
  });

  it('Fills user location if location found', () => {
    store = mockStore({
      search: {
        query: {
          distance: '25',
          location: '',
          streetAddress: {
            searchString: '1313 Disneyland Dr Anaheim, CA 92802',
          },
        },
      },
    });
    const { container } = render(
      <Provider store={store}>
        <SearchByProgram />
      </Provider>,
    );
    userEvent.click(container.getElementsByTagName('va-button')[0]);
    expect(container.querySelectorAll('va-text-input[error]').length).to.equal(
      1,
    );
  });
});
