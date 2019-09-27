import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount, shallow } from 'enzyme';

import { VAFacilityPage } from '../../containers/VAFacilityPage';

describe('VAOS <VAFacilityPage>', () => {
  const defaultSchema = {
    type: 'object',
    required: ['vaSystem', 'vaFacility'],
    properties: {
      vaSystem: {
        type: 'string',
        enum: ['983'],
      },
      vaFacility: {
        type: 'string',
        enum: ['983', '983GB'],
      },
    },
  };

  it('should render loading', () => {
    const openFormPage = sinon.spy();
    const form = shallow(
      <VAFacilityPage loadingSystems openFacilityPage={openFormPage} />,
    );

    expect(form.find('LoadingIndicator').exists()).to.be.true;
    expect(form.find('SchemaForm').exists()).to.be.false;
    form.unmount();
  });

  it('should render', () => {
    const openFormPage = sinon.spy();
    const form = mount(
      <VAFacilityPage schema={defaultSchema} openFacilityPage={openFormPage} />,
    );

    expect(form.find('input').length).to.equal(3);
    form.unmount();
  });

  it('should not submit empty form', () => {
    const openFormPage = sinon.spy();
    const routeToNextAppointmentPage = sinon.spy();

    const form = mount(
      <VAFacilityPage
        schema={defaultSchema}
        openFacilityPage={openFormPage}
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
        schema={defaultSchema}
        openFacilityPage={openFormPage}
        routeToNextAppointmentPage={routeToNextAppointmentPage}
        data={{
          vaSystem: '983',
          vaFacility: '983',
        }}
      />,
    );

    form.find('form').simulate('submit');

    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(routeToNextAppointmentPage.called).to.be.true;
    form.unmount();
  });
});
