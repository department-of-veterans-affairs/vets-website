import React from 'react';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import sinon from 'sinon';
import * as apiModule from 'platform/utilities/api';
import * as actions from 'platform/forms-system/src/js/actions';
import { useValidateFacilityCode } from '../../hooks/useValidateFacilityCode';

const mockStore = configureStore([]);

function renderHook(renderCallback, options = {}) {
  const { initialProps, ...renderOptions } = options;
  const result = React.createRef();
  result.current = null;

  function TestComponent({ renderCallbackProps }) {
    const hookResult = renderCallback(renderCallbackProps);
    result.current = hookResult;

    React.useEffect(() => {
      result.current = hookResult;
    });

    return null;
  }

  const { rerender: baseRerender, unmount } = render(
    <TestComponent renderCallbackProps={initialProps} />,
    renderOptions,
  );

  function rerender(rerenderCallbackProps) {
    return baseRerender(
      <TestComponent renderCallbackProps={rerenderCallbackProps} />,
    );
  }

  return { result, rerender, unmount };
}

describe('useValidateFacilityCode', () => {
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
      institutionDetails: {
        facilityCode: '',
      },
    };

    const { result } = renderHook(() => useValidateFacilityCode(formData), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

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
      institutionDetails: {
        facilityCode: '1234567',
      },
    };

    renderHook(() => useValidateFacilityCode(formData), {
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
          facilityMap: {
            main: {
              branches: [],
              extensions: [],
            },
          },
        },
      },
    };

    apiRequestStub.resolves(mockResponse);

    const formData = {
      institutionDetails: {
        facilityCode: '12345678',
      },
    };

    renderHook(() => useValidateFacilityCode(formData), {
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
          facilityMap: {
            main: {
              branches: [],
              extensions: [],
            },
          },
        },
      },
    };

    apiRequestStub.resolves(mockResponse);

    const formData = {
      institutionDetails: {
        facilityCode: '12345678',
      },
    };

    renderHook(() => useValidateFacilityCode(formData), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    await waitFor(() => {
      const loadingCall = setDataStub
        .getCalls()
        .find(
          call =>
            call.args[0].institutionDetails &&
            call.args[0].institutionDetails.isLoading === true,
        );
      expect(loadingCall).to.exist;
    });
  });

  it('should update form data with institution details on successful fetch', async () => {
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
          facilityMap: {
            main: {
              branches: [],
              extensions: [],
            },
          },
        },
      },
    };

    apiRequestStub.resolves(mockResponse);

    const formData = {
      institutionDetails: {
        facilityCode: '12345678',
      },
    };

    renderHook(() => useValidateFacilityCode(formData), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    await waitFor(() => {
      const successCall = setDataStub
        .getCalls()
        .find(
          call =>
            call.args[0].institutionDetails &&
            call.args[0].institutionDetails.isLoading === false &&
            call.args[0].institutionDetails.institutionName ===
              'Test University',
        );
      expect(successCall).to.exist;
      expect(
        successCall.args[0].institutionDetails.institutionAddress,
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
          facilityMap: {
            main: {
              branches: [],
              extensions: [],
            },
          },
        },
      },
    };

    apiRequestStub.resolves(mockResponse);

    // Test YR eligible codes (first digit 1-3, second digit 1-4)
    const eligibleCodes = ['11234567', '22345678', '34567890'];

    // eslint-disable-next-line no-restricted-syntax
    for (const code of eligibleCodes) {
      setDataStub.resetHistory();

      const formData = {
        institutionDetails: {
          facilityCode: code,
        },
      };

      // eslint-disable-next-line no-loop-func
      renderHook(() => useValidateFacilityCode(formData), {
        // eslint-disable-next-line no-loop-func
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      });

      // eslint-disable-next-line no-await-in-loop, no-loop-func
      await waitFor(() => {
        const successCall = setDataStub
          .getCalls()
          .find(
            call =>
              call.args[0].institutionDetails &&
              call.args[0].institutionDetails.yrEligible !== undefined,
          );
        expect(successCall).to.exist;
        expect(successCall.args[0].institutionDetails.yrEligible).to.be.true;
      });
    }
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
          facilityMap: {
            main: {
              branches: [],
              extensions: [],
            },
          },
        },
      },
    };

    apiRequestStub.resolves(mockResponse);

    // Test YR ineligible codes
    const ineligibleCodes = ['41234567', '15234567', '00234567'];

    // eslint-disable-next-line no-restricted-syntax
    for (const code of ineligibleCodes) {
      setDataStub.resetHistory();

      const formData = {
        institutionDetails: {
          facilityCode: code,
        },
      };

      // eslint-disable-next-line no-loop-func
      renderHook(() => useValidateFacilityCode(formData), {
        // eslint-disable-next-line no-loop-func
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      });

      // eslint-disable-next-line no-await-in-loop, no-loop-func
      await waitFor(() => {
        const successCall = setDataStub
          .getCalls()
          .find(
            call =>
              call.args[0].institutionDetails &&
              call.args[0].institutionDetails.yrEligible !== undefined,
          );
        expect(successCall).to.exist;
        expect(successCall.args[0].institutionDetails.yrEligible).to.be.false;
      });
    }
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
          facilityMap: {
            main: {
              branches: [],
              extensions: [],
            },
          },
        },
      },
    };

    apiRequestStub.resolves(mockResponse);

    const formData = {
      institutionDetails: {
        facilityCode: '12345678',
      },
    };

    renderHook(() => useValidateFacilityCode(formData), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    await waitFor(() => {
      const successCall = setDataStub
        .getCalls()
        .find(
          call =>
            call.args[0].institutionDetails &&
            call.args[0].institutionDetails.institutionName ===
              'Test University',
        );
      expect(successCall).to.exist;
    });
  });

  it('should handle API errors gracefully', async () => {
    apiRequestStub.rejects(new Error('API Error'));

    const formData = {
      institutionDetails: {
        facilityCode: '12345678',
      },
    };

    renderHook(() => useValidateFacilityCode(formData), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    await waitFor(() => {
      const errorCall = setDataStub
        .getCalls()
        .find(
          call =>
            call.args[0].institutionDetails &&
            call.args[0].institutionDetails.isLoading === false &&
            call.args[0].institutionDetails.institutionName === 'not found',
        );
      expect(errorCall).to.exist;
      expect(
        errorCall.args[0].institutionDetails.institutionAddress,
      ).to.deep.equal({});
    });
  });

  it('should handle missing address fields', async () => {
    const mockResponse = {
      data: {
        attributes: {
          name: 'Test University',
          facilityMap: {
            main: {
              branches: [],
              extensions: [],
            },
          },
        },
      },
    };

    apiRequestStub.resolves(mockResponse);

    const formData = {
      institutionDetails: {
        facilityCode: '12345678',
      },
    };

    renderHook(() => useValidateFacilityCode(formData), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    await waitFor(() => {
      const successCall = setDataStub
        .getCalls()
        .find(
          call =>
            call.args[0].institutionDetails &&
            call.args[0].institutionDetails.institutionAddress,
        );
      expect(successCall).to.exist;
      expect(
        successCall.args[0].institutionDetails.institutionAddress,
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
          facilityMap: {
            main: {
              branches: [],
              extensions: [],
            },
          },
        },
      },
    };

    apiRequestStub.resolves(mockResponse);

    const formData = {
      institutionDetails: {
        facilityCode: '12345678',
      },
    };

    const { result } = renderHook(() => useValidateFacilityCode(formData), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

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
          facilityMap: {
            main: {
              branches: [],
              extensions: [],
            },
          },
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
          facilityMap: {
            main: {
              branches: [],
              extensions: [],
            },
          },
        },
      },
    };

    apiRequestStub.onFirstCall().resolves(mockResponse1);
    apiRequestStub.onSecondCall().resolves(mockResponse2);

    const formData1 = {
      institutionDetails: {
        facilityCode: '11111111',
      },
    };

    const { rerender } = renderHook(props => useValidateFacilityCode(props), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
      initialProps: formData1,
    });

    await waitFor(() => {
      expect(apiRequestStub.callCount).to.equal(1);
    });

    const formData2 = {
      institutionDetails: {
        facilityCode: '22222222',
      },
    };

    rerender(formData2);

    await waitFor(() => {
      expect(apiRequestStub.callCount).to.equal(2);
      expect(apiRequestStub.secondCall.calledWith('/gi/institutions/22222222'))
        .to.be.true;
    });
  });
});
