import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/dom';

import { ContactInfoPage } from '../../../new-appointment/components/ContactInfoPage';
import { renderWithStoreAndRouter } from '../../mocks/setup';

describe('VAOS <ContactInfoPage>', () => {
  it('should render', async () => {
    const openFormPage = sinon.spy();
    const updateFormData = sinon.spy();

    const screen = renderWithStoreAndRouter(
      <ContactInfoPage
        openFormPage={openFormPage}
        updateFormData={updateFormData}
        data={{}}
      />,
      {},
    );
    expect(await screen.findByText('Your contact information')).to.be.ok;
  });

  it('should not submit empty form', async () => {
    const openFormPage = sinon.spy();
    const history = {
      push: sinon.spy(),
    };

    const screen = renderWithStoreAndRouter(
      <ContactInfoPage
        openFormPage={openFormPage}
        history={history}
        data={{}}
      />,
      {},
    );

    const button = await screen.findByText(/^Continue/);
    userEvent.click(button);

    expect(screen.findByText(/^Please enter a phone number/)).to.be.ok;
    expect(screen.findByText(/^Please choose at least one option/)).to.be.ok;
    expect(screen.findByText(/^Please provide a response/)).to.be.ok;

    expect(history.push.called).to.be.false;
  });

  it('should call updateFormData after change', async () => {
    const openFormPage = sinon.spy();
    const updateFormData = sinon.spy();
    const history = {
      push: sinon.spy(),
    };

    renderWithStoreAndRouter(
      <ContactInfoPage
        openFormPage={openFormPage}
        updateFormData={updateFormData}
        history={history}
        data={{}}
      />,
      {},
    );

    const input = document.getElementById('root_phoneNumber');
    userEvent.type(input, '5555555555');

    await waitFor(() => {
      expect(updateFormData.callCount).to.equal(10);
    });
  });

  it('should submit with valid data', async () => {
    const openFormPage = sinon.spy();
    const routeToNextAppointmentPage = sinon.spy();

    const screen = renderWithStoreAndRouter(
      <ContactInfoPage
        openFormPage={openFormPage}
        routeToNextAppointmentPage={routeToNextAppointmentPage}
        data={{
          phoneNumber: '5555555555',
          email: 'fake@va.gov',
          bestTimeToCall: {
            morning: true,
          },
        }}
      />,
      {},
    );

    const button = await screen.findByText(/^Continue/);
    userEvent.click(button);

    expect(routeToNextAppointmentPage.called).to.be.true;
  });

  it('document title should match h1 text', async () => {
    const openFormPage = sinon.spy();
    const pageTitle = 'Your contact information';

    const screen = renderWithStoreAndRouter(
      <ContactInfoPage openFormPage={openFormPage} data={{}} />,
      {},
    );

    expect(await screen.findByRole('heading', { level: 1, name: pageTitle })).to
      .be.ok;
    expect(document.title).to.equal(`${pageTitle} | Veterans Affairs`);
  });
});
