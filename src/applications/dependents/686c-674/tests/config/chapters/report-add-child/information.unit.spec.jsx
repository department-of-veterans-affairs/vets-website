import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import React from 'react';
import createCommonStore from '@department-of-veterans-affairs/platform-startup/store';
import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../../../config/form';

const defaultStore = createCommonStore();

const formData = {
  'view:selectable686Options': {
    addChild: true,
  },
  childrenToAdd: [{}],
};

const noSsnFormData = {
  'view:selectable686Options': {
    addChild: true,
  },
  childrenToAdd: [
    {
      noSsn: true,
      noSsnReason: 'They can’t get an SSN based on their immigration status',
    },
  ],
  vaDependentsNoSsn: true,
};

describe('686 add child information', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.addChild.pages.addChildInformation;

  it('should render', () => {
    const form = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={formData}
          arrayPath="childrenToAdd"
          pagePerItemIndex={0}
        />
      </Provider>,
    );

    const formDOM = getFormDOM(form);
    expect(formDOM.querySelectorAll('va-text-input').length).to.eq(4);
  });
});
describe('686 add child information with no SSN', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.addChild.pages.addChildInformation;

  it('should render', () => {
    const form = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={noSsnFormData}
          arrayPath="childrenToAdd"
          pagePerItemIndex={0}
        />
      </Provider>,
    );

    const formDOM = getFormDOM(form);
    expect(formDOM.querySelectorAll('va-text-input').length).to.eq(3);
    expect(formDOM.querySelectorAll('va-radio').length).to.eq(1);
    expect(formDOM.querySelectorAll('va-radio-option').length).to.eq(2);
  });
});
