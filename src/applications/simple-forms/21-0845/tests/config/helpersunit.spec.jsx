/* eslint-disable @department-of-veterans-affairs/axe-check-required */
/* eslint-disable no-unused-expressions */
/* eslint-disable react/jsx-no-undef */
import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { pageFocusScroll } from '../../config/helpers';
import formConfig from '../../config/form';
// import { sinon } from 'sinon';

const {
  schema,
  uiSchema,
} = formConfig.chapters.disclosureInfoChapter.pages.organizationNamePage;

describe('should render', () => {
  it('should render', () => {
    // const scrollToStub = sinon.stub(scrollModule, 'scrollTo');

    const { container } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
      />,
    );

    pageFocusScroll();

    // expect(elementToCheck.style.display).to.not.equal('none');
    expect(container).to.exist;
  });
});
