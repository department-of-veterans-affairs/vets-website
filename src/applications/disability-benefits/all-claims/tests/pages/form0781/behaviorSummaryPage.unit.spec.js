import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import Sinon from 'sinon';
import { $$ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import * as behaviorSummaryPage from '../../../pages/form0781/behaviorSummaryPage';

describe('Behavior Summary Page', () => {
  const { schema, uiSchema } = behaviorSummaryPage;

  it('should define a uiSchema object', () => {
    expect(uiSchema).to.be.an('object');
  });

  it('should define a schema object', () => {
    expect(schema).to.be.an('object');
  });

  describe('Page Content', () => {
    it('renders the correct content', () => {
      const formData = {
        workBehaviors: {
          reassignment: false,
          absences: true,
        },
        otherBehaviors: {
          relationships: true,
          misconduct: false,
          unlisted: true,
        },
        'view:noneCheckbox': { none: false },
        behaviorsDetails: {
          absences: 'exhausted leave',
          unlisted: 'some other behavior',
        },
      };

      const onSubmit = Sinon.spy();
      const { container, getByText } = render(
        <DefinitionTester
          schema={schema}
          data={formData}
          onSubmit={onSubmit}
          uiSchema={uiSchema}
        />,
      );

      // show a heading for each selected behavior
      const behaviorHeadings = $$('h4', container);
      expect(behaviorHeadings.length).to.equal(3);

      // show details for each behavior description provided
      expect(getByText('exhausted leave')).to.exist;
      expect(getByText('some other behavior')).to.exist;

      // show 'optional' copy if behavior description not provided
      expect(getByText('Optional description not provided.')).to.exist;

      // show edit link
      const editLink = container.querySelector('a');
      expect(editLink).to.have.text('Edit behavioral changes');
    });
  });
});
