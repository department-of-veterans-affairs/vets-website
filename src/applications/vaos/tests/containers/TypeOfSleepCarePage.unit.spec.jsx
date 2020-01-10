import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import { selectRadio } from 'platform/testing/unit/schemaform-utils.jsx';
import { TypeOfSleepCarePage } from '../../containers/TypeOfSleepCarePage';

describe('VAOS <TypeOfSleepCarePage>', () => {
  it('should render', () => {
    const openFormPage = sinon.spy();
    const updateFormData = sinon.spy();

    const form = mount(
      <TypeOfSleepCarePage
        openFormPage={openFormPage}
        updateFormData={updateFormData}
        data={{}}
      />,
    );

    expect(form.find('fieldset').length).to.equal(1);
    expect(form.find('input').length).to.equal(2);
    form.unmount();
  });

  it('should not submit empty form', () => {
    const openFormPage = sinon.spy();
    const router = {
      push: sinon.spy(),
    };

    const form = mount(
      <TypeOfSleepCarePage
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

  it('should call updateFormData after change', () => {
    const openFormPage = sinon.spy();
    const updateFormData = sinon.spy();
    const router = {
      push: sinon.spy(),
    };

    const form = mount(
      <TypeOfSleepCarePage
        openFormPage={openFormPage}
        updateFormData={updateFormData}
        router={router}
        data={{}}
      />,
    );

    selectRadio(form, 'root_typeOfSleepCareId', '349');

    expect(updateFormData.firstCall.args[2].typeOfSleepCareId).to.equal('349');
    form.unmount();
  });

  it('should submit with valid data', () => {
    const openFormPage = sinon.spy();
    const routeToNextAppointmentPage = sinon.spy();

    const form = mount(
      <TypeOfSleepCarePage
        openFormPage={openFormPage}
        routeToNextAppointmentPage={routeToNextAppointmentPage}
        data={{ typeOfSleepCareId: '349' }}
      />,
    );

    form.find('form').simulate('submit');

    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(routeToNextAppointmentPage.called).to.be.true;
    form.unmount();
  });

  it('should render label name', () => {
    const openFormPage = sinon.spy();
    const routeToNextAppointmentPage = sinon.spy();

    const form = mount(
      <TypeOfSleepCarePage
        openFormPage={openFormPage}
        routeToNextAppointmentPage={routeToNextAppointmentPage}
      />,
    );
    const labels = form.find(
      'span.vads-u-display--block.vads-u-font-size--lg.vads-u-font-weight--bold',
    );

    expect(labels.length).to.equal(2);
    expect(labels.at(0).text()).to.have.string(
      'Continuous Positive Airway Pressure (CPAP)',
    );
    expect(labels.at(1).text()).to.have.string(
      'Sleep medicine and home sleep testing',
    );
    form.unmount();
  });

  it('document title should match h1 text', () => {
    const openFormPage = sinon.spy();
    const updateFormData = sinon.spy();
    const pageTitle = 'Choose the type of sleep care you need';

    const form = mount(
      <TypeOfSleepCarePage
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
