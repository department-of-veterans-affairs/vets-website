import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import { selectRadio } from 'platform/testing/unit/schemaform-utils.jsx';
import { ClinicChoicePage } from '../../containers/ClinicChoicePage';
import { FETCH_STATUS } from '../../utils/constants';

describe('VAOS <ClinicChoicePage>', () => {
  const defaultProps = {
    schema: {
      type: 'object',
      properties: {
        clinicId: {
          type: 'string',
          enum: ['455', 'NONE'],
          enumNames: ['Yes', 'No'],
        },
      },
    },
    uiSchema: {},
    typeOfCare: { name: 'Primary care' },
    clinics: [
      {
        clinicId: '455',
        clinicFriendlyLocationName: 'Friendly name',
      },
    ],
    data: {},
  };
  it('should render loading', () => {
    const openClinicPage = sinon.spy();
    const updateFormData = sinon.spy();

    const form = mount(
      <ClinicChoicePage
        openClinicPage={openClinicPage}
        updateFormData={updateFormData}
        facilityDetailsStatus={FETCH_STATUS.loading}
        data={{}}
      />,
    );

    expect(form.find('LoadingIndicator').exists()).to.be.true;
    form.unmount();
  });

  it('should render single clinic', () => {
    const openClinicPage = sinon.spy();
    const updateFormData = sinon.spy();

    const form = mount(
      <ClinicChoicePage
        openClinicPage={openClinicPage}
        updateFormData={updateFormData}
        {...defaultProps}
      />,
    );

    expect(form.find('input').length).to.equal(2);
    expect(form.find('h1').text()).to.equal(
      'Make a primary care appointment at your last clinic',
    );
    expect(form.text()).to.contain(
      'Your last primary care appointment was at Friendly name',
    );
    form.unmount();
  });

  it('should render multi clinic', () => {
    const openClinicPage = sinon.spy();
    const updateFormData = sinon.spy();

    const form = mount(
      <ClinicChoicePage
        openClinicPage={openClinicPage}
        updateFormData={updateFormData}
        {...defaultProps}
        schema={{
          type: 'object',
          properties: {
            clinicId: {
              type: 'string',
              enum: ['455', '456', 'NONE'],
              enumNames: ['Testing', 'Testing2', 'No'],
            },
          },
        }}
      />,
    );

    expect(form.find('input').length).to.equal(3);
    expect(form.find('h1').text()).to.equal(
      'Select your VA clinic for your primary care appointment',
    );
    expect(form.text()).to.contain(
      'In the last 24 months you have had primary care appointments in the following clinics, located at',
    );
    form.unmount();
  });

  it('should call updateFormData after change', () => {
    const openClinicPage = sinon.spy();
    const routeToNextAppointmentPage = sinon.spy();
    const updateFormData = sinon.spy();

    const form = mount(
      <ClinicChoicePage
        openClinicPage={openClinicPage}
        updateFormData={updateFormData}
        routeToNextAppointmentPage={routeToNextAppointmentPage}
        {...defaultProps}
      />,
    );

    selectRadio(form, 'root_clinicId', '455');

    expect(updateFormData.firstCall.args[2].clinicId).to.equal('455');
    form.unmount();
  });

  it('should submit with valid data', () => {
    const openClinicPage = sinon.spy();
    const routeToNextAppointmentPage = sinon.spy();

    const form = mount(
      <ClinicChoicePage
        openClinicPage={openClinicPage}
        {...defaultProps}
        routeToNextAppointmentPage={routeToNextAppointmentPage}
        data={{ clinicId: '455' }}
      />,
    );

    form.find('form').simulate('submit');

    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(routeToNextAppointmentPage.called).to.be.true;
    form.unmount();
  });
});
