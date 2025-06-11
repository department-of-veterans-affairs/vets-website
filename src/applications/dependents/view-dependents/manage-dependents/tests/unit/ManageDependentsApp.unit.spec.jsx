import React from 'react';
import { expect } from 'chai';
import userEvent from '@testing-library/user-event';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import { removeDependents } from '../../redux/reducers';
import ManageDependentsApp from '../../containers/ManageDependentsApp';
import { SCHEMAS } from '../../schemas';

describe.skip('<ManageDependentsApp />', () => {
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
    expect(
      screen.getByRole('button', {
        name: 'Submit VA Form 686c to remove this dependent',
      }),
    ).to.exist;
    expect(screen.getByLabelText('Divorce')).to.exist;
    expect(screen.getByLabelText('Annulment')).to.exist;
    expect(screen.getByLabelText('Declared Void')).to.exist;
    expect(screen.getByLabelText('Spouse’s Death')).to.exist;
    expect(screen.getByText('Date marriage ended')).to.exist;
    expect(screen.getByText('State where this happened')).to.exist;
    expect(screen.getByText('City where this happened')).to.exist;
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
    userEvent.click(screen.getByLabelText('Divorce'));
    userEvent.selectOptions(screen.getByLabelText('Month'), ['1']);
    userEvent.selectOptions(screen.getByLabelText('Day'), ['25']);
    userEvent.type(screen.getByLabelText('Year'), '2003');
    userEvent.selectOptions(
      screen.getByLabelText('State where this happened', {
        exact: false,
      }),
      ['AL'],
    );
    userEvent.type(
      screen.getByLabelText('City where this happened', {
        exact: false,
      }),
      'Test city',
    );
    const submitBtn = screen.getByRole('button', {
      name: 'Submit VA Form 686c to remove this dependent',
    });
    userEvent.click(submitBtn);
    expect(screen.queryAllByRole('alert')).to.have.lengthOf(0);
  });
});
