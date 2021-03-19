import React from 'react';
import { expect } from 'chai';
import userEvent from '@testing-library/user-event';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import { removeDependents } from '../../redux/reducers';
import ManageDependentsApp from '../../containers/ManageDependentsApp';
import { SCHEMAS } from '../../schemas';

describe('<ManageDependentsApp />', () => {
  const mockData = {
    firstName: 'Cindy',
    lastName: 'See',
    ssn: '312-243-5634',
    dateOfBirth: '05/05/1953',
    relationship: 'Spouse',
  };
  it('renders a form', async () => {
    const initialState = {
      removeDependents: {
        dependentsState: {
          1: {
            uiSchema: SCHEMAS.Spouse.uiSchema,
            formSchema: SCHEMAS.Spouse.schema,
            formData: {},
          },
        },
      },
    };

    const screen = renderInReduxProvider(
      <ManageDependentsApp
        relationship="Spouse"
        closeFormHandler={() => {}}
        stateKey={1}
        userInfo={{
          fullName: {
            firstName: mockData.firstName,
            lastName: mockData.lastName,
          },
          dateOfBirth: mockData.dateOfBirth,
          ssn: mockData.ssn,
        }}
      />,
      {
        initialState,
        reducers: { removeDependents },
      },
    );
    expect(await screen.findByText('Remove dependent', { selector: 'button' }))
      .to.exist;
    expect(await screen.findByLabelText('Divorce')).to.exist;
    expect(await screen.findByLabelText('Annulment')).to.exist;
    expect(await screen.findByLabelText('Declared Void')).to.exist;
    expect(await screen.findByLabelText('Spouse’s Death')).to.exist;
    expect(await screen.findByText('Date marriage ended')).to.exist;
    expect(await screen.findByText('State where this happened')).to.exist;
    expect(await screen.findByText('City where this happened')).to.exist;
  });

  it('fills out the form', async () => {
    const initialState = {
      removeDependents: {
        dependentsState: {
          1: {
            uiSchema: SCHEMAS.Spouse.uiSchema,
            formSchema: SCHEMAS.Spouse.schema,
            formData: {},
          },
        },
      },
      user: {
        profile: {
          vapContactInfo: {
            email: {
              emailAddress: 'someone@famous.com',
            },
            homePhone: {
              areaCode: '555',
              phoneNumber: '8001212',
            },
            residentialAddress: {
              addressType: 'DOMESTIC',
              countryName: 'United States',
              countryCodeIso3: 'USA',
              addressLine1: '123 Main Blvd',
              addressLine2: 'Floor 33',
              addressLine3: 'Suite 55',
              city: 'Hollywood',
              stateCode: 'CA',
              zipCode: '90210',
            },
          },
        },
      },
    };

    const screen = renderInReduxProvider(
      <ManageDependentsApp
        relationship="Spouse"
        closeFormHandler={() => {}}
        stateKey={1}
        userInfo={{
          fullName: {
            firstName: mockData.firstName,
            lastName: mockData.lastName,
          },
          dateOfBirth: mockData.dateOfBirth,
          ssn: mockData.ssn,
        }}
      />,
      {
        initialState,
        reducers: { removeDependents },
      },
    );
    userEvent.click(await screen.findByLabelText('Divorce'));
    userEvent.selectOptions(await screen.findByLabelText('Month'), ['1']);
    userEvent.selectOptions(await screen.findByLabelText('Day'), ['25']);
    userEvent.type(await screen.findByLabelText('Year'), '2003');
    userEvent.selectOptions(
      await screen.findByLabelText('State where this happened', {
        exact: false,
      }),
      ['AL'],
    );
    userEvent.type(
      await screen.findByLabelText('City where this happened', {
        exact: false,
      }),
      'Test city',
    );
    const submitBtn = screen.findByText('Remove dependent', {
      selector: 'button',
    });
    userEvent.click(await submitBtn);
    expect(await screen.queryAllByRole('alert')).to.have.lengthOf(0);
  });
});
