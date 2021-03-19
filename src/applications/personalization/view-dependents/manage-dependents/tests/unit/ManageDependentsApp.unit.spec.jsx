import React from 'react';
import { expect } from 'chai';
// import userEvent from '@testing-library/user-event';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import { removeDependents } from '../../redux/reducers';
import ManageDependentsApp from '../../containers/ManageDependentsApp';
import { SCHEMAS } from '../../schemas';

describe('<ManageDependentsApp />', () => {
  const mockData = {
    firstName: 'Cindy',
    lastName: 'See',
    ssn: '312-243-5634',
    dateOfBirth: '05-05-1953',
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
            dateOfBirth: mockData.dateOfBirth,
            ssn: mockData.ssn,
          },
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
});
