import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import { VAFacilityPage } from '../../containers/VAFacilityPage';

describe('VAOS <VAFacilityPage>', () => {
  it('should render', () => {
    const openFormPage = sinon.spy();
    const form = mount(<VAFacilityPage openFormPage={openFormPage} />);

    expect(form.find('input').length).to.equal(7);
    form.unmount();
  });

  it('should not submit empty form', () => {
    const openFormPage = sinon.spy();
    const routeToNextAppointmentPage = sinon.spy();

    const form = mount(
      <VAFacilityPage
        openFormPage={openFormPage}
        routeToNextAppointmentPage={routeToNextAppointmentPage}
      />,
    );

    form.find('form').simulate('submit');

    expect(form.find('.usa-input-error').length).to.equal(2);
    expect(routeToNextAppointmentPage.called).to.be.false;
    form.unmount();
  });

  it('should submit with valid data', () => {
    const openFormPage = sinon.spy();
    const routeToNextAppointmentPage = sinon.spy();

    const form = mount(
      <VAFacilityPage
        openFormPage={openFormPage}
        routeToNextAppointmentPage={routeToNextAppointmentPage}
        data={{
          vaSystem: 'DAYTSHR -Dayton VA Medical Center',
          vaFacility: 'DAYTSHR -Dayton VA Medical Center',
        }}
      />,
    );

    form.find('form').simulate('submit');

    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(routeToNextAppointmentPage.called).to.be.true;
    form.unmount();
  });
});
