import React from 'react';
import { render, cleanup, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import createCommonStore from '@department-of-veterans-affairs/platform-startup/store';
import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../../../config/form';

const defaultStore = createCommonStore();
const baseFormData = {
  'view:selectable686Options': { addChild: true },
  childrenToAdd: [{}],
};

describe('686 add child relationship step two', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.addChild.pages.addChildRelationshipPartTwo;

  afterEach(cleanup);

  it('should render both checkboxes', () => {
    const form = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={baseFormData}
          arrayPath="childrenToAdd"
          pagePerItemIndex={0}
        />
      </Provider>,
    );
    const formDOM = getFormDOM(form);

    expect(formDOM.querySelectorAll('va-checkbox').length).to.eq(2);

    const group = formDOM.querySelector('va-checkbox-group');
    expect(group).to.exist;
    expect(group.getAttribute('label')).to.include(
      'What’s your relationship to this child?',
    );
  });

  it('should require at least one relationship', async () => {
    const form = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={baseFormData}
          arrayPath="childrenToAdd"
          pagePerItemIndex={0}
        />
      </Provider>,
    );
    const formDOM = getFormDOM(form);

    const submit = formDOM.querySelector('button[type="submit"]');
    submit.click();

    await waitFor(() => {
      const group = formDOM.querySelector('va-checkbox-group');
      expect(group).to.exist;
      expect(group.getAttribute('error')).to.include(
        'Select at least one relationship.',
      );
    });
  });

  it('should display evidence info when adopted is checked', async () => {
    const checkedData = {
      ...baseFormData,
      relationshipToChild: { adopted: true },
    };
    const form = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={checkedData}
          arrayPath="childrenToAdd"
          pagePerItemIndex={0}
        />
      </Provider>,
    );
    await waitFor(() => {
      expect(form.container.textContent).to.include(
        'Based on your answers, you’ll need to submit additional evidence',
      );
      expect(form.container.textContent).to.include(
        'The final decree of adoption',
      );
    });
  });

  it('should display stepchild evidence info when stepchild is checked', async () => {
    const checkedData = {
      ...baseFormData,
      relationshipToChild: { stepchild: true },
    };
    const form = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={checkedData}
          arrayPath="childrenToAdd"
          pagePerItemIndex={0}
        />
      </Provider>,
    );
    await waitFor(() => {
      expect(form.container.textContent).to.include(
        'You’ll need to submit a copy of your child’s birth certificate',
      );
    });
  });
});
