import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { $$ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../config/form';

describe('Recent Job Applications', () => {
  const page =
    formConfig.chapters.disabilities.pages.unemployabilityCertification;
  const { schema, uiSchema } = page;

  it('should render', () => {
    const { container } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );

    expect($$('va-checkbox', container).length).to.equal(2);
  });

  it('should certify both statements', async () => {
    const onSubmit = sinon.spy();
    const { container, getByText } = render(
      <DefinitionTester
        onSubmit={onSubmit}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );

    const checkboxes = $$('va-checkbox', container);
    await checkboxes.forEach(checkbox =>
      checkbox.__events.vaChange({
        target: {
          checked: true,
          dataset: { key: 'none' },
        },
        detail: { checked: true },
      }),
    );

    await userEvent.click(getByText('Submit'));
    expect(
      $$('va-checkbox[error="You must provide a response"]', container).length,
    ).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });

  it('should not allow submission with no data', async () => {
    const onSubmit = sinon.spy();
    const { container, getByText } = render(
      <DefinitionTester
        onSubmit={onSubmit}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );

    expect($$('va-checkbox').length).to.equal(2);

    await userEvent.click(getByText('Submit'));

    expect(
      $$('va-checkbox[error="You must provide a response"]', container).length,
    ).to.equal(2);

    expect(onSubmit.called).to.be.false;
  });
});
