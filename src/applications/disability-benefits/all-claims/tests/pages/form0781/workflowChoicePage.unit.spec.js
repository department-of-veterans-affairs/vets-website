import React from 'react';
import { expect } from 'chai';
import { fireEvent, render, within } from '@testing-library/react';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import Sinon from 'sinon';
import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';
import workflowChoicePage from '../../../pages/form0781/workflowChoicePage';
import {
  form0781WorkflowChoiceLabels,
  form0781WorkflowChoices,
} from '../../../content/form0781/workflowChoicePage';

describe('Form 0781 workflow choice page', () => {
  const { schema, uiSchema } = workflowChoicePage;

  it('should define a uiSchema object', () => {
    expect(uiSchema).to.be.an('object');
  });

  it('should define a schema object', () => {
    expect(schema).to.be.an('object');
  });

  describe('Page Content', () => {
    // These conditions are selected by the user on the all-claims/pages/mentalHealth/mentalHealthConditions.js page
    it('lists a single condition claimed on the mental health screener page', () => {
      const { getByText } = render(
        <DefinitionTester
          schema={schema}
          uiSchema={uiSchema}
          definitions={{}}
          data={{
            mentalHealth: {
              conditions: {
                anemia: true,
                none: false,
              },
            },
          }}
        />,
      );

      const conditionsParagraph = getByText(
        /You selected these new mental health conditions for your disability claim:/i,
      );

      // Conditions embedded in strong tag; will not match on getByText above
      within(conditionsParagraph).getByText('anemia');
    });
  });

  it('lists multiple conditions claimed on the mental health screener page', () => {
    const { getByText } = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={{}}
        data={{
          mentalHealth: {
            conditions: {
              anemia: true,
              ptsd: true,
              depression: true,
              none: false,
            },
          },
        }}
      />,
    );

    const conditionsParagraph = getByText(
      /You selected these new mental health conditions for your disability claim:/i,
    );

    within(conditionsParagraph).getByText('anemia, ptsd, depression');
  });

  it('Does not display mental health conditions if the none checkbox was selected', () => {
    const { queryByText } = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={{}}
        data={{
          mentalHealth: {
            conditions: {
              none: true,
            },
          },
        }}
      />,
    );

    expect(
      queryByText(
        /You selected these new mental health conditions for your disability claim:/i,
      ),
    ).not.to.exist;
  });

  it('Displays a radio button selection of choices on filling out 0781', () => {
    const onSubmit = Sinon.spy();
    const { container, getByText } = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        definitions={{}}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    getByText('Statement about mental health conditions (VA Form 21-0781)');

    const radioButtons = $$('va-radio');
    expect(radioButtons.length).to.equal(1);

    expect(
      container.querySelector(
        `va-radio-option[label="${
          form0781WorkflowChoiceLabels[
            form0781WorkflowChoices.COMPLETE_ONLINE_FORM
          ]
        }"]`,
        container,
      ),
    ).to.exist;

    expect(
      container.querySelector(
        `va-radio-option[label="${
          form0781WorkflowChoiceLabels[
            form0781WorkflowChoices.SUBMIT_PAPER_FORM
          ]
        }"]`,
        container,
      ),
    ).to.exist;

    expect(
      container.querySelector(
        `va-radio-option[label="${
          form0781WorkflowChoiceLabels[
            form0781WorkflowChoices.OPT_OUT_OF_FORM0781
          ]
        }"]`,
        container,
      ),
    ).to.exist;
  });

  it('should prevent continuing if a selection is not made', () => {
    const onSubmit = Sinon.spy();
    const { container } = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        definitions={{}}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    fireEvent.submit($('form', container));
    expect($$('[error]').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
  });

  it('should allow continuing to the next page when a selection is made', () => {
    const onSubmit = Sinon.spy();
    const { container } = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        definitions={{}}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    $('va-radio', container).__events.vaValueChange({
      detail: { value: 'optForOnlineForm0781' },
    });

    fireEvent.submit($('form', container));
    expect($$('[error]').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });
});
