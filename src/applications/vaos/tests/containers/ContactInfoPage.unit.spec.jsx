import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import { fillData } from 'platform/testing/unit/schemaform-utils.jsx';
import { ContactInfoPage } from '../../containers/ContactInfoPage';

describe('VAOS <ContactInfoPage>', () => {
  it('should render', () => {
    const openFormPage = sinon.spy();
    const updateFormData = sinon.spy();

    const form = mount(
      <ContactInfoPage
        openFormPage={openFormPage}
        updateFormData={updateFormData}
        data={{}}
      />,
    );

    expect(form.find('input').length).to.equal(5);
    form.unmount();
  });

  it('should not submit empty form', () => {
    const openFormPage = sinon.spy();
    const router = {
      push: sinon.spy(),
    };

    const form = mount(
      <ContactInfoPage openFormPage={openFormPage} router={router} data={{}} />,
    );

    form.find('form').simulate('submit');

    expect(form.find('.usa-input-error').length).to.equal(3);
    expect(router.push.called).to.be.false;
    form.unmount();
  });

  it('should call updateFormData after change', () => {
    const openFormPage = sinon.spy();
    const updateFormData = sinon.spy();
    const router = {
      push: sinon.spy(),
    };

    const form = mount(
      <ContactInfoPage
        openFormPage={openFormPage}
        updateFormData={updateFormData}
        router={router}
        data={{}}
      />,
    );

    fillData(form, 'input#root_phoneNumber', '5555555555');

    expect(updateFormData.firstCall.args[2].phoneNumber).to.equal('5555555555');
    form.unmount();
  });

  it('should submit with valid data', () => {
    const openFormPage = sinon.spy();
    const routeToNextAppointmentPage = sinon.spy();

    const form = mount(
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
    );

    form.find('form').simulate('submit');

    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(routeToNextAppointmentPage.called).to.be.true;
    form.unmount();
  });

  it('document title should match h1 text', () => {
    const openFormPage = sinon.spy();
    const pageTitle = 'Your contact information';

    const form = mount(
      <ContactInfoPage openFormPage={openFormPage} data={{}} />,
    );

    expect(form.find('h1').text()).to.equal(pageTitle);
    expect(document.title).contain(pageTitle);
    form.unmount();
  });
});
