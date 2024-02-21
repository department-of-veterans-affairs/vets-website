import React from 'react';
import { expect } from 'chai';
import userEvent from '@testing-library/user-event';
import Sinon from 'sinon';
import { createTestStore, renderWithStoreAndRouter } from '../../mocks/setup';
import ScheduleCernerPage from '../../../new-appointment/components/ScheduleCernerPage';
import { Facility } from '../../mocks/unit-test-helpers';

describe('VAOS Page: ScheduleCernerPage', () => {
  const initialState = {
    newAppointment: {
      data: {
        typeOfCareId: '323',
        vaFacility: '983',
      },
      facilities: {
        '323': [new Facility('983')],
      },
    },
  };
  const sandbox = Sinon.createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  it('should show Cerner facility information', async () => {
    // Arrange
    const store = createTestStore(initialState);
    const dispatchStub = sandbox.stub(store, 'dispatch');

    // Act
    const screen = renderWithStoreAndRouter(<ScheduleCernerPage />, {
      store,
    });

    // Assert
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'How to schedule',
      }),
    ).to.be.ok;
    expect(
      screen.getByText(
        /To schedule an appointment online at this facility, go to/i,
      ),
    ).to.be.ok;
    expect(screen.getByRole('link', { name: /My VA Health/i })).to.be.ok;
    expect(screen.getByRole('button', { name: /Continue/i })).to.have.attribute(
      'disabled',
    );
    const button = screen.getByRole('button', { name: /Back/i });
    userEvent.click(button);

    Sinon.assert.calledOnce(dispatchStub);
  });
});
