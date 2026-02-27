import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { expect } from 'chai';
import { TOGGLE_NAMES } from 'platform/utilities/feature-toggles';
import sinon from 'sinon';

import App from '../../containers/App';
import formConfig from '../../config/form';

describe('21P-601 App', () => {
  let sandbox;
  let clock;

  const createStoreWithPersistence = (persist = true) => {
    const initialState = {
      featureToggles: {
        [TOGGLE_NAMES.bioHeartMMSSubmit]: persist,
      },
    };
    return createStore((state = initialState) => state);
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    clock = sinon.useFakeTimers({
      toFake: ['setInterval', 'clearInterval', 'Date'],
    });
  });

  afterEach(() => {
    sandbox.restore();
    clock.restore();
  });

  it('renders App component', () => {
    const store = createStoreWithPersistence(true);
    const { container } = render(
      <Provider store={store}>
        <App />
      </Provider>,
    );

    expect(container).to.exist;
  });

  it('uses correct form config', () => {
    expect(formConfig.formId).to.include('21P-601');
    expect(formConfig.title).to.exist;
  });

  it('has form configuration with required properties', () => {
    expect(formConfig).to.have.property('formId');
    expect(formConfig).to.have.property('chapters');
    expect(formConfig).to.have.property('title');
    expect(formConfig).to.have.property('prefillEnabled');
  });
});
