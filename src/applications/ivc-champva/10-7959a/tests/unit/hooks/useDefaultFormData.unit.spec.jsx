import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import sinon from 'sinon-v20';
import { useDefaultFormData } from '../../../hooks/useDefaultFormData';

const TestComponent = () => {
  useDefaultFormData();
  return null;
};

describe('10-7959a `useDefaultFormData` hook', () => {
  let dispatch;

  const subject = ({
    enableResubmit = false,
    enableLlm = false,
    data = {},
  } = {}) => {
    let state = {
      featureToggles: {
        champvaEnableClaimResubmitQuestion: enableResubmit,
        champvaClaimsLlmValidation: enableLlm,
      },
      form: { data },
    };

    dispatch = sinon.stub().callsFake(action => {
      if (action?.type === 'SET_DATA') {
        state = {
          ...state,
          form: { data: { ...state.form.data, ...action.data } },
        };
      }
      return action;
    });

    const mockStore = {
      getState: () => state,
      subscribe: () => {},
      dispatch,
    };

    render(
      <Provider store={mockStore}>
        <TestComponent />
      </Provider>,
    );
  };

  beforeEach(() => sinon.restore());
  afterEach(() => sinon.restore());

  it('should dispatch `SET_DATA` with view:* keys derived from feature toggles', () => {
    subject({ enableResubmit: true });
    sinon.assert.calledOnceWithExactly(dispatch, {
      type: 'SET_DATA',
      data: {
        'view:champvaEnableClaimResubmitQuestion': true,
        'view:champvaClaimsLlmValidation': false,
      },
    });
  });

  it('should do nothing when all view:* fields already exist', () => {
    subject({
      enableLlm: true,
      enableResubmit: false,
      data: {
        'view:champvaEnableClaimResubmitQuestion': false,
        'view:champvaClaimsLlmValidation': true,
      },
    });
    sinon.assert.notCalled(dispatch);
  });
});
