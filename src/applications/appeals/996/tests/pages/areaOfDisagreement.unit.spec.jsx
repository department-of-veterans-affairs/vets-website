import React from 'react';
import { expect } from 'chai';
import { fireEvent, render } from '@testing-library/react';
import sinon from 'sinon';

import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import formConfig from '../../config/form';
import { AreaOfDisagreementReviewField } from '../../content/areaOfDisagreement';

describe('area of disagreement page', () => {
  const {
    schema,
    uiSchema,
    arrayPath,
  } = formConfig.chapters.conditions.pages.areaOfDisagreementFollowUp;

  const data = {
    areaOfDisagreement: [
      {
        attributes: {
          ratingIssueSubjectText: 'Tinnitus',
          approxDecisionDate: '2021-01-01',
        },
      },
    ],
  };

  it('should render', () => {
    const { container } = render(
      <DefinitionTester
        definitions={{}}
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        schema={schema}
        uiSchema={uiSchema}
        data={data}
      />,
    );

    expect($$('input[type="checkbox"]', container).length).to.equal(3);
    expect($$('input[type="text"]', container).length).to.equal(1);
    expect(
      $$('input[aria-describedby="disagreement-title"]', container).length,
    ).to.equal(3);
    expect(
      $('#root_otherEntry', container).getAttribute('aria-describedby'),
    ).to.equal('disagreement-title other_hint_text_0');
    const header = $('h3', container);
    expect(header.id).to.equal('disagreement-title');
    expect(header.textContent).to.contain('Tinnitus');
    expect(header.textContent).to.contain('January 1, 2021');
    expect($('h3 .dd-privacy-hidden', container)).to.exist;
  });

  it('should not allow submit when nothing is checked and the input is blank', () => {
    const onSubmit = sinon.spy();
    const { container } = render(
      <DefinitionTester
        definitions={{}}
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        schema={schema}
        uiSchema={uiSchema}
        data={data}
        onSubmit={onSubmit}
      />,
    );

    fireEvent.submit($('form', container));
    expect($('.usa-input-error-message', container)).to.exist;
    expect(onSubmit.called).to.be.false;
  });

  it('should allow submit when an area is checked', () => {
    const onSubmit = sinon.spy();
    const { container, getByLabelText } = render(
      <DefinitionTester
        definitions={{}}
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        schema={schema}
        uiSchema={uiSchema}
        data={data}
        onSubmit={onSubmit}
      />,
    );

    fireEvent.click(getByLabelText('The service connection'));
    fireEvent.submit($('form', container));
    expect(onSubmit.called).to.be.true;
  });

  it('should allow submit with additional text', () => {
    const onSubmit = sinon.spy();
    const { container } = render(
      <DefinitionTester
        definitions={{}}
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        schema={schema}
        uiSchema={uiSchema}
        data={data}
        onSubmit={onSubmit}
      />,
    );

    fireEvent.change($('[name="root_otherEntry"]', container), {
      target: { value: 'foo' },
    });
    fireEvent.submit($('form', container));
    expect(onSubmit.called).to.be.true;
  });

  it('should render AreaOfDisagreementReviewField', () => {
    const title = 'Your evaluation of my condition';
    const { container } = render(
      <AreaOfDisagreementReviewField>
        {React.createElement(
          'div',
          {
            id: 'foo',
            name: 'evaluation',
            formData: {},
          },
          'Bar',
        )}
      </AreaOfDisagreementReviewField>,
    );
    expect($('dt', container).textContent).to.equal(title);
    expect($('dd', container).textContent).to.equal('Bar');
    expect($$('dd.dd-privacy-hidden', container).length).to.equal(0);
  });
  it('should render AreaOfDisagreementReviewField with hidden Datadog class', () => {
    const title = 'Something else:';
    const { container } = render(
      <AreaOfDisagreementReviewField>
        {React.createElement(
          'div',
          {
            id: 'foo',
            name: 'otherEntry',
            formData: {},
          },
          'Bar',
        )}
      </AreaOfDisagreementReviewField>,
    );
    expect($('dt', container).textContent).to.equal(title);
    expect($('dd.dd-privacy-hidden', container).textContent).to.equal('Bar');
  });
});
