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
  childrenToAdd: [
    {
      hasChildEverBeenMarried: true,
    },
  ],
};

describe('686 add child marriage end details', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.addChild.pages.addChildMarriageEndDetails;

  it('should render', () => {
    const screen = render(
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

    const formDOM = getFormDOM(screen);
    expect(formDOM.querySelectorAll('va-radio').length).to.eq(1);
    expect(formDOM.querySelectorAll('va-radio-option').length).to.eq(4);
    expect(formDOM.querySelectorAll('va-memorable-date').length).to.eq(1);
  });
});
