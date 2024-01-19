import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import formConfig from '../../../config/form';
import {
  gulfWar1990PageTitle,
  gulfWar1990Question,
} from '../../../content/toxicExposure';
import { locationOptions } from '../../../pages/toxicExposure/gulfWar1990Locations';

describe('Gulf War 1990 Locations', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.disabilities.pages.gulfWar1990Locations;

  it('should render', async () => {
    const formData = {};
    const { container, getByText } = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} data={formData} />,
    );

    getByText(gulfWar1990PageTitle);

    await waitFor(() => {
      expect($$('va-checkbox-group', container).length).to.equal(1);
      expect($('va-checkbox-group', container).getAttribute('label')).to.equal(
        gulfWar1990Question,
      );

      // fail fast - verify we have the right number of checkboxes
      expect($$('va-checkbox', container).length).to.equal(
        Object.keys(locationOptions).length,
      );

      // verify that each checkbox exists with user facing label
      Object.values(locationOptions).forEach(option => {
        expect($$(`va-checkbox[label="${option}"]`, container)).to.exist;
      });
    });
  });
});
