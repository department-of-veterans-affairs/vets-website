import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import marriageToVeteranEndInfo from '../../../../config/chapters/04-household-information/marriageToVeteranEndInfo';

describe('Marriage to Veteran End Info Page', () => {
  const { schema, uiSchema } = marriageToVeteranEndInfo;

  describe('when married to veteran at time of death', () => {
    const data = { marriedToVeteranAtTimeOfDeath: true };

    it('renders a heading', () => {
      const form = render(
        <DefinitionTester schema={schema} uiSchema={uiSchema} data={data} />,
      );

      expect(form.getByRole('heading')).to.exist;
    });

    it('hides the date marriage ended field', () => {
      const form = render(
        <DefinitionTester schema={schema} uiSchema={uiSchema} data={data} />,
      );
      const formDOM = getFormDOM(form);

      const vaDateField = $(
        'va-memorable-date[label="Date marriage ended"]',
        formDOM,
      );
      expect(vaDateField).to.not.exist;
    });

    it('renders location fields', () => {
      const form = render(
        <DefinitionTester schema={schema} uiSchema={uiSchema} data={data} />,
      );
      const formDOM = getFormDOM(form);

      expect($('va-text-input[label="City"]', formDOM)).to.exist;
      expect($('va-select[label="State"]', formDOM)).to.exist;
    });
  });

  describe('when not married to veteran at time of death', () => {
    const data = { marriedToVeteranAtTimeOfDeath: false };

    it('renders the correct heading', () => {
      const form = render(
        <DefinitionTester schema={schema} uiSchema={uiSchema} data={data} />,
      );

      expect(form.getByRole('heading')).to.have.text(
        'When and where did your marriage end?',
      );
    });

    it('shows the date marriage ended field as required', () => {
      const form = render(
        <DefinitionTester schema={schema} uiSchema={uiSchema} data={data} />,
      );
      const formDOM = getFormDOM(form);

      const vaDateField = $(
        'va-memorable-date[label="Date marriage ended"]',
        formDOM,
      );
      expect(vaDateField).to.exist;
      expect(vaDateField.getAttribute('required')).to.equal('true');
    });

    it('renders location fields', () => {
      const form = render(
        <DefinitionTester schema={schema} uiSchema={uiSchema} data={data} />,
      );
      const formDOM = getFormDOM(form);

      expect($('va-text-input[label="City"]', formDOM)).to.exist;
      expect($('va-select[label="State"]', formDOM)).to.exist;
    });
  });

  describe('when marriage ended outside the U.S.', () => {
    const data = {
      marriedToVeteranAtTimeOfDeath: false,
      marriageToVeteranEndOutsideUs: true,
    };

    it('hides the state field and shows the country field', () => {
      const form = render(
        <DefinitionTester schema={schema} uiSchema={uiSchema} data={data} />,
      );
      const formDOM = getFormDOM(form);

      expect($('va-select[label="State"]', formDOM)).to.not.exist;
      expect($('va-select[label="Country"]', formDOM)).to.exist;
    });
  });

  describe('when marriage ended inside the U.S.', () => {
    const data = {
      marriedToVeteranAtTimeOfDeath: false,
      marriageToVeteranEndOutsideUs: false,
    };

    it('shows the state field and hides the country field', () => {
      const form = render(
        <DefinitionTester schema={schema} uiSchema={uiSchema} data={data} />,
      );
      const formDOM = getFormDOM(form);

      expect($('va-select[label="State"]', formDOM)).to.exist;
      expect($('va-select[label="Country"]', formDOM)).to.not.exist;
    });
  });
});
