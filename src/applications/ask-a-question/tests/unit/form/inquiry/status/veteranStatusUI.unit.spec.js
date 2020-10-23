import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';

import {
  getLabelText,
  getRadioOption,
  getText,
} from '../../../helpers/queryHelper';
import { veteranStatusUI } from '../../../../../form/inquiry/status/veteranStatusUI';
import formConfig from '../../../../../form/form';
import InquiryPage from '../../../../../form/inquiry/inquiryPage';

function expectRelationshipToVeteranToBeRequired(wrapper) {
  getLabelText(
    wrapper,
    veteranStatusUI.relationshipToVeteran['ui:title'],
    'veteranStatus',
  ).shouldBeRequired();
}

function expectVeteranIsDeceasedToBeRequired(wrapper) {
  getText(
    wrapper,
    veteranStatusUI.veteranIsDeceased['ui:title'],
    'veteranStatus',
  ).shouldBeRequired();
}

function changeVeteranStatus(wrapper, value) {
  getLabelText(wrapper, veteranStatusUI.veteranStatus['ui:title']).change(
    value,
  );
}

describe('Veteran Status UI', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = render(
      <DefinitionTester
        schema={InquiryPage.schema}
        uiSchema={InquiryPage.uiSchema}
        definitions={formConfig.defaultDefinitions}
        data={{
          topic: {
            levelOne: null,
            levelTwo: null,
          },
          veteranStatus: {
            veteranStatus: null,
          },
        }}
      />,
    );
  });

  afterEach(() => {
    wrapper && wrapper.unmount();
  });

  describe('when veteran status is behalf of vet', () => {
    beforeEach(() => {
      changeVeteranStatus(wrapper, 'behalf of vet');
    });

    it('should require relationship to veteran', () => {
      expectRelationshipToVeteranToBeRequired(wrapper);
    });

    it('should not display date of death when veteran is not deceased', () => {
      expectVeteranIsDeceasedToBeRequired(wrapper);

      getRadioOption(wrapper, 'No', 'veteranIsDeceased').click();

      getText(
        wrapper,
        veteranStatusUI.dateOfDeath['ui:title'],
        'veteranStatus',
      ).shouldNotExist();
    });

    it('should display date of death when veteran is deceased', () => {
      expectVeteranIsDeceasedToBeRequired(wrapper);

      getRadioOption(wrapper, 'Yes', 'veteranIsDeceased').click();

      getText(
        wrapper,
        veteranStatusUI.dateOfDeath['ui:title'],
        'veteranStatus',
      ).shouldExist();
    });
  });

  describe('when veteran status is dependent', () => {
    beforeEach(() => {
      changeVeteranStatus(wrapper, 'dependent');
    });

    it('should require are you the dependent', () => {
      const isDependent = wrapper.getByText(
        veteranStatusUI.isDependent['ui:title'],
        { exact: false },
      );

      expect(isDependent).to.contain.text('Required');
    });
  });
});
