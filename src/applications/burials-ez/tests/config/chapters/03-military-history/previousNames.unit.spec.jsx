import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import React from 'react';
import createCommonStore from '@department-of-veterans-affairs/platform-startup/store';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';
import { PreviousNamesView } from '../../../../config/chapters/03-military-history/previousNames';
import formConfig from '../../../../config/form';

describe('Previous Names', () => {
  const defaultStore = createCommonStore();
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.militaryHistory.pages.previousNames;

  it('should render', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={{}}
        />
      </Provider>,
    );

    expect($$('va-text-input', container).length).to.equal(4);
  });

  it('should display a previous name', () => {
    const formData = { first: 'First name' };
    const { queryByText } = render(<PreviousNamesView formData={formData} />);
    expect(queryByText(/First name/i)).to.exist;
  });
});
