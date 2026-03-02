import React from 'react';
import userEvent from '@testing-library/user-event';
import { expect } from 'chai';
import sinon from 'sinon';

import vapService from '~/platform/user/profile/vap-svc/reducers';
import { renderWithStoreAndRouter } from '~/platform/testing/unit/react-testing-library-helpers';
import { VAPServiceProfileField } from '../../containers/VAPServiceProfileField';

function Content() {
  return <h1>Content</h1>;
}

function EditModal() {
  return <span>EditModal</span>;
}

const initialState = {
  featureToggles: { loading: false },
  vapService: {
    hasUnsavedEdits: false,
    transactions: [],
    fieldTransactionMap: { homePhone: null },
    transactionsAwaitingUpdate: [],
    initialFormFields: {
      homePhone: {
        value: {
          areaCode: '989',
          extension: '123',
          phoneNumber: '8981233',
          inputPhoneNumber: '9898981233',
        },
        formSchema: {
          type: 'object',
          properties: {
            'view:noInternationalNumbers': {
              type: 'object',
              properties: {},
            },
            inputPhoneNumber: {
              type: 'string',
              pattern: '^\\d{10}$',
            },
            extension: {
              type: 'string',
              pattern: '^\\s*[0-9-]{0,6}\\s*$',
              maxLength: 6,
            },
          },
          required: ['inputPhoneNumber'],
        },
        uiSchema: {
          inputPhoneNumber: {
            'ui:title': 'Home phone number (U.S. numbers only)',
            'ui:errorMessages': {
              pattern: 'You must enter a valid 10-digit U.S. phone number.',
            },
            'ui:options': {
              ariaDescribedby: 'error-message-details',
            },
          },
          extension: {
            'ui:title': 'Extension (6 digits maximum)',
            'ui:errorMessages': {
              pattern: 'You must enter a valid extension up to 6 digits.',
            },
          },
        },
      },
    },
    modal: 'homePhone',
    formFields: {},
  },
  user: {
    profile: {
      vapContactInfo: {
        homePhone: {
          areaCode: '989',
          phoneNumber: '1234567',
        },
      },
    },
  },
};

describe('<VAPServiceProfileField/>', () => {
  let props = null;

  beforeEach(() => {
    props = {
      analyticsSectionName: 'home-phone',
      clearErrors() {},
      Content: () => <Content />,
      data: { homePhone: { areaCode: '989', phoneNumber: '1234567' } },
      EditModal: () => <EditModal />,
      field: null,
      fieldName: 'homePhone',
      isEditing: false,
      isEmpty: false,
      title: 'Home phone',
      openModal: sinon.spy(),
      onEdit: sinon.spy(),
    };
  });

  it('renders the Content prop', () => {
    const { getByRole } = renderWithStoreAndRouter(
      <VAPServiceProfileField {...props} />,
      {
        initialState,
        reducers: { vapService },
      },
    );

    expect(getByRole('heading', { name: /Content/i })).to.be.visible;
  });

  it('conditional render based on existence of data', () => {
    const state = {
      ...initialState,
      ...{ user: { profile: { vapContactInfo: {} } } },
    };
    props = { ...props, isEmpty: true };
    const { queryByRole, getByTestId } = renderWithStoreAndRouter(
      <VAPServiceProfileField {...props} />,
      {
        initialState: state,
        reducers: { vapService },
      },
    );

    expect(queryByRole('heading', { name: /Content/i })).to.be.null;
    expect(getByTestId('save-edit-button')).to.be.visible;
  });

  it('renders the edit link and handles click', () => {
    const { getByRole } = renderWithStoreAndRouter(
      <VAPServiceProfileField {...props} />,
      {
        initialState,
        reducers: { vapService },
      },
    );

    const editLink = getByRole('button', { name: /Edit Home phone/i });
    userEvent.click(editLink);
    expect(props.openModal.callCount).to.equal(1);
  });
});
