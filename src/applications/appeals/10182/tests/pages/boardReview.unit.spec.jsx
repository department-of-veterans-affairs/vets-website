import React from 'react';
import { expect } from 'chai';
import { fireEvent, render } from '@testing-library/react';
import sinon from 'sinon';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import formConfig from '../../config/form';

import { BoardReviewReviewField } from '../../content/boardReview';

describe('NOD board review page', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.boardReview.pages.boardReviewOption;

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

    expect($$('va-radio-option', container).length).to.equal(3);
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

    // fireEvent.click($('va-radio-option[value="direct_review"]', container));
    $('va-radio', container).__events.vaValueChange({
      detail: { value: 'direct_review' },
    });

    fireEvent.submit($('form', container));

    expect($$('[error]').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });

  // board option is required
  it('should prevent continuing', () => {
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

    fireEvent.submit($('form', container));

    expect($$('[error]').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
  });
});

describe('BoardReviewReviewField', () => {
  it('should render the value', () => {
    const { container } = render(
      <BoardReviewReviewField>
        {React.createElement(
          'div',
          { formData: 'evidence_submission' },
          'evidence_submission',
        )}
      </BoardReviewReviewField>,
    );

    expect($('dt', container).textContent).to.equal(
      'Select a Board review option:',
    );
    expect($('dd', container).textContent).to.equal('evidence_submission');
  });

  it('should render the missing value error', () => {
    const { container } = render(
      <BoardReviewReviewField>
        {React.createElement('div', { formData: null })}
      </BoardReviewReviewField>,
    );

    expect($('dt', container).textContent).to.equal(
      'Select a Board review option:',
    );
    expect($('dd .usa-input-error-message', container).textContent).to.equal(
      'Missing Board review option',
    );
  });
});
