import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { expect } from 'chai';
import sinon from 'sinon';
import { render, fireEvent, waitFor } from '@testing-library/react';

import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';

import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import { parseISO } from 'date-fns';
import getFixtureData, {
  FixtureDataType,
} from '../../../fixtures/vets-json-api/getFixtureData';
import getData from '../../../fixtures/mocks/mockStore';

import formConfig from '../../../../config/form';
import applicantInformation, {
  isOver65,
  setDefaultIsOver65,
} from '../../../../config/chapters/01-applicant-information/applicantInformation';
import {
  getWebComponentErrors,
  testNumberOfFieldsByType,
  testSubmitsWithoutErrors,
} from '../pageTests.spec';

const definitions = formConfig.defaultDefinitions;

const { schema, uiSchema } = applicantInformation;

describe('pension applicant information page', () => {
  const middleware = [];
  const mockStore = configureStore(middleware);
  it('should render with all alerts, fields and buttons', async () => {
    const onSubmit = sinon.spy();
    const { data } = getData({ loggedIn: true });
    const store = mockStore(data);
    const { container } = render(
      <Provider store={store}>
        <DefinitionTester
          definitions={definitions}
          schema={schema}
          uiSchema={uiSchema}
          data={{}}
          formData={{}}
          onSubmit={onSubmit}
        />
      </Provider>,
    );

    await waitFor(() => {
      expect($$('va-text-input', container).length).to.equal(5);
      expect($$('va-memorable-date', container).length).to.equal(1);
      expect($$('va-select', container).length).to.equal(1);
      expect($$('va-radio', container).length).to.equal(1);
      expect($('button[type="submit"]', container)).to.exist;
    });
  });
  testNumberOfFieldsByType(
    formConfig,
    schema,
    uiSchema,
    {
      'va-text-input': 5,
      'va-memorable-date': 1,
      'va-select': 1,
      'va-radio': 1,
    },
    'applicant information',
  );
  it('should not allow submit with errors', async () => {
    const onSubmit = sinon.spy();
    const { data } = getData({ loggedIn: true });
    const store = mockStore(data);

    const { container } = render(
      <Provider store={store}>
        <DefinitionTester
          definitions={definitions}
          schema={schema}
          uiSchema={uiSchema}
          data={{}}
          formData={{}}
          onSubmit={onSubmit}
        />
      </Provider>,
    );

    fireEvent.submit($('form', container));
    await waitFor(() => {
      expect(getWebComponentErrors(container).length).to.equal(4);
      expect(onSubmit.called).to.be.false;
    });
  });

  testSubmitsWithoutErrors(
    formConfig,
    schema,
    uiSchema,
    'applicant information',
    getFixtureData(FixtureDataType.OVERFLOW),
    { loggedIn: true },
  );

  describe('isOver65', () => {
    it('should return true if veteranDateOfBirth is over 65 years ago', () => {
      const over65 = isOver65(
        { veteranDateOfBirth: '1950-01-01' },
        parseISO('2020-01-01'),
      );
      expect(over65).to.be.true;
    });

    it('should return false if veteranDateOfBirth is under 65 years ago', () => {
      const over65 = isOver65(
        { veteranDateOfBirth: '2000-01-01' },
        parseISO('2020-01-01'),
      );
      expect(over65).to.be.false;
    });

    it('should return undefined if veteranDateOfBirth is invalid or null', () => {
      const over65 = isOver65(
        { veteranDateOfBirth: null },
        parseISO('2020-01-01'),
      );
      expect(over65).to.be.undefined;
    });
  });

  describe('setDefaultIsOver65', () => {
    it('should change nothing if veteranDateOfBirth is unchanged', () => {
      const formData = setDefaultIsOver65(
        { veteranDateOfBirth: '1950-01-01', isOver65: false },
        { veteranDateOfBirth: '1950-01-01', isOver65: false },
        parseISO('2020-01-01'),
      );
      expect(formData.isOver65).to.be.false;
    });

    it('should update isOver65 if veteranDateOfBirth changes', () => {
      const formData = setDefaultIsOver65(
        { veteranDateOfBirth: '2000-01-01', isOver65: false },
        { veteranDateOfBirth: '1950-01-01', isOver65: false },
        parseISO('2020-01-01'),
      );
      expect(formData.isOver65).to.be.true;
    });
  });
});
