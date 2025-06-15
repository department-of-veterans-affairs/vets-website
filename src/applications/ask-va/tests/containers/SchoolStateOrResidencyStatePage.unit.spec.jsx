import React from 'react';
import { Provider } from 'react-redux';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import userEvent from '@testing-library/user-event';
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

  it('should handle a selection change', async () => {
    const onChange = sinon.spy();
    const { container } = render(
      <Provider store={store}>
        <SchoolStateOrResidencyStateCustomPage
          id="test-id"
          goForward={() => {}}
          goBack={() => {}}
          formData={initialState.form.data}
          onChange={onChange}
        />
      </Provider>,
    );

    const schoolState = container.querySelector(
      'va-select[name="schoolState"]',
    );
    schoolState.__events.vaSelect({
      detail: { value: 'CA' },
      target: { name: 'California' },
    });

    await waitFor(() => {
      expect(onChange.called).to.be.true;
    });
  });

  it('should should show validation error if no selection', async () => {
    const onChange = sinon.spy();
    const { container, getByText } = render(
      <Provider store={store}>
        <SchoolStateOrResidencyStateCustomPage
          id="test-id"
          goForward={() => {}}
          goBack={() => {}}
          formData={initialState.form.data}
          onChange={onChange}
        />
      </Provider>,
    );

    userEvent.click(getByText('Continue'));

    await waitFor(() => {
      expect(container.querySelector('.school-state-error')).to.exist;
    });
  });

  it('proceed if no validation error', async () => {
    const onForward = sinon.spy();
    store = mockStore({
      form: {
        data: {
          stateOrResidency: {
            schoolState: 'CA',
            residencyState: 'CA',
          },
        },
      },
    });
    const { getByText } = render(
      <Provider store={store}>
        <SchoolStateOrResidencyStateCustomPage
          id="test-id"
          goForward={onForward}
          goBack={() => {}}
          onChange={() => {}}
        />
      </Provider>,
    );

    userEvent.click(getByText('Continue'));

    await waitFor(() => {
      expect(onForward.called).to.be.true;
    });
  });
});
