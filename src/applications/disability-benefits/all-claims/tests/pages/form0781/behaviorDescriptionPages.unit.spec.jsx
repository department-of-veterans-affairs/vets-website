import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import userEvent from '@testing-library/user-event';
import Sinon from 'sinon';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import { inputVaTextInput } from '@department-of-veterans-affairs/platform-testing/helpers';

import * as behaviorListPages from '../../../content/form0781/behaviorListPages';
import { makePages } from '../../../pages/form0781/behaviorDescriptions';
import { ALL_BEHAVIOR_CHANGE_DESCRIPTIONS } from '../../../constants';

describe('behavior change description pages', () => {
  const schemas = { ...makePages() };
  const formData = {
    workBehaviors: {
      reassignment: false,
      absences: true,
    },
    healthBehaviors: {
      medications: true,
    },
    otherBehaviors: {
      relationships: true,
      misconduct: false,
      unlisted: true,
    },
    'view:noneCheckbox': { 'view:noBehaviorChanges': false },
    behaviorsDetails: {
      absences: 'exhausted leave',
      unlisted: 'some other behavior',
    },
  };

  Object.keys(ALL_BEHAVIOR_CHANGE_DESCRIPTIONS).forEach(behaviorType => {
    const pageNumber = 0;
    const pageSchema =
      schemas[`behavior-changes-${pageNumber + 1}-description`];
    const onSubmit = Sinon.spy();
    const { container } = render(
      <DefinitionTester
        schema={pageSchema.schema}
        uiSchema={pageSchema.uiSchema}
        data={{ formData }}
        onSubmit={onSubmit}
      />,
    );
    const textarea = $('va-textarea', container);

    it('should define a uiSchema and a schema object', () => {
      expect(pageSchema.uiSchema).to.be.an('object');
      expect(pageSchema.schema).to.be.an('object');
    });

    it('Displays a description and optional text area', () => {
      // unlisted page has its own description, every other page uses the same description
      if (behaviorType !== 'unlisted') {
        expect(textarea.getAttribute('label')).to.eq(
          behaviorListPages.behaviorDescriptionPageDescription,
        );
      }
      expect(textarea.getAttribute('required')).to.eq('false');
    });

    it('should submit without entering any text', () => {
      const { getByText } = render(
        <DefinitionTester
          schema={pageSchema.schema}
          uiSchema={pageSchema.uiSchema}
          data={{}}
          onSubmit={onSubmit}
        />,
      );
      userEvent.click(getByText('Submit'));
      expect(onSubmit.calledOnce).to.be.true;
    });

    it('should submit if text entered', () => {
      const { textContainer, getByText } = render(
        <DefinitionTester
          schema={pageSchema.schema}
          uiSchema={pageSchema.uiSchema}
          data={{}}
          onSubmit={onSubmit}
        />,
      );

      inputVaTextInput(
        textContainer,
        'Here is a description of a behavioral change',
        'va-textarea',
      );

      userEvent.click(getByText('Submit'));
      expect(onSubmit.called).to.be.true;
    });
  });
});
