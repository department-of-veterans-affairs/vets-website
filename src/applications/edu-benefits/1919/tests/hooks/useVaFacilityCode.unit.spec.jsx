import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import * as reactRedux from 'react-redux';
import * as api from 'platform/utilities/api';

import { useVaFacilityCode } from '../../hooks/useVaFacilityCode';

// Dummy component to trigger the hook
const TestComponent = () => {
  useVaFacilityCode();
  return <div data-testid="hook-container" />;
};

describe('useVaFacilityCode hook', () => {
  let useSelectorStub;
  let useDispatchStub;
  let dispatchSpy;
  let localStorageSetItemStub;

  beforeEach(() => {
    dispatchSpy = sinon.spy();
    // useDispatchStub = sinon.stub(reactRedux, 'useDispatch').returns(dispatchSpy);
    localStorageSetItemStub = sinon.stub(global.localStorage, 'setItem');
    // useSelectorStub = sinon.stub(reactRedux, 'useSelector');
  });

  it('calls API and dispatches data on success', async () => {
    const formData = {
      institutionDetails: {
        facilityCode: '12345678',
      },
    };

    // useSelectorStub.callsFake(cb => cb({ form: { data: formData } }));

    const mockApiResponse = {
      data: {
        attributes: {
          name: 'Test School',
          address1: '1 Test St',
          address2: '',
          address3: '',
          city: 'Testville',
          state: 'TS',
          zip: '00000',
          country: 'USA',
          accredited: true,
        },
      },
    };

    sinon.stub(api, 'apiRequest').resolves(mockApiResponse);

    render(<TestComponent />);

    await waitFor(() => {
      expect(dispatchSpy.called).to.be.true;
      expect(localStorageSetItemStub.calledWith('isAccredited', 'true')).to.be
        .true;
    });
    useDispatchStub.restore();
  });

  it('handles API failure gracefully', async () => {
    const formData = {
      institutionDetails: {
        facilityCode: '12345678',
      },
    };

    // useSelectorStub.callsFake(cb => cb({ form: { data: formData } }));

    sinon.stub(api, 'apiRequest').rejects(new Error('API failed'));

    render(<TestComponent />);

    await waitFor(() => {
      expect(dispatchSpy.called).to.be.true;
      expect(localStorageSetItemStub.calledWith('isAccredited', false)).to.be
        .true;
    });
    useDispatchStub.restore();
  });

  it('does not fetch if facility code is too short', async () => {
    const formData = {
      institutionDetails: {
        facilityCode: '1234',
      },
    };

    // useSelectorStub.callsFake(cb => cb({ form: { data: formData } }));

    const apiSpy = sinon.spy(api, 'apiRequest');

    render(<TestComponent />);

    await waitFor(() => {
      expect(apiSpy.called).to.be.false;
      expect(dispatchSpy.called).to.be.false;
    });
    useDispatchStub.restore();
  });
});
