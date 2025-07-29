import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import {
  DefinitionTester,
  fillData,
  fillDate,
  selectRadio,
} from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../config/form';
import { ERR_MSG_CSS_CLASS } from '../../constants';

describe('Recent Job Applications', () => {
  const page = formConfig.chapters.disabilities.pages.recentEducationTraining;
  const { schema, uiSchema } = page;

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );

    expect(form.find('input').length).to.equal(2);
    form.unmount();
  });

  it('should add an other education', () => {
    const otherEducation = 'Other';
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        onSubmit={onSubmit}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );

    selectRadio(
      form,
      'root_unemployability_receivedOtherEducationTrainingPostUnemployability',
      'Y',
    );
    fillData(
      form,
      'input#root_unemployability_otherEducationTrainingPostUnemployability_0_name',
      otherEducation,
    );

    fillDate(
      form,
      'root_unemployability_otherEducationTrainingPostUnemployability_0_dates_from',
      '2010-01-01',
    );
    fillDate(
      form,
      'root_unemployability_otherEducationTrainingPostUnemployability_0_dates_to',
      '2010-12-01',
    );

    form.find('.va-growable-add-btn').simulate('click');

    expect(
      form
        .find('.va-growable-background')
        .first()
        .text(),
    ).to.contain(otherEducation);

    form.find('form').simulate('submit');

    expect(form.find(ERR_MSG_CSS_CLASS).length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });

  it('should allow submission with no data', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        onSubmit={onSubmit}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );

    selectRadio(
      form,
      'root_unemployability_receivedOtherEducationTrainingPostUnemployability',
      'N',
    );
    expect(form.find('input').length).to.equal(2);

    form.find('form').simulate('submit');
    expect(form.find(ERR_MSG_CSS_CLASS).length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });

  describe('otherEducationTrainingPostUnemployability.dates field validation', () => {
    const addEducation = (from, to) => {
      const onSubmit = sinon.spy();
      const form = mount(
        <DefinitionTester
          onSubmit={onSubmit}
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          uiSchema={uiSchema}
        />,
      );
      selectRadio(
        form,
        'root_unemployability_receivedOtherEducationTrainingPostUnemployability',
        'Y',
      );
      if (from)
        fillDate(
          form,
          'root_unemployability_otherEducationTrainingPostUnemployability_0_dates_from',
          from,
        );
      if (to)
        fillDate(
          form,
          'root_unemployability_otherEducationTrainingPostUnemployability_0_dates_to',
          to,
        );
      form.find('.va-growable-add-btn').simulate('click');
      form.find('form').simulate('submit');
      return { form, onSubmit };
    };

    it('should accept valid date range', () => {
      const { form, onSubmit } = addEducation('2010-01-01', '2010-12-01');
      expect(form.find(ERR_MSG_CSS_CLASS).length).to.equal(0);
      expect(onSubmit.called).to.be.true;
      form.unmount();
    });

    it('should reject invalid date range (to before from)', () => {
      const { form, onSubmit } = addEducation('2010-12-01', '2010-01-01');
      expect(form.find(ERR_MSG_CSS_CLASS).text()).to.include(
        'End of education must be after start of education',
      );
      expect(onSubmit.called).to.be.false;
      form.unmount();
    });

    it('should reject equal from/to dates', () => {
      const { form, onSubmit } = addEducation('2010-01-01', '2010-01-01');
      expect(form.find(ERR_MSG_CSS_CLASS).text()).to.include(
        'End of education must be after start of education',
      );
      expect(onSubmit.called).to.be.false;
      form.unmount();
    });

    it('should accept only from date filled', () => {
      const { form, onSubmit } = addEducation('2010-01-01', '');
      expect(form.find(ERR_MSG_CSS_CLASS).length).to.equal(0);
      expect(onSubmit.called).to.be.true;
      form.unmount();
    });

    it('should accept only to date filled', () => {
      const { form, onSubmit } = addEducation('', '2010-12-01');
      expect(form.find(ERR_MSG_CSS_CLASS).length).to.equal(0);
      expect(onSubmit.called).to.be.true;
      form.unmount();
    });

    it('should reject date before 1900', () => {
      const { form, onSubmit } = addEducation('1899-12-31', '2010-12-01');
      expect(form.find(ERR_MSG_CSS_CLASS).text()).to.include(
        'Please enter a year between 1900 and 2069',
      );
      expect(onSubmit.called).to.be.false;
      form.unmount();
    });

    it('should reject date after 2069', () => {
      const { form, onSubmit } = addEducation('2010-01-01', '2070-01-01');
      expect(form.find(ERR_MSG_CSS_CLASS).text()).to.include(
        'Please enter a year between 1900 and 2069',
      );
      expect(onSubmit.called).to.be.false;
      form.unmount();
    });

    it('should reject invalid date format', () => {
      const { form, onSubmit } = addEducation('invalid-date', '2010-12-01');
      expect(
        form
          .find(ERR_MSG_CSS_CLASS)
          .first()
          .text(),
      ).to.include('Please enter a valid date');
      expect(onSubmit.called).to.be.false;
      form.unmount();
    });

    it('should reject non-leap year February 29', () => {
      const { form, onSubmit } = addEducation('2021-02-29', '2021-12-01');
      expect(
        form
          .find(ERR_MSG_CSS_CLASS)
          .first()
          .text(),
      ).to.include('Please provide a valid date');
      expect(onSubmit.called).to.be.false;
      form.unmount();
    });

    it('should accept leap year February 29', () => {
      const { form, onSubmit } = addEducation('2020-02-29', '2020-12-01');
      expect(form.find(ERR_MSG_CSS_CLASS).length).to.equal(0);
      expect(onSubmit.called).to.be.true;
      form.unmount();
    });
  });
});
