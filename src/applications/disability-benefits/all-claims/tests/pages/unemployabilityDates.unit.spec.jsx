import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import {
  DefinitionTester,
  fillDate,
} from 'platform/testing/unit/schemaform-utils';
import { mount } from 'enzyme';
import { waitFor } from '@testing-library/dom';
import { format, subYears, subMonths, addYears } from 'date-fns';
import formConfig from '../../config/form';

import { ERR_MSG_CSS_CLASS } from '../../constants';

describe('Unemployability affective Dates', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.disabilities.pages.unemployabilityDates;

  it('should render', async () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          'view:unemployabilityStatus': true,
        }}
        formData={{}}
      />,
    );

    expect(form.find('input').length).to.equal(3);
    expect(form.find('select').length).to.equal(6);
    form.unmount();
  });

  it('should fail to submit when no beginning date is filled out', async () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          'view:unemployabilityUploadChoice': 'answerQuestions',
        }}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    form.find('form').simulate('submit');
    form.update();

    await waitFor(() => {
      form.update();
      expect(form.find(ERR_MSG_CSS_CLASS).length).to.equal(1);
      expect(onSubmit.called).to.be.false;
    });
    form.unmount();
  });

  it('should submit when beginning date is filled in', async () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          'view:unemployabilityUploadChoice': 'answerQuestions',
        }}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    fillDate(
      form,
      'root_unemployability_disabilityAffectedEmploymentFullTimeDate',
      '2017-03-04',
    );

    await waitFor(() => {
      form.find('form').simulate('submit');
      expect(form.find(ERR_MSG_CSS_CLASS).length).to.equal(0);
      expect(onSubmit.called).to.be.true;
    });
    form.unmount();
  });

  // Helper function to test currentOrPastDateUI validation for any date field
  const testCurrentOrPastDateField = (
    fieldName,
    fieldLabel,
    isRequired = false,
  ) => {
    describe(`${fieldName} currentOrPastDateUI validation`, () => {
      it('should accept current date', async () => {
        const onSubmit = sinon.spy();
        const today = format(new Date(), 'yyyy-MM-dd');
        const form = mount(
          <DefinitionTester
            definitions={formConfig.defaultDefinitions}
            schema={schema}
            uiSchema={uiSchema}
            data={{
              'view:unemployabilityUploadChoice': 'answerQuestions',
            }}
            formData={{}}
            onSubmit={onSubmit}
          />,
        );

        // Fill the required field if this is an optional field
        if (!isRequired) {
          fillDate(
            form,
            'root_unemployability_disabilityAffectedEmploymentFullTimeDate',
            format(subYears(new Date(), 2), 'yyyy-MM-dd'),
          );
        }

        fillDate(form, `root_unemployability_${fieldName}`, today);

        await waitFor(() => {
          expect(form.find(ERR_MSG_CSS_CLASS)).to.have.lengthOf(0);
        });

        form.find('form').simulate('submit');
        await waitFor(() => {
          expect(onSubmit.called).to.be.true;
        });
        form.unmount();
      });

      it('should accept past date', async () => {
        const onSubmit = sinon.spy();
        const pastDate = format(subYears(new Date(), 1), 'yyyy-MM-dd');
        const form = mount(
          <DefinitionTester
            definitions={formConfig.defaultDefinitions}
            schema={schema}
            uiSchema={uiSchema}
            data={{
              'view:unemployabilityUploadChoice': 'answerQuestions',
            }}
            formData={{}}
            onSubmit={onSubmit}
          />,
        );

        // Fill the required field if this is an optional field
        if (!isRequired) {
          fillDate(
            form,
            'root_unemployability_disabilityAffectedEmploymentFullTimeDate',
            format(subYears(new Date(), 2), 'yyyy-MM-dd'),
          );
        }

        fillDate(form, `root_unemployability_${fieldName}`, pastDate);

        await waitFor(() => {
          expect(form.find(ERR_MSG_CSS_CLASS)).to.have.lengthOf(0);
        });

        form.find('form').simulate('submit');
        await waitFor(() => {
          expect(onSubmit.called).to.be.true;
        });
        form.unmount();
      });

      it('should reject future date', async () => {
        const onSubmit = sinon.spy();
        const futureDate = format(addYears(new Date(), 1), 'yyyy-MM-dd');
        const form = mount(
          <DefinitionTester
            definitions={formConfig.defaultDefinitions}
            schema={schema}
            uiSchema={uiSchema}
            data={{
              'view:unemployabilityUploadChoice': 'answerQuestions',
            }}
            formData={{}}
            onSubmit={onSubmit}
          />,
        );

        // Fill the required field if this is an optional field
        if (!isRequired) {
          fillDate(
            form,
            'root_unemployability_disabilityAffectedEmploymentFullTimeDate',
            format(subYears(new Date(), 2), 'yyyy-MM-dd'),
          );
        }

        fillDate(form, `root_unemployability_${fieldName}`, futureDate);

        form.find('form').simulate('submit');
        form.update();

        await waitFor(() => {
          form.update();
          expect(form.find(ERR_MSG_CSS_CLASS)).to.have.lengthOf.at.least(1);
          expect(form.find(ERR_MSG_CSS_CLASS).text()).to.contain(
            'Please provide a valid current or past date',
          );
          expect(onSubmit.called).to.be.false;
        });
        form.unmount();
      });

      it('should render with correct label', () => {
        const form = mount(
          <DefinitionTester
            definitions={formConfig.defaultDefinitions}
            schema={schema}
            uiSchema={uiSchema}
          />,
        );

        expect(form.text()).to.contain(fieldLabel);
        form.unmount();
      });
    });
  };

  // Test all three date fields using the helper function
  testCurrentOrPastDateField(
    'disabilityAffectedEmploymentFullTimeDate',
    'When did you become too disabled to work?',
    true, // Required field
  );

  testCurrentOrPastDateField(
    'lastWorkedFullTimeDate',
    'When did you last work full-time?',
    false, // Optional field
  );

  testCurrentOrPastDateField(
    'becameTooDisabledToWorkDate',
    'When did your condition or disability begin to affect your full-time job?',
    false, // Optional field
  );

  // Test complete form submission with all fields
  describe('complete form submission', () => {
    it('should submit when all date fields are valid current or past dates', async () => {
      const onSubmit = sinon.spy();
      const form = mount(
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          uiSchema={uiSchema}
          data={{
            'view:unemployabilityUploadChoice': 'answerQuestions',
          }}
          formData={{}}
          onSubmit={onSubmit}
        />,
      );

      // Fill all three date fields with valid dates
      fillDate(
        form,
        'root_unemployability_disabilityAffectedEmploymentFullTimeDate',
        format(subYears(new Date(), 2), 'yyyy-MM-dd'),
      );
      fillDate(
        form,
        'root_unemployability_lastWorkedFullTimeDate',
        format(subYears(new Date(), 1), 'yyyy-MM-dd'),
      );
      fillDate(
        form,
        'root_unemployability_becameTooDisabledToWorkDate',
        format(subMonths(new Date(), 6), 'yyyy-MM-dd'),
      );

      await waitFor(() => {
        expect(form.find(ERR_MSG_CSS_CLASS)).to.have.lengthOf(0);
      });

      form.find('form').simulate('submit');
      await waitFor(() => {
        expect(onSubmit.called).to.be.true;
      });
      form.unmount();
    });

    it('should not submit when any date field contains future date', async () => {
      const onSubmit = sinon.spy();
      const form = mount(
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          uiSchema={uiSchema}
          data={{
            'view:unemployabilityUploadChoice': 'answerQuestions',
          }}
          formData={{}}
          onSubmit={onSubmit}
        />,
      );

      // Fill required field with valid date
      fillDate(
        form,
        'root_unemployability_disabilityAffectedEmploymentFullTimeDate',
        format(subYears(new Date(), 2), 'yyyy-MM-dd'),
      );
      // Fill optional field with future date
      fillDate(
        form,
        'root_unemployability_lastWorkedFullTimeDate',
        format(addYears(new Date(), 1), 'yyyy-MM-dd'),
      );

      form.find('form').simulate('submit');
      form.update();

      await waitFor(() => {
        form.update();
        expect(form.find(ERR_MSG_CSS_CLASS)).to.have.lengthOf.at.least(1);
        expect(form.find(ERR_MSG_CSS_CLASS).text()).to.contain(
          'Please provide a valid current or past date',
        );
        expect(onSubmit.called).to.be.false;
      });
      form.unmount();
    });
  });
});
