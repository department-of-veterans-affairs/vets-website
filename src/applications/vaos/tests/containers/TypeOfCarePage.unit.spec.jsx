import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import {
  resetFetch,
  mockFetch,
  setFetchJSONResponse,
} from 'platform/testing/unit/helpers';

import { selectRadio } from 'platform/testing/unit/schemaform-utils.jsx';
import { TypeOfCarePage } from '../../containers/TypeOfCarePage';

describe('VAOS <TypeOfCarePage>', () => {
  it('should render', () => {
    const openFormPage = sinon.spy();
    const updateFormData = sinon.spy();

    const form = mount(
      <TypeOfCarePage
        openFormPage={openFormPage}
        updateFormData={updateFormData}
        data={{}}
      />,
    );

    expect(form.find('fieldset').length).to.equal(3);
    expect(form.find('input').length).to.equal(12);
    form.unmount();
  });

  it('should not submit empty form', () => {
    const openFormPage = sinon.spy();
    const router = {
      push: sinon.spy(),
    };

    const form = mount(
      <TypeOfCarePage openFormPage={openFormPage} router={router} data={{}} />,
    );

    form.find('form').simulate('submit');

    expect(form.find('.usa-input-error').length).to.equal(1);
    expect(router.push.called).to.be.false;
    form.unmount();
  });

  it('should call updateFormData after change', () => {
    mockFetch();
    setFetchJSONResponse(global.fetch, { data: [] });
    const openFormPage = sinon.spy();
    const updateFormData = sinon.spy();
    const router = {
      push: sinon.spy(),
    };

    const form = mount(
      <TypeOfCarePage
        openFormPage={openFormPage}
        updateFormData={updateFormData}
        router={router}
        data={{}}
      />,
    );

    selectRadio(form, 'root_typeOfCareId', '323');

    expect(updateFormData.firstCall.args[2].typeOfCareId).to.equal('323');
    form.unmount();
    resetFetch();
  });

  it('should submit with valid data', () => {
    const openFormPage = sinon.spy();
    const routeToNextAppointmentPage = sinon.spy();

    const form = mount(
      <TypeOfCarePage
        openFormPage={openFormPage}
        routeToNextAppointmentPage={routeToNextAppointmentPage}
        data={{ typeOfCareId: '323' }}
      />,
    );

    form.find('form').simulate('submit');

    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(routeToNextAppointmentPage.called).to.be.true;
    form.unmount();
  });
});
