import React, { useState } from 'react';
import { expect } from 'chai';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import sinon from 'sinon';
import {
  createPutHandler,
  jsonResponse,
} from 'platform/testing/unit/msw-adapter';
import { server } from 'platform/testing/unit/mocha-setup';
import { FIELD_NAMES } from 'platform/user/profile/vap-svc/constants';
import { setData } from 'platform/forms-system/exportsFile';
import { autoSaveForm } from 'platform/forms/save-in-progress/actions';
import PropTypes from 'prop-types';
import {
  ContactInfoFormAppConfigProvider,
  useContactInfoFormAppConfig,
} from '../../components/ContactInfoFormAppConfigContext';

// Create a mock store that can handle state updates
const createMockStore = initialState =>
  createStore((state = initialState, action) => {
    if (action.type === 'SET_DATA') {
      return {
        ...state,
        form: {
          ...state.form,
          data: action.data,
        },
      };
    }
    return state;
  });

const defaultState = {
  form: {
    data: {
      veteran: {
        mailingAddress: {
          addressLine1: '1234 Spooner St',
          city: 'Boston',
          stateCode: 'MA',
          zipCode: '02108',
          updatedAt: '2023-01-01T00:00:00.000Z',
          countryCodeIso3: 'USA',
        },
      },
    },
    formId: 'FORM-MOCK-AE-DESIGN-PATTERNS',
    version: 0,
  },
};

const TestComponent = ({ updateProfileChoice = 'no' }) => {
  const context = useContactInfoFormAppConfig();
  const [showError, setShowError] = useState(false);

  const handleUpdate = async () => {
    try {
      await context.updateContactInfoForFormApp(
        FIELD_NAMES.MAILING_ADDRESS,
        {
          addressLine1: '11 Spooner St',
        },
        updateProfileChoice,
        '2025-04-08T18:01:25.548Z',
        'United States',
      );
    } catch {
      setShowError(true);
    }
  };

  return (
    <>
      <button onClick={handleUpdate}>Update</button>
      {showError && (
        <div role="alert" className="usa-alert usa-alert-error">
          <p>
            We couldn’t update your VA.gov profile, but your changes were saved
            to this form.
          </p>
        </div>
      )}
    </>
  );
};

TestComponent.propTypes = {
  updateProfileChoice: PropTypes.string,
};

describe('ContactInfoFormAppConfigProvider - Error Handling', () => {
  let clock;
  const mockDate = new Date('2025-04-08T18:01:25.548Z');

  beforeEach(() => {
    clock = sinon.useFakeTimers({ now: mockDate.getTime(), toFake: ['Date'] });
  });

  afterEach(() => {
    clock.restore();
  });

  it('shows error alert when profile update fails and form save succeeds with the correct updated data', async () => {
    const store = createMockStore(defaultState);

    server.use(
      createPutHandler('/v0/profile/addresses', () => {
        return jsonResponse(null, { status: 500 });
      }),
      createPutHandler(
        '/v0/in_progress_forms/FORM-MOCK-AE-DESIGN-PATTERNS',
        () => {
          const newAddressData = {
            ...defaultState.form.data.veteran.mailingAddress,
            addressLine1: '11 Spooner St',
            updatedAt: '2025-04-08T18:01:25.548Z',
            updateProfileChoice: 'no',
            countryName: 'United States',
          };

          // Update the Redux store with the new form data
          const updatedFormData = {
            veteran: {
              ...defaultState.form.data.veteran,
              mailingAddress: newAddressData,
            },
          };

          // First dispatch setData to update the store
          store.dispatch(setData(updatedFormData));

          // Then dispatch autoSaveForm
          store.dispatch(
            autoSaveForm(
              defaultState.form.formId,
              updatedFormData,
              defaultState.form.version,
              undefined,
            ),
          );

          // Return the payload that was passed in
          return jsonResponse(
            {
              data: {
                id: '',
                type: 'in_progress_forms',
                attributes: {
                  formId: defaultState.form.formId,
                  createdAt: '2025-04-05T18:01:25.548Z',
                  updatedAt: '2025-04-08T18:01:25.548Z',
                  metadata: {
                    version: defaultState.form.version,
                  },
                },
              },
            },
            { status: 200 },
          );
        },
      ),
    );

    const { getByText, getByRole } = render(
      <Provider store={store}>
        <ContactInfoFormAppConfigProvider
          value={{
            keys: { wrapper: 'veteran' },
            formKey: 'mailingAddress',
          }}
        >
          <TestComponent updateProfileChoice="no" />
        </ContactInfoFormAppConfigProvider>
      </Provider>,
    );

    fireEvent.click(getByText('Update'));

    await waitFor(() => {
      const alert = getByRole('alert');
      expect(alert).to.exist;
      expect(alert).to.have.class('usa-alert-error');
      expect(alert.textContent).to.include(
        'We couldn’t update your VA.gov profile, but your changes were saved to this form.',
      );
    });

    await waitFor(() => {
      const updatedFormData = store.getState().form.data;
      const { mailingAddress } = updatedFormData.veteran;
      expect(mailingAddress).to.deep.include({
        addressLine1: '11 Spooner St',
        updatedAt: '2025-04-08T18:01:25.548Z',
        updateProfileChoice: 'no',
      });
    });
  });
});
