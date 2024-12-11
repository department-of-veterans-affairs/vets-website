import React from 'react';
import { Provider } from 'react-redux';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import SubmitHelper from '../../../components/SubmitHelper';
import formConfig from '../../../config/form';

describe('<SubmitHelper>', () => {
  const getData = () => ({
    props: {
      formConfig,
      route: {
        path: 'introduction',
      },
      router: {
        push: sinon.spy(),
      },
      getResults: sinon.spy(),
    },
    mockStore: {
      getState: () => ({
        form: {
          formId: 'T-QSTNR',
          data: {},
        },
      }),
      subscribe: () => {},
      dispatch: sinon.spy(),
    },
  });
  const subject = ({ mockStore, props }) =>
    render(
      <Provider store={mockStore}>
        <SubmitHelper {...props} />
      </Provider>,
    );

  it('renders', () => {
    const { mockStore, props } = getData();
    const { container } = subject({ mockStore, props });

    expect(container.querySelector('#submit-helper')).to.exist;
  });

  it('handles click event', async () => {
    const { mockStore, props } = getData();
    const { dispatch } = mockStore;
    const { container } = subject({ mockStore, props });

    const submitHelper = container.querySelector('#submit-helper');
    fireEvent.click(submitHelper);

    await waitFor(() => {
      expect(dispatch.called).to.be.true;
    });
  });
});
