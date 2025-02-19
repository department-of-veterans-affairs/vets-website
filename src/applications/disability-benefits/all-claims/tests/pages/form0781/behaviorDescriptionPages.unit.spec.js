import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import userEvent from '@testing-library/user-event';
import Sinon from 'sinon';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import { inputVaTextInput } from '@department-of-veterans-affairs/platform-testing/helpers';

import * as reassignmentDescriptionPage from '../../../pages/form0781/behaviorChangeDescriptions/reassignmentDescriptionPage';

import * as unlistedDescriptionPage from '../../../pages/form0781/behaviorChangeDescriptions/unlistedDescriptionPage';

import * as behaviorListPages from '../../../content/form0781/behaviorListPages';

describe('Behavioral description pages', () => {
  const allBehaviorDescriptionPages = [
    reassignmentDescriptionPage,
    unlistedDescriptionPage,
  ];

  allBehaviorDescriptionPages.forEach(page => {
    const { schema, uiSchema } = page;

    it('should define a uiSchema object', () => {
      expect(uiSchema).to.be.an('object');
    });

    it('should define a schema object', () => {
      expect(schema).to.be.an('object');
    });

    it('Displays a text area', () => {
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

      const textarea = $('va-textarea', container);
      // Not required
      expect(textarea.getAttribute('required')).to.eq('false');

      // unlisted page has its own description, every other page uses the same description
      if (!uiSchema.behaviorsDetails.unlisted) {
        expect(textarea.getAttribute('label')).to.eq(
          behaviorListPages.behaviorDescriptionPageDescription,
        );
      } else {
        expect(textarea.getAttribute('label')).to.eq(
          behaviorListPages.unlistedDescriptionPageDescription,
        );
      }
    });

    it('should submit without entering any text', () => {
      const onSubmit = Sinon.spy();

      const { getByText } = render(
        <DefinitionTester
          schema={schema}
          uiSchema={uiSchema}
          data={{}}
          onSubmit={onSubmit}
        />,
      );
      userEvent.click(getByText('Submit'));
      expect(onSubmit.calledOnce).to.be.true;
    });

    it('should submit if text entered', () => {
      const onSubmit = Sinon.spy();

      const { container, getByText } = render(
        <DefinitionTester
          schema={schema}
          uiSchema={uiSchema}
          data={{}}
          onSubmit={onSubmit}
        />,
      );

      inputVaTextInput(
        container,
        'Here is a description of a behavioral change',
        'va-textarea',
      );

      userEvent.click(getByText('Submit'));
      expect(onSubmit.called).to.be.true;
    });
  });
});
