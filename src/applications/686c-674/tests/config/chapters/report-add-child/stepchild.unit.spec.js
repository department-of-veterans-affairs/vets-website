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
import { required } from '../../../../config/chapters/report-add-child/stepchild';

const defaultStore = createCommonStore();

const formData = {
  'view:selectable686Options': {
    addChild: true,
  },
  childrenToAdd: [{}],
};
describe('686 add child stepchild', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.addChild.pages.addChildStepchild;

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
    expect(formDOM.querySelectorAll('va-text-input').length).to.eq(3);
  });

  it('should use required function appropriately', () => {
    const newFormData = {
      childrenToAdd: [{ relationshipToChild: { stepchild: true } }],
    };
    expect(required(newFormData, 0)).to.eql(true);
    expect(required({ relationshipToChild: { stepchild: true } })).to.eql(true);
  });
});
