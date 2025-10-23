import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import UploadFileToVa from '../../../../components/MainContent/Update/UploadFileToVa';

const mockStore = configureStore([]);

describe('UploadFileToVa', () => {
  it('should render default page with all feature toggles disabled', () => {
    const initialState = {
      initialState: {
        featureToggles: {},
      },
    };
    const store = mockStore(initialState);

    const { getByText, queryByTestId } = render(
      <Provider store={store}>
        <UploadFileToVa />
      </Provider>,
    );

    expect(getByText('Other accepted documents')).to.exist;

    // Digital/PDF Forms
    expect(queryByTestId('digital-10215-form')).to.not.exist;
    expect(queryByTestId('digital-10216-form')).to.not.exist;
    expect(queryByTestId('digital-8794-form')).to.not.exist;
    expect(queryByTestId('digital-1919-form')).to.not.exist;
  });

  it('should render some accepted forms when some feature toggles are enabled', () => {
    const { TOGGLE_NAMES } = useFeatureToggle();
    const initialState = {
      featureToggles: {
        [TOGGLE_NAMES.forms1516Links]: true,
        [TOGGLE_NAMES.form1919Release]: true,
      },
    };
    const store = mockStore(initialState);

    const { getByText, queryByTestId } = render(
      <Provider store={store}>
        <UploadFileToVa />
      </Provider>,
    );

    expect(getByText('Other accepted documents')).to.exist;

    // Digital/PDF Forms
    expect(queryByTestId('digital-10215-form')).to.exist;
    expect(queryByTestId('digital-10216-form')).to.exist;
    expect(queryByTestId('digital-1919-form')).to.exist;
    expect(queryByTestId('digital-8794-form')).to.not.exist;
  });

  it('should render all accepted forms when all feature toggles are enabled', () => {
    const { TOGGLE_NAMES } = useFeatureToggle();
    const initialState = {
      featureToggles: {
        [TOGGLE_NAMES.forms1516Links]: true,
        [TOGGLE_NAMES.form1919Release]: true,
        [TOGGLE_NAMES.form8794Release]: true,
      },
    };
    const store = mockStore(initialState);

    const { getByText, queryByTestId } = render(
      <Provider store={store}>
        <UploadFileToVa />
      </Provider>,
    );

    expect(getByText('Other accepted documents')).to.exist;

    // Digital/PDF Forms
    expect(queryByTestId('digital-10215-form')).to.exist;
    expect(queryByTestId('digital-10216-form')).to.exist;
    expect(queryByTestId('digital-8794-form')).to.exist;
    expect(queryByTestId('digital-1919-form')).to.exist;
  });
});
