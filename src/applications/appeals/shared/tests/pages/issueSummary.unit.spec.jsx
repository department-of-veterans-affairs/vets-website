// Shared tests for all 3 DR apps
import React from 'react';
import { expect } from 'chai';
import { fireEvent, render } from '@testing-library/react';
import sinon from 'sinon';
import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import * as scFormConfig from '../../../995/config/form';
import * as hlrFormConfig from '../../../996/config/form';
import * as nodFormConfig from '../../../10182/config/form';
import { SELECTED } from '../../constants';

const onSubmitSpy = sinon.spy();
const configs = [scFormConfig, hlrFormConfig, nodFormConfig];

const renderWithSelectedIssues = formConfig => {
  const { schema, uiSchema } = formConfig.chapters.issues.pages.issueSummary;

  return render(
    <DefinitionTester
      definitions={{}}
      schema={schema}
      uiSchema={uiSchema}
      data={{
        contestedIssues: [{ [SELECTED]: true }],
        additionalIssues: [{ [SELECTED]: true }],
      }}
      formData={{}}
      onSubmit={onSubmitSpy}
    />,
  );
};

const renderWithEmptyIssues = formConfig => {
  const { schema, uiSchema } = formConfig.chapters.issues.pages.issueSummary;

  return render(
    <DefinitionTester
      definitions={{}}
      schema={schema}
      uiSchema={uiSchema}
      data={{ contestedIssues: [{}] }}
      formData={{}}
      onSubmit={onSubmitSpy}
    />,
  );
};

describe('selected issues summary page', () => {
  configs.forEach(config => {
    it('should render successfully', () => {
      const { container } = renderWithSelectedIssues(config.default);
      expect($$('li', container).length).to.equal(2);
    });

    it('should render a link to the eligible issues page', () => {
      const { container } = renderWithEmptyIssues(config.default);

      if (config.default.formId !== '20-0995') {
        const link = $('va-link', container);
        expect(link.getAttribute('text')).to.contain(
          'Go back to add more issues',
        );
      }
    });

    it('should allow continue', () => {
      const { container } = renderWithEmptyIssues(config.default);
      fireEvent.click($('.btn-info', container));
      expect($('.usa-input-error-message', container)).to.not.exist;
      expect(onSubmitSpy.called).to.be.true;
    });
  });
});
