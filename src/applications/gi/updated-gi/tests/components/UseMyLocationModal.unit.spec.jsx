import React from 'react';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import configureStore from 'redux-mock-store';
import createCommonStore from '@department-of-veterans-affairs/platform-startup/store';
import SearchByProgram from '../../containers/SearchByProgram';
import { UseMyLocationModal } from '../../components/school-and-employers/UseMyLocationModal';

const defaultStore = createCommonStore();

describe('Use my location modal', () => {
  it('Renders enable location modal', () => {
    const { getByText } = render(
      <Provider store={defaultStore}>
        <UseMyLocationModal geocodeError={1} />
      </Provider>,
    );
    expect(
      getByText(
        'Please enable location sharing in your browser to use this feature.',
      ),
    ).to.exist;
  });
  it('Renders couldnt locate modal', () => {
    const { getByText } = render(
      <Provider store={defaultStore}>
        <UseMyLocationModal geocodeError={0} />
      </Provider>,
    );
    expect(
      getByText(
        'Sorry, something went wrong when trying to find your location. Please make sure location sharing is enabled and try again.',
      ),
    ).to.exist;
  });
  it('Should close', async () => {
    const middlewares = [thunk];
    const mockStore = configureStore(middlewares);
    const store = mockStore({
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
        <SearchByProgram>
          <UseMyLocationModal geocodeError={1} />
        </SearchByProgram>
      </Provider>,
    );
    const event = new CustomEvent('closeEvent');
    await $('va-modal', container).__events.closeEvent(event);
    waitFor(() => {
      expect($('va-modal[visible="false"]', container)).to.exist;
    });
  });
});
