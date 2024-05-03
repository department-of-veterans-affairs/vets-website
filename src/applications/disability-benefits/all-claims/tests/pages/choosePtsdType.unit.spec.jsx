import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../config/form.js';

describe('Disability benefits 718 PTSD type', () => {
  const {
    schema,
    uiSchema,
    arrayPath,
  } = formConfig.chapters.disabilities.pages.choosePtsdType;

  it('renders ptsd type form', () => {
    const onSubmit = sinon.spy();
    const { container } = render(
      <DefinitionTester
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        onSubmit={onSubmit}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{
          newDisabilities: [
            {
              condition: 'PTSD personal Trauma',
            },
          ],
        }}
        formData={{}}
        uiSchema={uiSchema}
      />,
    );

    expect($$('va-checkbox', container).length).to.equal(4);
  });

  it('should fill in ptsd type information', async () => {
    const onSubmit = sinon.spy();
    const { container, getByText } = render(
      <DefinitionTester
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        onSubmit={onSubmit}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{
          newDisabilities: [
            {
              condition: 'PTSD personal Trauma',
            },
          ],
        }}
        formData={{}}
        uiSchema={uiSchema}
      />,
    );

    const checkboxGroup = $('va-checkbox-group', container);
    for (const type of ['combat', 'mst', 'assault', 'nonCombat']) {
      // eslint-disable-next-line no-await-in-loop
      await checkboxGroup.__events.vaChange({
        target: { checked: true, dataset: { key: `view:${type}PtsdType` } },
        detail: { checked: true },
      });
    }

    await userEvent.click(getByText('Submit'));
    expect(
      $$(
        'va-checkbox-group[error="Please select at least one event type"]',
        container,
      ).length,
    ).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });

  it('should require a PTSD type to be selected', async () => {
    const onSubmit = sinon.spy();
    const { container, getByText } = render(
      <DefinitionTester
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        onSubmit={onSubmit}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{
          newDisabilities: [
            {
              condition: 'PTSD personal Trauma',
            },
          ],
        }}
        formData={{}}
        uiSchema={uiSchema}
      />,
    );

    await userEvent.click(getByText('Submit'));
    expect(
      $$(
        'va-checkbox-group[error="Please select at least one event type"]',
        container,
      ).length,
    ).to.equal(1);
    await userEvent.click(getByText('Submit'));
  });
});
