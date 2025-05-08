import React from 'react';
import { expect } from 'chai';
import { fireEvent, render } from '@testing-library/react';
import sinon from 'sinon';

import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import formConfig from '../../config/form';

describe('evidence intro page', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.boardReview.pages.evidenceIntro;

  it('should render', () => {
    const { container } = render(
      <DefinitionTester
        definitions={{}}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
      />,
    );

    expect($('va-radio', container)).to.exist;
  });

  it('should allow submit', () => {
    const onSubmit = sinon.spy();
    const { container } = render(
      <DefinitionTester
        definitions={{}}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    $('va-radio', container).__events.vaValueChange({ detail: { value: 'N' } });
    fireEvent.submit($('form', container));
    expect($('[error]')).to.not.exist;
    expect(onSubmit.called).to.be.true;
  });
});
