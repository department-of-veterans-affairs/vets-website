import React from 'react';
import { expect } from 'chai';
import { fireEvent, render } from '@testing-library/react';
import sinon from 'sinon';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import formConfig from '../../config/form';

import { HearingTypeReviewField } from '../../content/hearingType';

describe('NOD board review page', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.boardReview.pages.hearingType;
  const data = { boardReviewOption: 'hearing' };

  it('should render', () => {
    const { container } = render(
      <DefinitionTester
        definitions={{}}
        schema={schema}
        uiSchema={uiSchema}
        data={data}
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
        data={data}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    $('va-radio', container).__events.vaValueChange({
      detail: { value: 'video_conference' },
    });

    fireEvent.submit($('form', container));

    expect($$('[error]', container).length).to.equal(0);
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
        data={data}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    fireEvent.submit($('form', container));
    expect($$('[error]', container).length).to.equal(1);
    expect(onSubmit.called).to.be.false;
  });
});

describe('HearingTypeReviewField', () => {
  it('should render the value', () => {
    const { container } = render(
      <HearingTypeReviewField>
        {React.createElement(
          'div',
          { formData: 'video_conference' },
          'video_conference',
        )}
      </HearingTypeReviewField>,
    );

    expect($('dt', container).textContent).to.equal(
      'What type of hearing would you like to request?',
    );
    expect($('dd', container).textContent).to.equal('video_conference');
  });

  it('should render the missing value error', () => {
    const { container } = render(
      <HearingTypeReviewField>
        {React.createElement('div', { formData: null })}
      </HearingTypeReviewField>,
    );

    expect($('dt', container).textContent).to.equal(
      'What type of hearing would you like to request?',
    );
    expect($('dd .usa-input-error-message', container).textContent).to.equal(
      'Missing hearing option',
    );
  });
});
