import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import ReactTestUtils from 'react-dom/test-utils';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';

import {
  DefinitionTester,
  submitForm,
} from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../config/form';

describe('CG veteranInformation', () => {
  it('should render veteran information page', () => {
    const onSubmit = sinon.spy();
    const {
      schema,
      uiSchema,
    } = formConfig.chapters.veteranChapter.pages.veteranInfoOne;
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        data={{}}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );
    const formDOM = findDOMNode(form);

    expect(formDOM.querySelectorAll('input, select').length).to.equal(9);

    expect(formDOM.querySelector('#root_veteranFullName_first')).not.to.be.null;
    expect(
      formDOM.querySelector('#root_veteranFullName_first').maxLength,
    ).to.equal(30);
    expect(formDOM.querySelector('#root_veteranFullName_middle')).not.to.be
      .null;
    expect(formDOM.querySelector('#root_veteranFullName_last')).not.to.be.null;
    expect(
      formDOM.querySelector('#root_veteranFullName_last').maxLength,
    ).to.equal(30);

    expect(formDOM.querySelector('#root_veteranSsnOrTin')).not.to.be.null;

    expect(formDOM.querySelector('#root_veteranDateOfBirthMonth')).not.to.be
      .null;
    expect(formDOM.querySelector('#root_veteranDateOfBirthDay')).not.to.be.null;
    expect(formDOM.querySelector('#root_veteranDateOfBirthYear')).not.to.be
      .null;

    expect(formDOM.querySelector('#root_veteranGender_0')).not.to.be.null;
    expect(formDOM.querySelector('#root_veteranGender_1')).not.to.be.null;

    submitForm(form);

    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(4);
    expect(onSubmit.called).to.be.false;
  });

  it('should render veteran contact page', () => {
    const onSubmit = sinon.spy();
    const {
      schema,
      uiSchema,
    } = formConfig.chapters.veteranChapter.pages.veteranInfoTwo;
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        data={{}}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );
    const formDOM = findDOMNode(form);

    expect(formDOM.querySelectorAll('input, select').length).to.equal(8);

    expect(formDOM.querySelector('#root_veteranAddress_street')).not.to.be.null;
    expect(
      formDOM.querySelector('#root_veteranAddress_street').maxLength,
    ).to.equal(50);
    expect(formDOM.querySelector('#root_veteranAddress_street2')).not.to.be
      .null;
    expect(
      formDOM.querySelector('#root_veteranAddress_street2').maxLength,
    ).to.equal(50);
    expect(formDOM.querySelector('#root_veteranAddress_city')).not.to.be.null;
    // expect(
    //   formDOM.querySelector('#root_veteranAddress_city').maxLength,
    // ).to.equal(40);
    expect(formDOM.querySelector('#root_veteranAddress_state')).not.to.be.null;

    expect(formDOM.querySelector('#root_veteranAddress_postalCode')).not.to.be
      .null;

    expect(formDOM.querySelector('#root_veteranPrimaryPhoneNumber')).not.to.be
      .null;
    expect(formDOM.querySelector('#root_veteranAlternativePhoneNumber')).not.to
      .be.null;

    expect(formDOM.querySelector('#root_veteranEmail')).not.to.be.null;
    // expect(formDOM.querySelector('#root_veteranEmail').maxLength).to.equal(256);

    submitForm(form);

    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(5);
    expect(onSubmit.called).to.be.false;
  });

  it('should render veteran medical center JSON page', () => {
    const onSubmit = sinon.spy();
    const {
      schema,
      uiSchema,
    } = formConfig.chapters.veteranChapter.pages.veteranInfoThreeJSON;
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        data={{ veteranLastTreatmentFacility: {} }}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );
    const formDOM = findDOMNode(form);

    expect(formDOM.querySelectorAll('input, select').length).to.equal(4);

    expect(formDOM.querySelector('#root_veteranLastTreatmentFacility_name')).not
      .to.be.null;
    expect(
      formDOM.querySelector('#root_veteranLastTreatmentFacility_name')
        .maxLength,
    ).to.equal(100);
    expect(formDOM.querySelector('#root_veteranLastTreatmentFacility_type')).not
      .to.be.null;
    expect(
      formDOM.querySelector(
        '#root_veteranPreferredFacility_veteranFacilityState',
      ),
    ).not.to.be.null;
    expect(
      formDOM.querySelector('#root_veteranPreferredFacility_plannedClinic'),
    ).not.to.be.null;

    submitForm(form);

    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(2);
    expect(onSubmit.called).to.be.false;
  });

  it('should render veteran medical center API page', () => {
    const middleware = [];
    const mockStore = configureStore(middleware);
    const veteran = {
      form: {
        data: {
          veteranPreferredFacility: { veteranFacilityState: '' },
        },
      },
    };
    const store = mockStore(veteran);
    const onSubmit = sinon.spy();
    const {
      schema,
      uiSchema,
    } = formConfig.chapters.veteranChapter.pages.veteranInfoThreeLighthouse;
    const view = render(
      <Provider store={store}>
        <DefinitionTester
          schema={schema}
          data={{
            veteranLastTreatmentFacility: {},
          }}
          definitions={formConfig.defaultDefinitions}
          onSubmit={onSubmit}
          uiSchema={uiSchema}
        />
      </Provider>,
    );

    expect(view.container.querySelectorAll('input').length).to.equal(1);
    expect(view.container.querySelectorAll('select').length).to.equal(2);
    expect(view.container.querySelectorAll('va-select').length).to.equal(1);

    fireEvent.click(
      view.container.querySelector('button[type=submit]', view.container),
    );

    // state
    expect(view.container.querySelectorAll('.usa-input-error').length).to.equal(
      1,
    );

    // va medical center
    // Zip code
    const vaCenterElement = view.container.querySelector(
      '#root_veteranPreferredFacility_plannedClinic',
      view.container,
    );
    expect(vaCenterElement.error).to.contain('Please provide a response');

    expect(onSubmit.called).to.be.false;
  });
});
