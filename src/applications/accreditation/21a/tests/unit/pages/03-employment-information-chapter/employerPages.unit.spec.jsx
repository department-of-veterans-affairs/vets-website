import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import employersPages from '../../../../pages/03-employment-information-chapter/employersPages';

describe('Employers Pages', () => {
  it('renders the intro page description', () => {
    const form = render(
      <DefinitionTester
        schema={employersPages.employers.schema}
        uiSchema={employersPages.employers.uiSchema}
        data={{}}
      />,
    );
    const { getAllByText } = form;
    const matches = getAllByText((content, element) =>
      element.textContent.includes(
        'You will now list your employment information for the past ten years.',
      ),
    );
    expect(matches.length).to.be.greaterThan(0);
  });

  it('renders the summary page hint', () => {
    const form = render(
      <DefinitionTester
        schema={employersPages.employersSummary.schema}
        uiSchema={employersPages.employersSummary.uiSchema}
        data={{}}
      />,
    );
    const { container } = form;
    const radio = $('va-radio', container);
    expect(radio).to.exist;
    expect(radio.getAttribute('hint')).to.include('employer');
    expect($('va-radio-option', container).getAttribute('value')).to.eq('Y');
    expect(
      $('va-radio-option:nth-child(2)', container).getAttribute('value'),
    ).to.eq('N');
  });

  it('renders employer information fields', () => {
    const form = render(
      <DefinitionTester
        schema={employersPages.employerInformationPage.schema}
        uiSchema={employersPages.employerInformationPage.uiSchema}
        data={{
          employers: [
            {
              name: '',
              positionTitle: '',
              supervisorName: '',
            },
          ],
        }}
        arrayPath="employers"
        pagePerItemIndex={0}
      />,
    );
    const { container } = form;
    const nameInput = $('va-text-input[label="Name of employer"]', container);
    const positionInput = $('va-text-input[label="Position title"]', container);
    const supervisorInput = $(
      'va-text-input[label="Supervisor name"]',
      container,
    );
    expect(nameInput).to.exist;
    expect(positionInput).to.exist;
    expect(supervisorInput).to.exist;
  });
});
