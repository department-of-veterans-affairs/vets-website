import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import * as redux from 'react-redux';
import { waitFor } from '@testing-library/react';

import SubmissionError from '../../../config/submissionError';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('<SubmissionError />', () => {
  let store;
  let useDispatchMock;
  let useSelectorMock;

  const mockInitialState = {
    form: {
      submission: {
        errorMessage: 'vets_server_error: Internal Server Error',
      },
    },
  };

  beforeEach(() => {
    useSelectorMock = sinon.stub(redux, 'useSelector');
    useDispatchMock = sinon.stub(redux, 'useDispatch').returns(() => {});
    store = mockStore(mockInitialState);
    useSelectorMock.callsFake(selector => selector(mockInitialState));
  });

  afterEach(() => {
    useDispatchMock.restore();
    useSelectorMock.restore();
  });

  it('renders the alert with headline and links', async () => {
    const wrapper = mount(
      <Provider store={store}>
        <SubmissionError />
      </Provider>,
    );
    await waitFor(() => {
      expect(wrapper.find('#submission-error').exists()).to.be.true;
      expect(wrapper.find('h3[slot="headline"]').exists()).to.be.true;
      expect(
        wrapper
          .find(
            'a.vads-c-action-link--green[href="/representative/submissions"]',
          )
          .exists(),
      ).to.be.true;
      expect(
        wrapper
          .find(
            'a[href="https://www.va.gov/get-help-from-accredited-representative/appoint-rep/introduction/"]',
          )
          .exists(),
      ).to.be.true;
      wrapper.unmount();
    });
  });
});
