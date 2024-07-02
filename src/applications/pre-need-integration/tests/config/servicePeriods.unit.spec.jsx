import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import {
  DefinitionTester,
  fillDate,
} from 'platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../config/form';

const mockStore = configureMockStore();

const payload = {
  application: {
    claimant: {
      dateOfBirth: '2000-1-1', // This DOB should be before the service dates being tested
    },
    veteran: {
      serviceRecords: [
        {
          serviceBranch: 'AL',
          dateRange: {
            from: '2002-1-1',
            to: '2003-1-1',
          },
        },
      ],
    },
  },
};

const store = mockStore({
  form: {
    data: payload,
  },
});

describe('Pre-need service periods', () => {
  function servicePeriodsTests({ schema, uiSchema }, inputCount = 4) {
    it('should render', () => {
      const form = mount(
        <Provider store={store}>
          <DefinitionTester
            schema={schema}
            definitions={formConfig.defaultDefinitions}
            uiSchema={uiSchema}
          />
        </Provider>,
      );

      expect(form.find('input').length).to.equal(inputCount);
      expect(form.find('select').length).to.equal(5);
      form.unmount();
    });

    it('should not submit empty form', () => {
      const onSubmit = sinon.spy();
      const form = mount(
        <Provider store={store}>
          <DefinitionTester
            schema={schema}
            definitions={formConfig.defaultDefinitions}
            onSubmit={onSubmit}
            data={payload}
            uiSchema={uiSchema}
          />
        </Provider>,
      );

      form.find('form').simulate('submit');

      expect(form.find('.usa-input-error').length).to.equal(2);
      expect(onSubmit.called).to.be.false;
      form.unmount();
    });

    it.skip('should add another service period', () => {
      const onSubmit = sinon.spy();
      const form = mount(
        <Provider store={store}>
          <DefinitionTester
            schema={schema}
            definitions={formConfig.defaultDefinitions}
            onSubmit={onSubmit}
            data={payload}
            uiSchema={uiSchema}
          />
        </Provider>,
      );

      expect(form.find('input').length).to.equal(inputCount);
      expect(form.find('select').length).to.equal(5);

      form.find('.va-growable-add-btn').simulate('click');

      expect(
        form
          .find('.va-growable-background')
          .first()
          .text(),
      ).to.contain('Allied Forces');
      form.unmount();
    });

    it('should submit with valid data', () => {
      const onSubmit = sinon.spy();
      const form = mount(
        <Provider store={store}>
          <DefinitionTester
            schema={schema}
            definitions={formConfig.defaultDefinitions}
            onSubmit={onSubmit}
            data={payload}
            uiSchema={uiSchema}
          />
        </Provider>,
      );

      fillDate(
        form,
        'root_application_veteran_serviceRecords_0_dateRange_from',
        '2002-1-1',
      );
      fillDate(
        form,
        'root_application_veteran_serviceRecords_0_dateRange_to',
        '2003-1-1',
      );

      form.find('form').simulate('submit');

      expect(form.find('.usa-input-error').length).to.equal(0);
      expect(onSubmit.called).to.be.true;
      form.unmount();
    });
  }

  const { sponsorMilitaryHistory } = formConfig.chapters.militaryHistory.pages;
  const {
    applicantMilitaryHistorySelf,
  } = formConfig.chapters.militaryHistory.pages;

  describe('sponsor', () => {
    servicePeriodsTests(sponsorMilitaryHistory);
  });

  describe('applicant', () => {
    servicePeriodsTests(applicantMilitaryHistorySelf);
  });
});
