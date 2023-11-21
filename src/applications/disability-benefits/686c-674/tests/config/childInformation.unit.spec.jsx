import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils.jsx';

import formConfig from '../../config/form';
import { fillDataWithRtl } from '../../util';

describe('686 add child - child information', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.addChild.pages.addChildInformation;

  const formData = {
    'view:selectable686Options': {
      addChild: true,
    },
  };

  it('should render', () => {
    const { container } = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
        data={formData}
      />,
    );
    expect(container.querySelectorAll('input').length).to.equal(5);
    expect(container.querySelectorAll('select').length).to.equal(2);
  });

  it('should not progress without the required fields', async () => {
    const onSubmit = sinon.spy();
    const { container } = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
        data={formData}
        onSubmit={onSubmit}
      />,
    );

    const button = container.querySelector('button[type="submit"]');

    fireEvent.click(button);

    await waitFor(() => {
      expect(container.querySelectorAll('.usa-input-error').length).to.equal(4);
      expect(onSubmit.called).to.be.false;
    });
  });

  it('should progress with the required fields filled', async () => {
    const onSubmit = sinon.spy();
    const { container } = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
        data={formData}
        onSubmit={onSubmit}
      />,
    );

    const inputs = {
      'input#root_childrenToAdd_0_fullName_first': 'Bill',
      'input#root_childrenToAdd_0_fullName_last': 'Bob',
      'input#root_childrenToAdd_0_ssn': '555555551',
      'select#root_childrenToAdd_0_birthDateMonth': 1,
      'select#root_childrenToAdd_0_birthDateDay': 1,
      'input#root_childrenToAdd_0_birthDateYear': '2002',
    };

    fillDataWithRtl({ container, inputs });

    const button = container.querySelector('button[type="submit"]');

    fireEvent.click(button);

    await waitFor(() => {
      expect(container.querySelectorAll('.usa-input-error').length).to.equal(0);
      expect(onSubmit.called).to.be.true;
    });
  });
});
