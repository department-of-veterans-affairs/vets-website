import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import { mockFetch, setFetchJSONResponse } from 'platform/testing/unit/helpers';

import { selectRadio } from 'platform/testing/unit/schemaform-utils.jsx';
import TypeOfCarePage, * as noRedux from '../../../../new-appointment/components/TypeOfCarePage';
import { TYPES_OF_CARE } from '../../../../utils/constants';
import {
  createTestStore,
  renderWithStoreAndRouter,
} from '../../../mocks/setup';
import { fireEvent } from '@testing-library/dom';

const initialSchema = {
  type: 'object',
  required: ['typeOfCareId'],
  properties: {
    typeOfCareId: {
      type: 'string',
      enum: TYPES_OF_CARE.map(care => care.id || care.ccId),
      enumNames: TYPES_OF_CARE.map(care => care.label || care.name),
    },
  },
};
describe('VAOS <TypeOfCarePage>', () => {
  it('should render', () => {
    const openTypeOfCarePage = sinon.spy();
    const updateFormData = sinon.spy();

    const form = mount(
      <noRedux.TypeOfCarePage
        openTypeOfCarePage={openTypeOfCarePage}
        updateFormData={updateFormData}
        schema={initialSchema}
        data={{}}
      />,
    );

    expect(form.find('fieldset').length).to.equal(1);
    form.unmount();
  });

  it('should not submit empty form', () => {
    const openTypeOfCarePage = sinon.spy();
    const history = {
      push: sinon.spy(),
    };

    const form = mount(
      <noRedux.TypeOfCarePage
        openTypeOfCarePage={openTypeOfCarePage}
        schema={initialSchema}
        history={history}
        data={{}}
      />,
    );

    form.find('form').simulate('submit');

    expect(form.find('.usa-input-error').length).to.equal(1);
    expect(history.push.called).to.be.false;
    form.unmount();
  });

  it('should call updateFormData after change', () => {
    mockFetch();
    setFetchJSONResponse(global.fetch, { data: [] });
    const openTypeOfCarePage = sinon.spy();
    const updateFormData = sinon.spy();
    const history = {
      push: sinon.spy(),
    };

    const form = mount(
      <noRedux.TypeOfCarePage
        openTypeOfCarePage={openTypeOfCarePage}
        updateFormData={updateFormData}
        schema={initialSchema}
        history={history}
        data={{}}
      />,
    );

    selectRadio(form, 'root_typeOfCareId', '323');

    expect(updateFormData.firstCall.args[2].typeOfCareId).to.equal('323');
    form.unmount();
    global.fetch.resetHistory();
  });

  it('should submit with valid data', () => {
    const openTypeOfCarePage = sinon.spy();
    const routeToNextAppointmentPage = sinon.spy();

    const form = mount(
      <noRedux.TypeOfCarePage
        openTypeOfCarePage={openTypeOfCarePage}
        schema={initialSchema}
        routeToNextAppointmentPage={routeToNextAppointmentPage}
        data={{ typeOfCareId: '323' }}
      />,
    );

    form.find('form').simulate('submit');

    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(routeToNextAppointmentPage.called).to.be.true;
    form.unmount();
  });

  it('document title should match h1 text', () => {
    const openTypeOfCarePage = sinon.spy();
    const updateFormData = sinon.spy();
    const pageTitle = 'Choose the type of care you need';

    const form = mount(
      <noRedux.TypeOfCarePage
        openTypeOfCarePage={openTypeOfCarePage}
        schema={initialSchema}
        updateFormData={updateFormData}
        data={{}}
      />,
    );
    expect(form.find('h1').text()).to.equal(pageTitle);
    expect(document.title).contain(pageTitle);
    form.unmount();
  });

  it('should display alert message when residental address is missing', () => {
    const openTypeOfCarePage = sinon.spy();
    const updateFormData = sinon.spy();

    const form = mount(
      <noRedux.TypeOfCarePage
        addressLine1={null}
        openTypeOfCarePage={openTypeOfCarePage}
        schema={initialSchema}
        updateFormData={updateFormData}
        data={{}}
      />,
    );
    expect(form.find('.usa-alert').exists()).to.be.true;
    expect(global.window.dataLayer[0].event).to.equal(
      'vaos-update-address-alert-displayed',
    );
    form.unmount();
  });

  it('should display alert message when residental address is a PO Box', () => {
    const openTypeOfCarePage = sinon.spy();
    const updateFormData = sinon.spy();

    const form = mount(
      <noRedux.TypeOfCarePage
        addressLine1="PO Box 123"
        openTypeOfCarePage={openTypeOfCarePage}
        schema={initialSchema}
        updateFormData={updateFormData}
        data={{}}
      />,
    );
    expect(form.find('.usa-alert').exists()).to.be.true;
    expect(global.window.dataLayer[0].event).to.equal(
      'vaos-update-address-alert-displayed',
    );
    form.unmount();
  });

  it('should NOT display alert message when residental address is non PO Box', () => {
    const openTypeOfCarePage = sinon.spy();
    const updateFormData = sinon.spy();

    const form = mount(
      <noRedux.TypeOfCarePage
        addressLine1="123 Sesame St"
        openTypeOfCarePage={openTypeOfCarePage}
        schema={initialSchema}
        updateFormData={updateFormData}
        data={{}}
      />,
    );
    expect(form.find('.usa-alert').exists()).to.be.false;
    expect(global.window.dataLayer.length).to.equal(0);
    form.unmount();
  });

  it('should NOT display alert message once user clicks the update address button using redux state', () => {
    const store = createTestStore({});

    const history = {
      push: sinon.spy(),
    };
    const { getByText, queryByText } = renderWithStoreAndRouter(
      <TypeOfCarePage history={history} />,
      { store },
    );
    expect(getByText(/You need to have a home address/i)).to.exist;
    expect(global.window.dataLayer[0].event).to.equal(
      'vaos-update-address-alert-displayed',
    );
    fireEvent.click(getByText('Update your address'));
    expect(global.window.dataLayer[1].event).to.equal(
      'nav-warning-alert-box-content-link-click',
    );
    expect(global.window.dataLayer[1].alertBoxHeading).to.equal(
      "You need to have a home address on file to use some of the tool's features",
    );
    expect(global.window.dataLayer[2].alertBoxHeading).to.equal(undefined);
    expect(queryByText(/You need to have a home address/i)).to.not.exist;
  });
});
