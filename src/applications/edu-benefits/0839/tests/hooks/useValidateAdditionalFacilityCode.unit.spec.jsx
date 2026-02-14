import React from 'react';
import { expect } from 'chai';
import { waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import sinon from 'sinon';
import * as apiModule from 'platform/utilities/api';
import * as actions from 'platform/forms-system/src/js/actions';
import { useValidateAdditionalFacilityCode } from '../../hooks/useValidateAdditionalFacilityCode';

const mockStore = configureStore([]);

describe('useValidateAdditionalFacilityCode', () => {
  let store;
  let apiRequestStub;
  let setDataStub;

  beforeEach(() => {
    store = mockStore({
      form: {
        data: {},
      },
    });
    apiRequestStub = sinon.stub(apiModule, 'apiRequest');
    setDataStub = sinon.stub(actions, 'setData');
    setDataStub.returns({ type: 'SET_DATA' });
  });

  afterEach(() => {
    apiRequestStub.restore();
    setDataStub.restore();
  });

  it('should initialize with default values', () => {
    const formData = {
      additionalInstitutionDetails: [
        {
          facilityCode: '',
        },
      ],
    };

    const { result } = renderHook(
      () => useValidateAdditionalFacilityCode(formData, 0),
      {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      },
    );

    expect(result.current.loader).to.be.false;
    expect(result.current.institutionName).to.equal('not found');
    expect(result.current.institutionAddress).to.deep.equal({
      street: '',
      street2: '',
      street3: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
    });
  });

  it('should not fetch when facility code is less than 8 characters', async () => {
    const formData = {
      additionalInstitutionDetails: [
        {
          facilityCode: '1234567',
        },
      ],
    };

    renderHook(() => useValidateAdditionalFacilityCode(formData, 0), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    await waitFor(() => {
      expect(apiRequestStub.called).to.be.false;
    });
  });

  it('should not fetch when index is undefined', async () => {
    const formData = {
      additionalInstitutionDetails: [
        {
          facilityCode: '12345678',
        },
      ],
    };

    renderHook(() => useValidateAdditionalFacilityCode(formData, undefined), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    await waitFor(() => {
      expect(apiRequestStub.called).to.be.false;
    });
  });

  it('should fetch institution data when facility code is 8 characters', async () => {
    const mockResponse = {
      data: {
        attributes: {
          name: 'Test University',
          address1: '123 Main St',
          address2: 'Suite 100',
          address3: 'Building A',
          city: 'Boston',
          state: 'MA',
          zip: '02101',
          country: 'USA',
          programTypes: ['OJT'],
        },
      },
    };

    apiRequestStub.resolves(mockResponse);

    const formData = {
      additionalInstitutionDetails: [
        {
          facilityCode: '12345678',
        },
      ],
    };

    renderHook(() => useValidateAdditionalFacilityCode(formData, 0), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    await waitFor(() => {
      expect(apiRequestStub.calledOnce).to.be.true;
      expect(
        apiRequestStub.calledWith('/gi/institutions/12345678', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }),
      ).to.be.true;
    });
  });

  it('should set loading state to true during fetch', async () => {
    const mockResponse = {
      data: {
        attributes: {
          name: 'Test University',
          address1: '123 Main St',
          city: 'Boston',
          state: 'MA',
          zip: '02101',
          country: 'USA',
          programTypes: ['OJT'],
        },
      },
    };

    apiRequestStub.resolves(mockResponse);

    const formData = {
      additionalInstitutionDetails: [
        {
          facilityCode: '12345678',
        },
      ],
    };

    renderHook(() => useValidateAdditionalFacilityCode(formData, 0), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    await waitFor(() => {
      const loadingCall = setDataStub
        .getCalls()
        .find(
          call =>
            call.args[0].additionalInstitutionDetails &&
            call.args[0].additionalInstitutionDetails[0] &&
            call.args[0].additionalInstitutionDetails[0].isLoading === true,
        );
      expect(loadingCall).to.exist;
    });
  });

  it('should update form data at correct index on successful fetch', async () => {
    const mockResponse = {
      data: {
        attributes: {
          name: 'Test University',
          address1: '123 Main St',
          address2: 'Suite 100',
          address3: 'Building A',
          city: 'Boston',
          state: 'MA',
          zip: '02101',
          country: 'USA',
          programTypes: ['OJT'],
        },
      },
    };

    apiRequestStub.resolves(mockResponse);

    const formData = {
      additionalInstitutionDetails: [
        {
          facilityCode: '11111111',
        },
        {
          facilityCode: '12345678',
        },
        {
          facilityCode: '33333333',
        },
      ],
    };

    renderHook(() => useValidateAdditionalFacilityCode(formData, 1), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    await waitFor(() => {
      const successCall = setDataStub
        .getCalls()
        .find(
          call =>
            call.args[0].additionalInstitutionDetails &&
            call.args[0].additionalInstitutionDetails[1] &&
            call.args[0].additionalInstitutionDetails[1].isLoading === false &&
            call.args[0].additionalInstitutionDetails[1].institutionName ===
              'Test University',
        );
      expect(successCall).to.exist;
      expect(
        successCall.args[0].additionalInstitutionDetails[1].institutionAddress,
      ).to.deep.equal({
        street: '123 Main St',
        street2: 'Suite 100',
        street3: 'Building A',
        city: 'Boston',
        state: 'MA',
        postalCode: '02101',
        country: 'USA',
      });
    });
  });

  it('should not modify other array items during update', async () => {
    const mockResponse = {
      data: {
        attributes: {
          name: 'Test University',
          address1: '123 Main St',
          city: 'Boston',
          state: 'MA',
          zip: '02101',
          country: 'USA',
          programTypes: ['OJT'],
        },
      },
    };

    apiRequestStub.resolves(mockResponse);

    const formData = {
      additionalInstitutionDetails: [
        {
          facilityCode: '11111111',
          institutionName: 'First University',
        },
        {
          facilityCode: '12345678',
        },
        {
          facilityCode: '33333333',
          institutionName: 'Third University',
        },
      ],
    };

    renderHook(() => useValidateAdditionalFacilityCode(formData, 1), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    await waitFor(() => {
      const successCall = setDataStub
        .getCalls()
        .find(
          call =>
            call.args[0].additionalInstitutionDetails &&
            call.args[0].additionalInstitutionDetails[1] &&
            call.args[0].additionalInstitutionDetails[1].institutionName ===
              'Test University',
        );
      expect(successCall).to.exist;
      // Verify other items remain unchanged
      expect(
        successCall.args[0].additionalInstitutionDetails[0].facilityCode,
      ).to.equal('11111111');
      expect(
        successCall.args[0].additionalInstitutionDetails[2].facilityCode,
      ).to.equal('33333333');
    });
  });

  it('should calculate YR eligibility correctly for eligible facility codes', async () => {
    const mockResponse = {
      data: {
        attributes: {
          name: 'Test University',
          address1: '123 Main St',
          city: 'Boston',
          state: 'MA',
          zip: '02101',
          country: 'USA',
          programTypes: ['OJT'],
        },
      },
    };

    apiRequestStub.resolves(mockResponse);

    const formData = {
      additionalInstitutionDetails: [
        {
          facilityCode: '11234567',
        },
      ],
    };

    renderHook(() => useValidateAdditionalFacilityCode(formData, 0), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    await waitFor(() => {
      const successCall = setDataStub
        .getCalls()
        .find(
          call =>
            call.args[0].additionalInstitutionDetails &&
            call.args[0].additionalInstitutionDetails[0] &&
            call.args[0].additionalInstitutionDetails[0].yrEligible !==
              undefined,
        );
      expect(successCall).to.exist;
      expect(successCall.args[0].additionalInstitutionDetails[0].yrEligible).to
        .be.true;
    });
  });

  it('should calculate YR eligibility correctly for ineligible facility codes', async () => {
    const mockResponse = {
      data: {
        attributes: {
          name: 'Test University',
          address1: '123 Main St',
          city: 'Boston',
          state: 'MA',
          zip: '02101',
          country: 'USA',
          programTypes: ['OJT'],
        },
      },
    };

    apiRequestStub.resolves(mockResponse);

    const formData = {
      additionalInstitutionDetails: [
        {
          facilityCode: '41234567',
        },
      ],
    };

    renderHook(() => useValidateAdditionalFacilityCode(formData, 0), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    await waitFor(() => {
      const successCall = setDataStub
        .getCalls()
        .find(
          call =>
            call.args[0].additionalInstitutionDetails &&
            call.args[0].additionalInstitutionDetails[0] &&
            call.args[0].additionalInstitutionDetails[0].yrEligible !==
              undefined,
        );
      expect(successCall).to.exist;
      expect(successCall.args[0].additionalInstitutionDetails[0].yrEligible).to
        .be.false;
    });
  });

  it('should handle missing or null program types', async () => {
    const mockResponse = {
      data: {
        attributes: {
          name: 'Test University',
          address1: '123 Main St',
          city: 'Boston',
          state: 'MA',
          zip: '02101',
          country: 'USA',
          programTypes: null,
        },
      },
    };

    apiRequestStub.resolves(mockResponse);

    const formData = {
      additionalInstitutionDetails: [
        {
          facilityCode: '12345678',
        },
      ],
    };

    renderHook(() => useValidateAdditionalFacilityCode(formData, 0), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    await waitFor(() => {
      const successCall = setDataStub
        .getCalls()
        .find(
          call =>
            call.args[0].additionalInstitutionDetails &&
            call.args[0].additionalInstitutionDetails[0] &&
            call.args[0].additionalInstitutionDetails[0].institutionName ===
              'Test University',
        );
      expect(successCall).to.exist;
    });
  });

  it('should handle API errors gracefully', async () => {
    apiRequestStub.rejects(new Error('API Error'));

    const formData = {
      additionalInstitutionDetails: [
        {
          facilityCode: '12345678',
        },
      ],
    };

    renderHook(() => useValidateAdditionalFacilityCode(formData, 0), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    await waitFor(() => {
      const errorCall = setDataStub
        .getCalls()
        .find(
          call =>
            call.args[0].additionalInstitutionDetails &&
            call.args[0].additionalInstitutionDetails[0] &&
            call.args[0].additionalInstitutionDetails[0].isLoading === false &&
            call.args[0].additionalInstitutionDetails[0].institutionName ===
              'not found',
        );
      expect(errorCall).to.exist;
      expect(
        errorCall.args[0].additionalInstitutionDetails[0].institutionAddress,
      ).to.deep.equal({});
    });
  });

  it('should handle missing address fields', async () => {
    const mockResponse = {
      data: {
        attributes: {
          name: 'Test University',
          programTypes: ['OJT'],
        },
      },
    };

    apiRequestStub.resolves(mockResponse);

    const formData = {
      additionalInstitutionDetails: [
        {
          facilityCode: '12345678',
        },
      ],
    };

    renderHook(() => useValidateAdditionalFacilityCode(formData, 0), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    await waitFor(() => {
      const successCall = setDataStub
        .getCalls()
        .find(
          call =>
            call.args[0].additionalInstitutionDetails &&
            call.args[0].additionalInstitutionDetails[0] &&
            call.args[0].additionalInstitutionDetails[0].institutionAddress,
        );
      expect(successCall).to.exist;
      expect(
        successCall.args[0].additionalInstitutionDetails[0].institutionAddress,
      ).to.deep.equal({
        street: '',
        street2: '',
        street3: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
      });
    });
  });

  it('should return correct hook values after successful fetch', async () => {
    const mockResponse = {
      data: {
        attributes: {
          name: 'Test University',
          address1: '123 Main St',
          city: 'Boston',
          state: 'MA',
          zip: '02101',
          country: 'USA',
          programTypes: ['OJT'],
        },
      },
    };

    apiRequestStub.resolves(mockResponse);

    const formData = {
      additionalInstitutionDetails: [
        {
          facilityCode: '12345678',
        },
      ],
    };

    const { result } = renderHook(
      () => useValidateAdditionalFacilityCode(formData, 0),
      {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      },
    );

    await waitFor(() => {
      expect(result.current.loader).to.be.false;
      expect(result.current.institutionName).to.equal('Test University');
      expect(result.current.institutionAddress.street).to.equal('123 Main St');
      expect(result.current.institutionAddress.city).to.equal('Boston');
    });
  });

  it('should refetch when facility code changes', async () => {
    const mockResponse1 = {
      data: {
        attributes: {
          name: 'First University',
          address1: '123 Main St',
          city: 'Boston',
          state: 'MA',
          zip: '02101',
          country: 'USA',
          programTypes: ['OJT'],
        },
      },
    };

    const mockResponse2 = {
      data: {
        attributes: {
          name: 'Second University',
          address1: '456 Oak Ave',
          city: 'Cambridge',
          state: 'MA',
          zip: '02139',
          country: 'USA',
          programTypes: ['OJT'],
        },
      },
    };

    apiRequestStub.onFirstCall().resolves(mockResponse1);
    apiRequestStub.onSecondCall().resolves(mockResponse2);

    const formData1 = {
      additionalInstitutionDetails: [
        {
          facilityCode: '11111111',
        },
      ],
    };

    const { rerender } = renderHook(
      props => useValidateAdditionalFacilityCode(props, 0),
      {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
        initialProps: formData1,
      },
    );

    await waitFor(() => {
      expect(apiRequestStub.callCount).to.equal(1);
    });

    const formData2 = {
      additionalInstitutionDetails: [
        {
          facilityCode: '22222222',
        },
      ],
    };

    rerender(formData2);

    await waitFor(() => {
      expect(apiRequestStub.callCount).to.equal(2);
      expect(apiRequestStub.secondCall.calledWith('/gi/institutions/22222222'))
        .to.be.true;
    });
  });

  it('should handle empty additionalInstitutionDetails array gracefully', () => {
    const formData = {
      additionalInstitutionDetails: [],
    };

    const { result } = renderHook(
      () => useValidateAdditionalFacilityCode(formData, 0),
      {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      },
    );

    expect(result.current.loader).to.be.false;
    expect(result.current.institutionName).to.equal('not found');
  });

  it('should handle missing additionalInstitutionDetails gracefully', () => {
    const formData = {};

    const { result } = renderHook(
      () => useValidateAdditionalFacilityCode(formData, 0),
      {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      },
    );

    expect(result.current.loader).to.be.false;
    expect(result.current.institutionName).to.equal('not found');
  });

  it('should refetch when index changes', async () => {
    const mockResponse = {
      data: {
        attributes: {
          name: 'Test University',
          address1: '123 Main St',
          city: 'Boston',
          state: 'MA',
          zip: '02101',
          country: 'USA',
          programTypes: ['OJT'],
        },
      },
    };

    apiRequestStub.resolves(mockResponse);

    const formData = {
      additionalInstitutionDetails: [
        {
          facilityCode: '11111111',
        },
        {
          facilityCode: '22222222',
        },
      ],
    };

    const { rerender } = renderHook(
      ({ formData: fd, index: idx }) =>
        useValidateAdditionalFacilityCode(fd, idx),
      {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
        initialProps: { formData, index: 0 },
      },
    );

    await waitFor(() => {
      expect(apiRequestStub.callCount).to.equal(1);
      expect(apiRequestStub.firstCall.calledWith('/gi/institutions/11111111'))
        .to.be.true;
    });

    rerender({ formData, index: 1 });

    await waitFor(() => {
      expect(apiRequestStub.callCount).to.equal(2);
      expect(apiRequestStub.secondCall.calledWith('/gi/institutions/22222222'))
        .to.be.true;
    });
  });
});
