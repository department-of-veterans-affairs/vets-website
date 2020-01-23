import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import { PreferredDatePage } from '../../containers/PreferredDatePage';

describe('VAOS <PreferredDatePage>', () => {
  it('should render', () => {
    const openFormPage = sinon.spy();
    const updateFormData = sinon.spy();

    const form = mount(
      <PreferredDatePage
        openFormPage={openFormPage}
        updateFormData={updateFormData}
        data={{}}
      />,
    );

    expect(form.find('DateWidget').length).to.equal(1);
    form.unmount();
  });

  it('should not submit empty form', () => {
    const openFormPage = sinon.spy();
    const router = {
      push: sinon.spy(),
    };

    const form = mount(
      <PreferredDatePage
        openFormPage={openFormPage}
        router={router}
        data={{}}
      />,
    );

    form.find('form').simulate('submit');

    expect(form.find('.usa-input-error').length).to.equal(1);
    expect(router.push.called).to.be.false;
    form.unmount();
  });

  it('it should not submit with past date', () => {
    const openFormPage = sinon.spy();
    const updateFormData = sinon.spy();
    const router = {
      push: sinon.spy(),
    };

    const form = mount(
      <PreferredDatePage
        openFormPage={openFormPage}
        updateFormData={updateFormData}
        router={router}
        data={{ preferredDate: '2016-02-02' }}
      />,
    );

    form.find('form').simulate('submit');

    expect(form.find('.usa-input-error').length).to.equal(1);
    expect(router.push.called).to.be.false;
    form.unmount();
  });

  it('should submit with valid data', () => {
    const openFormPage = sinon.spy();
    const routeToNextAppointmentPage = sinon.spy();

    const form = mount(
      <PreferredDatePage
        openFormPage={openFormPage}
        routeToNextAppointmentPage={routeToNextAppointmentPage}
        data={{ preferredDate: '2050-02-02' }}
      />,
    );

    form.find('form').simulate('submit');

    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(routeToNextAppointmentPage.called).to.be.true;
    form.unmount();
  });

  it('document title should match h1 text', () => {
    const openFormPage = sinon.spy();
    const updateFormData = sinon.spy();
    const pageTitle = 'Tell us when you want to schedule your appointment';

    const form = mount(
      <PreferredDatePage
        openFormPage={openFormPage}
        updateFormData={updateFormData}
        data={{}}
      />,
    );

    expect(form.find('h1').text()).to.equal(pageTitle);
    expect(document.title).contain(pageTitle);
    form.unmount();
  });
});
