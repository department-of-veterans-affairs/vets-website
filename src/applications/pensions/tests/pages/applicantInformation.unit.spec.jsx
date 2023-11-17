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

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';

import formConfig from '../../config/form';
import applicantInformation from '../../pages/applicantInformation';

const definitions = formConfig.defaultDefinitions;

const { schema, uiSchema } = applicantInformation;

const getData = ({
  loggedIn = true,
  savedForms = [],
  formData = {},
  contestableIssues = { status: '' },
  routerPush = () => {},
} = {}) => ({
  props: {
    loggedIn,
    location: {},
    router: { push: routerPush },
  },
  data: {
    user: {
      login: {
        currentlyLoggedIn: loggedIn,
      },
      profile: {
        savedForms,
        prefillsAvailable: [],
        verified: true,
      },
    },
    form: {
      loadedStatus: 'success',
      savedStatus: '',
      loadedData: {
        metadata: {},
      },
      data: formData,
    },
    contestableIssues,
  },
});

describe('pension applicant information page', () => {
  const middleware = [];
  const mockStore = configureStore(middleware);
  it('should render with all alerts, fields and buttons', async () => {
    const onSubmit = sinon.spy();
    const { data } = getData({ loggedIn: false });
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

    waitFor(() => {
      expect($$('va-alert', container).length).to.equal(1);
      expect($$('input', container).length).to.equal(5);
      expect($$('select', container).length).to.equal(3);
      expect($$('va-radio', container).length).to.equal(1);
      expect($('button[type="submit"]', container)).to.exist;
    });
  });
  it('should not allow submit with errors', async () => {
    const onSubmit = sinon.spy();
    const { data } = getData({ loggedIn: false });
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
    waitFor(() => {
      expect($('.usa-input-error', container).length).to.equal(4);
      expect(onSubmit.called).to.be.false;
    });
  });
  it('should submit with no errors with all required fields filled in', async () => {
    const { data } = getData({ loggedIn: false });
    const { queryByText, queryByRole, container } = render(
      <Provider store={mockStore(data)}>
        <DefinitionTester
          schema={schema}
          data={{}}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
        />
      </Provider>,
    );
    const submitBtn = queryByText('Submit');
    const firstName = queryByRole('textbox', {
      name: /Your first name/i,
    });
    const lastName = queryByRole('textbox', {
      name: /Your last name/i,
    });
    const ssnInput = queryByRole('textbox', {
      name: /Social Security Number/i,
    });
    const birthMonth = container.querySelector('#root_veteranDateOfBirthMonth');
    const birthDay = container.querySelector('#root_veteranDateOfBirthDay');
    const birthYear = container.querySelector('#root_veteranDateOfBirthYear');

    fireEvent.click(submitBtn);
    waitFor(() => {
      expect($$('.usa-input-error-message', container)).not.to.be.empty;

      fireEvent.change(firstName, { target: { value: 'Jon' } });
      fireEvent.change(lastName, { target: { value: 'Snow' } });
      fireEvent.change(ssnInput, { target: { value: '134445555' } });
      fireEvent.change(birthMonth, { target: { value: '2' } });
      fireEvent.change(birthDay, { target: { value: '15' } });
      fireEvent.change(birthYear, { target: { value: '1960' } });
      fireEvent.click(submitBtn);

      expect($$('.usa-input-error-message', container)).to.be.empty;
    });
  });
  it('should reveal va file number', async () => {
    const onSubmit = sinon.spy();
    const { data } = getData({ loggedIn: false });
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
    waitFor(() => {
      // Verify va file number is not visible
      expect($$('input', container).length).to.equal(5);

      const changeEvent = new CustomEvent('selected', {
        detail: { value: 'Y' },
      });
      $('va-radio', container).__events.vaValueChange(changeEvent);

      expect($$('va-radio-option', container).length).to.eq(2);
      // Verify va file number is now visible
      expect($$('input', container).length).to.equal(6);
    });
  });
});
