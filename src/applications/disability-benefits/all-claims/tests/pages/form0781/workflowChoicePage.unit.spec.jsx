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
    // These conditions are selected by the user on the src/applications/disability-benefits/all-claims/pages/addDisabilities.js page
    // The user must have claimed new conditions to begin the Form 0781 workflow
    it('lists a single new condition claimed by the user', () => {
      const { getByText } = render(
        <DefinitionTester
          schema={schema}
          uiSchema={uiSchema}
          definitions={{}}
          data={{
            newDisabilities: [
              {
                condition: 'ankle replacement (ankle arthroplasty), bilateral',
              },
            ],
          }}
        />,
      );

      const conditionsParagraph = getByText(
        /Your claim includes these new conditions:/,
      );

      const listElement = within(conditionsParagraph.parentElement).getByRole(
        'list',
      );
      within(listElement).getByText(
        'Ankle replacement (ankle arthroplasty), bilateral',
      );
    });
  });

  it('lists multiple new conditions claimed by the user', () => {
    const { getByText } = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={{}}
        data={{
          newDisabilities: [
            {
              condition: 'ankle replacement (ankle arthroplasty), bilateral',
            },
            {
              condition: 'somatic symptom disorder (SSD)',
            },
            {
              condition: 'varicocele, left',
            },
          ],
        }}
      />,
    );

    const conditionsParagraph = getByText(
      /Your claim includes these new conditions:/,
    );

    const listElement = within(conditionsParagraph.parentElement).getByRole(
      'list',
    );

    within(listElement).getByText(
      'Ankle replacement (ankle arthroplasty), bilateral',
    );

    within(listElement).getByText('Somatic symptom disorder (SSD)');

    within(listElement).getByText('Varicocele, left');
  });

  it('Displays a selection of choices on filling out 0781 and includes examples', () => {
    const onSubmit = Sinon.spy();
    const { container, getByText } = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        data={{
          newDisabilities: [
            {
              condition: 'ankle replacement (ankle arthroplasty), bilateral',
            },
          ],
        }}
        definitions={{}}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    getByText('Adding VA Form 21-0781 to support new mental health conditions');

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

    const addlInfo = container.querySelector('va-accordion-item');
    const headline = addlInfo.querySelector('h3[slot="headline"]');
    expect(headline).to.have.text(
      'Examples of mental health conditions and traumatic events',
    );
  });

  it('should prevent continuing if a selection is not made', () => {
    const onSubmit = Sinon.spy();
    const { container } = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        data={{
          newDisabilities: [
            {
              condition: 'ankle replacement (ankle arthroplasty), bilateral',
            },
          ],
        }}
        definitions={{}}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    fireEvent.submit($('form', container));
    expect(
      $$('va-radio[error="You must provide a response"]', container).length,
    ).to.equal(1);
  });

  it('should allow continuing to the next page when a selection is made', () => {
    const onSubmit = Sinon.spy();
    const { container } = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        data={{
          newDisabilities: [
            {
              condition: 'ankle replacement (ankle arthroplasty), bilateral',
            },
          ],
        }}
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
