import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import React from 'react';
import createCommonStore from '@department-of-veterans-affairs/platform-startup/store';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../../../config/form';

const defaultStore = createCommonStore();

const formData = {
  'view:selectable686Options': {
    addChild: true,
  },
};
describe('686 add child introduction', () => {
  const { schema, uiSchema } = formConfig.chapters.addChild.pages.addChildIntro;

  it('should render', () => {
    const { queryByText } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={formData}
        />
      </Provider>,
    );

    expect(
      queryByText(
        /In the next few questions, we’ll ask you about your children. You must add at least one child./i,
      ),
    ).to.not.be.null;
  });
});
