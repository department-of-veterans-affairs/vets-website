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
    addSpouse: true,
  },
};
describe('686 current marriage information: Veteran previous marriage additional information view', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.addSpouse.pages.veteranAdditionalQuestionsView;

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
      queryByText(/Now we’ll ask you about each of your former marriages./i),
    ).to.not.be.null;
  });
});
