import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { ERR_MSG_CSS_CLASS } from '../../constants';

import {
  DefinitionTester,
  fillData,
  fillDate,
  selectRadio,
} from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../config/form';

describe('781 individuals involved', () => {
  const page =
    formConfig.chapters.disabilities.pages.individualsInvolvedFollowUp0;
  const { schema, uiSchema, arrayPath } = page;

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{
          'view:selectablePtsdTypes': {
            'view:combatPtsdType': true,
          },
        }}
        uiSchema={uiSchema}
      />,
    );
    expect(form.find('input').length).to.equal(11);
    expect(form.find('select').length).to.equal(2);
    expect(form.find('textarea').length).to.equal(1);
    form.unmount();
  });

  it('should submit when no data is filled out', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          'view:selectablePtsdTypes': {
            'view:combatPtsdType': true,
          },
        }}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find(ERR_MSG_CSS_CLASS).length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });

  it('should add another individual involved', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          'view:selectablePtsdTypes': {
            'view:combatPtsdType': true,
          },
        }}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );
    fillData(form, 'input#root_incident0_personsInvolved_0_name_first', 'John');
    fillData(form, 'input#root_incident0_personsInvolved_0_name_last', 'Doe');
    fillData(
      form,
      'input#root_incident0_personsInvolved_0_name_middle',
      'Phil',
    );
    fillData(
      form,
      'textarea#root_incident0_personsInvolved_0_description',
      '6ft tall brown hair green eyes.',
    );

    selectRadio(
      form,
      'root_incident0_personsInvolved_0_view:serviceMember',
      'Y',
    );

    fillData(form, 'input#root_incident0_personsInvolved_0_rank', 'First Sgt.');
    fillData(
      form,
      'input#root_incident0_personsInvolved_0_unitAssigned',
      '101st Airborne',
    );
    fillDate(
      form,
      'root_incident0_personsInvolved_0_injuryDeathDate',
      '2010-05-05',
    );

    selectRadio(form, 'root_incident0_personsInvolved_0_injuryDeath', 'other');

    fillData(
      form,
      'input#root_incident0_personsInvolved_0_injuryDeathOther',
      'lorem ipsum',
    );

    form.find('.va-growable-add-btn').simulate('click');

    expect(
      form
        .find('.va-growable-background')
        .first()
        .text(),
    ).to.contain('John Doe');

    form.find('form').simulate('submit');
    expect(form.find(ERR_MSG_CSS_CLASS).length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
});
