import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import { $ } from 'platform/forms-system/src/js/utilities/ui';

import formConfig from '../../../10182/config/form';

describe('area of disagreement page', () => {
  const {
    schema,
    uiSchema,
    arrayPath,
  } = formConfig.chapters.conditions.pages.areaOfDisagreementFollowUp;

  it('should render', () => {
    const { container } = render(
      <DefinitionTester
        definitions={{}}
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          areaOfDisagreement: [
            {
              issue: 'blah',
              decisionDate: '2022-02-02',
            },
            {
              attributes: {
                ratingIssueSubjectText: 'Tinnitus',
                approxDecisionDate: '2021-01-01',
              },
            },
          ],
        }}
      />,
    );

    // This is rendering the uiSchema, so no CustomPage components
    const header = $('h3', container);
    expect(header.id).to.contain('disagreement-title');
    // issueTitle isn't called with form data, so we check the static text
    expect(header.textContent).to.contain('Disagreement with');
    expect(header.textContent).to.contain('decision on');
    expect($('h3 .dd-privacy-hidden[data-dd-action-name]', container)).to.exist;
  });
});
