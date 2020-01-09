import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import { selectRadio } from 'platform/testing/unit/schemaform-utils.jsx';
import { TypeOfVisitPage } from '../../containers/TypeOfVisitPage';

describe('VAOS <TypeOfVisitPage>', () => {
  it('should render', () => {
    const openFormPage = sinon.spy();
    const updateFormData = sinon.spy();

    const form = mount(
      <TypeOfVisitPage
        openFormPage={openFormPage}
        updateFormData={updateFormData}
        data={{}}
      />,
    );

    expect(form.find('input').length).to.equal(3);
    form.unmount();
  });

  it('should not submit empty form', () => {
    const openFormPage = sinon.spy();
    const router = {
      push: sinon.spy(),
    };

    const form = mount(
      <TypeOfVisitPage openFormPage={openFormPage} router={router} data={{}} />,
    );

    form.find('form').simulate('submit');

    expect(form.find('.usa-input-error').length).to.equal(1);
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
      <TypeOfVisitPage
        openFormPage={openFormPage}
        updateFormData={updateFormData}
        router={router}
        data={{}}
      />,
    );

    selectRadio(form, 'root_visitType', 'phone');

    expect(updateFormData.firstCall.args[2].visitType).to.equal('phone');
    form.unmount();
  });

  it('should submit with valid data', () => {
    const openFormPage = sinon.spy();
    const routeToNextAppointmentPage = sinon.spy();

    const form = mount(
      <TypeOfVisitPage
        openFormPage={openFormPage}
        routeToNextAppointmentPage={routeToNextAppointmentPage}
        data={{ visitType: 'telehealth' }}
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
    const pageTitle = 'Choose a type of appointment';

    const form = mount(
      <TypeOfVisitPage
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
