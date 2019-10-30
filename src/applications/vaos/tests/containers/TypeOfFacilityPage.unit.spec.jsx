import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import { selectRadio } from 'platform/testing/unit/schemaform-utils.jsx';
import { TypeOfFacilityPage } from '../../containers/TypeOfFacilityPage';

describe('VAOS <TypeOfFacilityPage>', () => {
  it('should render', () => {
    const openFormPage = sinon.spy();
    const updateFormData = sinon.spy();
    const openTypeOfFacilityPage = sinon.spy();

    const form = mount(
      <TypeOfFacilityPage
        openFormPage={openFormPage}
        updateFormData={updateFormData}
        openTypeOfFacilityPage={openTypeOfFacilityPage}
        data={{}}
      />,
    );

    expect(form.find('input').length).to.equal(2);
    form.unmount();
  });

  it('should render loading indicator', () => {
    const openFormPage = sinon.spy();
    const updateFormData = sinon.spy();
    const openTypeOfFacilityPage = sinon.spy();

    const form = mount(
      <TypeOfFacilityPage
        openFormPage={openFormPage}
        updateFormData={updateFormData}
        openTypeOfFacilityPage={openTypeOfFacilityPage}
        data={{}}
        checkIfCCEnabled
      />,
    );
    expect(form.find('LoadingIndicator').exists()).to.be.true;
    form.unmount();
  });

  it('should not submit empty form', () => {
    const openFormPage = sinon.spy();
    const openTypeOfFacilityPage = sinon.spy();
    const router = {
      push: sinon.spy(),
    };

    const form = mount(
      <TypeOfFacilityPage
        openFormPage={openFormPage}
        openTypeOfFacilityPage={openTypeOfFacilityPage}
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
    const openTypeOfFacilityPage = sinon.spy();
    const router = {
      push: sinon.spy(),
    };

    const form = mount(
      <TypeOfFacilityPage
        openFormPage={openFormPage}
        updateFormData={updateFormData}
        openTypeOfFacilityPage={openTypeOfFacilityPage}
        router={router}
        data={{}}
      />,
    );

    selectRadio(form, 'root_facilityType', 'communityCare');

    expect(updateFormData.firstCall.args[2].facilityType).to.equal(
      'communityCare',
    );
    form.unmount();
  });

  it('should submit with valid data', () => {
    const openFormPage = sinon.spy();
    const routeToNextAppointmentPage = sinon.spy();
    const openTypeOfFacilityPage = sinon.spy();

    const form = mount(
      <TypeOfFacilityPage
        openFormPage={openFormPage}
        routeToNextAppointmentPage={routeToNextAppointmentPage}
        openTypeOfFacilityPage={openTypeOfFacilityPage}
        data={{ facilityType: 'communityCare' }}
      />,
    );

    form.find('form').simulate('submit');

    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(routeToNextAppointmentPage.called).to.be.true;
    form.unmount();
  });
});
