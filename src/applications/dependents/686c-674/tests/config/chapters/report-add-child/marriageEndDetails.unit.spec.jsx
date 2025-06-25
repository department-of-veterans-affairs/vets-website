import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';
import React from 'react';
import createCommonStore from '@department-of-veterans-affairs/platform-startup/store';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../../../config/form';

const defaultStore = createCommonStore();

const arrayPath = 'childrenToAdd';

const formData = (marriageEndReason = '') => {
  return {
    'view:selectable686Options': {
      addChild: true,
    },
    childrenToAdd: [
      {
        hasChildEverBeenMarried: true,
        marriageEndReason,
      },
    ],
  };
};
describe('686 add child marriage end details', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.addChild.pages.addChildMarriageEndDetails;

  it('should render', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={formData()}
          arrayPath={arrayPath}
          pagePerItemIndex={0}
        />
      </Provider>,
    );

    expect($$('va-memorable-date', container).length).to.equal(1);
    expect($$('va-radio', container).length).to.equal(1);
    expect($$('va-radio-option', container).length).to.equal(4);
  });

  it('should render other field', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={formData('other')}
          arrayPath={arrayPath}
          pagePerItemIndex={0}
        />
      </Provider>,
    );

    expect($$('va-memorable-date', container).length).to.equal(1);
    expect($$('va-radio', container).length).to.equal(1);
    expect($$('va-radio-option', container).length).to.equal(4);
    expect($$('va-text-input', container).length).to.equal(1);
  });
});
