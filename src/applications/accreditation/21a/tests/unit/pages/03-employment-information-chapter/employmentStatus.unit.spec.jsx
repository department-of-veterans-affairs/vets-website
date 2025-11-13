import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import employmentStatus from '../../../../pages/03-employment-information-chapter/employmentStatus';
import { employmentStatusOptions } from '../../../../constants/options';

describe('Employment Status Page', () => {
  it('renders the radio options with correct labels', () => {
    const form = render(
      <DefinitionTester
        schema={employmentStatus.schema}
        uiSchema={employmentStatus.uiSchema}
        data={{}}
      />,
    );
    const { container } = form;
    Object.values(employmentStatusOptions).forEach(option => {
      const radio = $(`va-radio-option[label="${option}"]`, container);
      expect(radio).to.exist;
    });
  });
});
