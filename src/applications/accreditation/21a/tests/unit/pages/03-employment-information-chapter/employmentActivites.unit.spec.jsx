import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import employmentActivities from '../../../../pages/03-employment-information-chapter/employmentActivities';
import { employmentActivitiesOptions } from '../../../../constants/options';

describe('Employment Activities Page', () => {
  it('renders the checkbox options and description', () => {
    const form = render(
      <DefinitionTester
        schema={employmentActivities.schema}
        uiSchema={employmentActivities.uiSchema}
        data={{}}
      />,
    );
    const { container, getByText } = form;
    getByText(
      /Check all that apply. Failure to identify relevant activities may result in a delay in processing your application./,
    );

    Object.values(employmentActivitiesOptions).forEach(option => {
      const checkbox = $(`va-checkbox[label="${option}"]`, container);
      expect(checkbox).to.exist;
    });
  });
});
