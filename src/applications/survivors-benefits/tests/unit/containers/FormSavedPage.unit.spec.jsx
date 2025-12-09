import React from 'react';
import { expect } from 'chai';
import { Provider } from 'react-redux';

import { createStore } from 'redux';
import { render, cleanup } from '@testing-library/react';
import FormSavedPage from '../../../containers/FormSavedPage';
import mockItf from '../../fixtures/mocks/mock-itf';

const mockStore = state => createStore(() => state);

const baseRoute = {
  formConfig: {
    saveInProgress: {},
    customText: {},
    savedFormMessages: {},
    pageList: [{ path: '/intro' }, { path: '/start' }],
  },
  pageList: [{ path: '/intro' }, { path: '/start' }],
};

describe('Survivors Benefits <FormSavedPage />', () => {
  afterEach(() => cleanup());

  let anchor;
  beforeEach(() => {
    anchor = document.createElement('div');
    anchor.setAttribute('name', 'topScrollElement');
    document.body.appendChild(anchor);
  });
  afterEach(() => {
    anchor?.remove();
  });

  const renderWithStore = storeState => {
    const store = mockStore(storeState);
    return render(
      <Provider store={store}>
        <FormSavedPage route={baseRoute} />
      </Provider>,
    );
  };

  it('renders ITF expiration guidance when currentITF expirationDate exists', () => {
    const itfFixture = mockItf.getItf();
    const expirationDateIso =
      itfFixture.data.attributes.intentToFile[0].expirationDate;
    const storeState = {
      form: {
        formId: 'FORM_534EZ',
        loadedData: { metadata: { returnUrl: '/resume' } },
        lastSavedDate: Math.floor(Date.now() / 1000),
        expirationDate: Math.floor(Date.now() / 1000) + 86400,
        itf: { currentITF: { expirationDate: expirationDateIso } },
      },
      user: { profile: { prefillsAvailable: [], verified: true } },
    };
    const { container } = renderWithStore(storeState);
    const expiresContainer = container.querySelector('.expires-container');
    expect(expiresContainer).to.exist;
    expect(expiresContainer.textContent).to.include(
      'Submit your application by',
    );
    const strongDate = container.querySelector('.expires-container .expires');
    expect(strongDate).to.exist;
    expect(strongDate.textContent).to.include(
      new Date(expirationDateIso).getUTCFullYear().toString(),
    );
  });

  it('renders ITF missing guidance when currentITF expirationDate is absent', () => {
    const storeState = {
      form: {
        formId: 'FORM_534EZ',
        loadedData: { metadata: { returnUrl: '/spousalsupport' } },
        lastSavedDate: Math.floor(Date.now() / 1000),
        expirationDate: Math.floor(Date.now() / 1000) + 86400,
        itf: {},
      },
      user: { profile: { prefillsAvailable: [], verified: true } },
    };
    const { container } = renderWithStore(storeState);
    const alert = container.querySelector('va-alert');
    expect(alert).to.exist;
    expect(alert.textContent).to.include(
      'But we can’t find a record of your intent to file a Veterans Pension application right now.',
    );
    expect(container.querySelector('.expires-container')).to.not.exist;
  });
});
