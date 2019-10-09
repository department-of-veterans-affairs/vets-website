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
  const defaultData = {};

  it('should render loading', () => {
    const openFormPage = sinon.spy();
    const form = shallow(
      <VAFacilityPage
        loadingSystems
        data={defaultData}
        openFacilityPage={openFormPage}
      />,
    );

    expect(form.find('LoadingIndicator').exists()).to.be.true;
    expect(form.find('SchemaForm').exists()).to.be.false;
    form.unmount();
  });

  it('should render no systems message', () => {
    const openFormPage = sinon.spy();
    const form = shallow(
      <VAFacilityPage
        data={defaultData}
        noValidVASystems
        openFacilityPage={openFormPage}
      />,
    );

    expect(form.find('NoVASystems').exists()).to.be.true;
    expect(form.find('SchemaForm').exists()).to.be.false;
    form.unmount();
  });

  it('should render single facility message', () => {
    const openFormPage = sinon.spy();
    const form = shallow(
      <VAFacilityPage
        singleValidVALocation
        data={{}}
        openFacilityPage={openFormPage}
      />,
    );

    expect(form.find('VAFacilityInfoMessage').exists()).to.be.true;
    expect(form.find('SchemaForm').exists()).to.be.false;
    form.unmount();
  });

  it('should render form with facility loading message', () => {
    const openFormPage = sinon.spy();
    const schema = {
      type: 'object',
      properties: {
        vaFacilityLoading: { type: 'string' },
      },
    };

    const form = mount(
      <VAFacilityPage
        data={{ vaSystem: '123' }}
        loadingFacilities
        schema={schema}
        openFacilityPage={openFormPage}
      />,
    );

    expect(form.find('input').length).to.equal(0);
    expect(form.find('.loading-indicator').exists()).to.be.true;
    form.unmount();
  });

  it('should render form with no facility message', () => {
    const openFormPage = sinon.spy();
    const schema = {
      type: 'object',
      properties: {
        vaFacilityMessage: { type: 'string' },
      },
    };

    const form = mount(
      <VAFacilityPage
        data={{ vaSystem: '123' }}
        noValidVASystems
        schema={schema}
        openFacilityPage={openFormPage}
      />,
    );

    expect(form.find('input').length).to.equal(0);
    expect(form.find('.usa-alert').exists()).to.be.true;
    form.unmount();
  });

  it('should render form', () => {
    const openFormPage = sinon.spy();
    const form = mount(
      <VAFacilityPage
        data={{}}
        schema={defaultSchema}
        openFacilityPage={openFormPage}
      />,
    );

    expect(form.find('input').length).to.equal(3);
    form.unmount();
  });

  it('should not submit empty form', () => {
    const openFormPage = sinon.spy();
    const routeToNextAppointmentPage = sinon.spy();

    const form = mount(
      <VAFacilityPage
        data={{}}
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
        canScheduleAtChosenFacility
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

  it('should not continue if not eligible', () => {
    const openFormPage = sinon.spy();
    const routeToNextAppointmentPage = sinon.spy();

    const form = mount(
      <VAFacilityPage
        eligibility={{}}
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

    expect(form.find('button[type="submit"]').props().disabled).to.be.true;
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(form.find('.usa-alert').exists()).to.be.true;
    form.unmount();
  });
});
