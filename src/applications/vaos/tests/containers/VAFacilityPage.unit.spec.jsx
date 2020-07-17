import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount, shallow } from 'enzyme';

import { VAFacilityPage } from '../../containers/VAFacilityPage';

describe('VAOS <VAFacilityPage>', () => {
  const defaultSchema = {
    type: 'object',
    required: ['vaParent', 'vaFacility'],
    properties: {
      vaParent: {
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
        loadingParentFacilities
        data={defaultData}
        openFacilityPage={openFormPage}
        cernerFacilities={[]}
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
        noValidVAParentFacilities
        openFacilityPage={openFormPage}
        cernerFacilities={[]}
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
        cernerFacilities={[]}
      />,
    );

    expect(form.find('VAFacilityInfoMessage').exists()).to.be.true;
    expect(form.find('SchemaForm').exists()).to.be.false;
    form.unmount();
  });

  it('should go forward from single facility view', () => {
    const openFormPage = sinon.spy();
    const routeToNextAppointmentPage = sinon.spy();
    const form = shallow(
      <VAFacilityPage
        routeToNextAppointmentPage={routeToNextAppointmentPage}
        singleValidVALocation
        data={{}}
        openFacilityPage={openFormPage}
        cernerFacilities={[]}
      />,
    );

    expect(form.find('VAFacilityInfoMessage').exists()).to.be.true;
    form
      .find('FormButtons')
      .props()
      .onSubmit();
    expect(routeToNextAppointmentPage.called).to.be.true;
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
        data={{ vaParent: '123' }}
        loadingFacilities
        schema={schema}
        openFacilityPage={openFormPage}
        cernerFacilities={[]}
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
        data={{ vaParent: '123' }}
        noValidVAParentFacilities
        schema={schema}
        openFacilityPage={openFormPage}
        cernerFacilities={[]}
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
        cernerFacilities={[]}
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
        cernerFacilities={[]}
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
          vaParent: '983',
          vaFacility: '983',
        }}
        cernerFacilities={[]}
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
        parentOfChosenFacility="983"
        routeToNextAppointmentPage={routeToNextAppointmentPage}
        data={{
          vaParent: '983',
          vaFacility: '983',
        }}
        cernerFacilities={[]}
      />,
    );

    expect(form.find('input').length).to.not.equal(0);
    expect(form.find('button[type="submit"]').props().disabled).to.be.true;
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(form.find('.usa-alert').exists()).to.be.true;
    form.unmount();
  });

  it('should display message if one facility not eligible', () => {
    const openFormPage = sinon.spy();
    const routeToNextAppointmentPage = sinon.spy();

    const form = mount(
      <VAFacilityPage
        eligibility={{}}
        singleValidVALocation
        schema={defaultSchema}
        openFacilityPage={openFormPage}
        facility={{ address: {} }}
        parentOfChosenFacility="983"
        routeToNextAppointmentPage={routeToNextAppointmentPage}
        data={{
          vaParent: '983',
          vaFacility: '983',
        }}
        cernerFacilities={[]}
      />,
    );

    expect(form.find('button[type="submit"]').props().disabled).to.be.true;
    expect(form.find('input').length).to.equal(0);
    expect(form.find('.usa-alert').exists()).to.be.true;
    form.unmount();
  });

  it('document title should match h1 text', () => {
    const openFormPage = sinon.spy();
    const pageTitle = 'Choose a VA location for your appointment';

    const form = mount(
      <VAFacilityPage
        data={{}}
        schema={defaultSchema}
        openFacilityPage={openFormPage}
        cernerFacilities={[]}
      />,
    );

    expect(form.find('h1').text()).to.equal(pageTitle);
    expect(document.title).contain(pageTitle);
    form.unmount();
  });

  it('should render data fetching error', () => {
    const openFormPage = sinon.spy();
    const form = shallow(
      <VAFacilityPage
        data={defaultData}
        hasDataFetchingError
        openFacilityPage={openFormPage}
        cernerFacilities={[]}
      />,
    );

    expect(form.find('LoadingIndicator').exists()).to.be.false;
    expect(form.find('SchemaForm').exists()).to.be.false;
    expect(form.find('ErrorMessage').exists()).to.be.true;
    form.unmount();
  });

  it('should render eligibility error', () => {
    const openFormPage = sinon.spy();
    const form = shallow(
      <VAFacilityPage
        data={defaultData}
        schema={defaultSchema}
        hasEligibilityError
        openFacilityPage={openFormPage}
        cernerFacilities={[]}
      />,
    );

    expect(form.find('LoadingIndicator').exists()).to.be.false;
    expect(form.find('SchemaForm').exists()).to.be.true;
    expect(form.find('ErrorMessage').exists()).to.be.true;
    form.unmount();
  });
});
