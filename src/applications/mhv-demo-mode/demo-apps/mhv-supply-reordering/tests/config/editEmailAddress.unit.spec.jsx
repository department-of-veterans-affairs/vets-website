import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import formConfig from '../../config/form';

describe('editEmailAddress', () => {
  const {
    schema,
    uiSchema,
    onNavForward,
    onNavBack,
  } = formConfig.chapters.contactInformationChapter.pages.editEmailAddress;

  it('renders the form with the correct number of inputs', () => {
    const { container } = render(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
        onNavForward={onNavForward}
        data={{}}
      />,
    );
    expect($$('va-text-input', container).length).to.equal(1);
    expect($('button[type="submit"]', container)).to.exist;
  });

  it('renders on review & submit page', () => {
    window.location = { pathname: '/review-and-submit' };
    const { container } = render(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
        data={{}}
      />,
    );
    expect($$('va-text-input', container).length).to.equal(1);
    expect($('button[type="submit"]', container)).to.exist;
  });

  it('navigates back to contact-information page', () => {
    const goPath = sinon.spy();
    onNavBack({ goPath });
    expect(goPath.calledWith('/contact-information')).to.be.true;
  });

  it('navigates forward to contact-information page', () => {
    const goPath = sinon.spy();
    onNavForward({ goPath });
    expect(goPath.calledWith('/contact-information')).to.be.true;
  });
});
