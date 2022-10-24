import React from 'react';
import { Provider } from 'react-redux';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import sinon from 'sinon';
import ReactTestUtils from 'react-dom/test-utils';

import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import {
  DefinitionTester,
  submitForm,
} from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../config/form';
import {
  idFormSchema as schema,
  idFormUiSchema as uiSchema,
} from '../../definitions/idForm';
import IDPage from '../../containers/IDPage';

describe('Hca IDPage', () => {
  const mockStore = {
    getState: () => ({
      hcaEnrollmentStatus: {
        enrollmentStatus: '',
        isLoading: false,
        isUserInMVI: false,
        loginRequired: false,
        noESRRecordFound: false,
        hasServerError: false,
      },
      user: {
        login: {},
      },
    }),
    subscribe: () => {},
  };

  let view;
  beforeEach(() => {
    view = render(
      <Provider store={mockStore}>
        <IDPage />
      </Provider>,
    );
  });

  it('should render', () => {
    expect(view.container.textContent).to.contain(
      'We need some information before you can start your application',
    );
    expect($('form', view.container)).to.exist;
  });

  it('should show button to Sign in to start your application', () => {
    expect($$('button', view.container)[0].textContent).to.contain(
      'Sign in to start your application.',
    );
  });

  it('should show button to Continue to the application', () => {
    expect($$('button', view.container)[1].textContent).to.contain(
      'Continue to the application',
    );
  });
});

describe('Hca IDPage Form', () => {
  let form;
  let formDOM;
  const definitions = formConfig.defaultDefinitions;
  beforeEach(() => {
    form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        data={{}}
        uiSchema={uiSchema}
        definitions={definitions}
      />,
    );
    formDOM = findDOMNode(form);
  });

  it('should render the form', () => {
    expect(formDOM.querySelectorAll('input').length).to.equal(4);
    expect(formDOM.querySelectorAll('select').length).to.equal(2);
  });

  it('should not submit the form without data', () => {
    const onSubmit = sinon.spy();
    submitForm(form);
    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(4);
    expect(onSubmit.called).to.be.false;
  });
});
