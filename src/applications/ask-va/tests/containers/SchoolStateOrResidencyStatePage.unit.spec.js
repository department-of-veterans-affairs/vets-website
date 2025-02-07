import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import SchoolStateOrResidencyStateCustomPage from '../../containers/SchoolStateOrResidencyStatePage';

const mockStore = configureMockStore();
const initialState = {
  form: {
    data: {
      stateOrResidency: {
        schoolState: '',
        residencyState: '',
      },
    },
  },
};

describe('SchoolStateOrResidencyStateCustomPage Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore(initialState);
  });

  it('renders the component with correct titles and fields', () => {
    const { container } = render(
      <Provider store={store}>
        <SchoolStateOrResidencyStateCustomPage
          id="test-id"
          goForward={() => {}}
          goBack={() => {}}
          formData={initialState.form.data}
          onChange={() => {}}
        />
      </Provider>,
    );

    const title = container.querySelector('h3');
    const labels = container.querySelectorAll('va-select');

    expect(title.textContent).to.contain('School state or residency state');
    expect(labels.length).to.eq(2);
  });
});
