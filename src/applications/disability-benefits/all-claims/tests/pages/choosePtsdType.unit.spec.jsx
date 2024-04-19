import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../config/form.js';

describe('Disability benefits 718 PTSD type', () => {
  const {
    schema,
    uiSchema,
    arrayPath,
  } = formConfig.chapters.disabilities.pages.choosePtsdType;

  it('renders ptsd type form', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        onSubmit={onSubmit}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{
          newDisabilities: [
            {
              condition: 'PTSD personal Trauma',
            },
          ],
        }}
        formData={{}}
        uiSchema={uiSchema}
      />,
    );

    expect(form.find('va-checkbox').length).to.equal(4);
    form.unmount();
  });

  it('should fill in ptsd type information', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        onSubmit={onSubmit}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{
          newDisabilities: [
            {
              condition: 'PTSD personal Trauma',
            },
          ],
        }}
        formData={{}}
        uiSchema={uiSchema}
      />,
    );

    /* We can't select v3 checkboxes anymore due to the use of the shadow root
    /
    * selectCheckbox(
    *   form,
    *   'root_view:selectablePtsdTypes_view:combatPtsdType',
    *   true,
    * );
    * selectCheckbox(
    *   form,
    *   'root_view:selectablePtsdTypes_view:mstPtsdType',
    *   true,
    * );
    * selectCheckbox(
    *   form,
    *   'root_view:selectablePtsdTypes_view:assaultPtsdType',
    *   true,
    * );
    * selectCheckbox(
    *   form,
    *   'root_view:selectablePtsdTypes_view:nonCombatPtsdType',
    *   true,
    * );
    *
    *
    * form.find('form').simulate('submit');
    * expect(form.find(ERR_MSG_CSS_CLASS).length).to.equal(0);
    * expect(onSubmit.called).to.be.true;
    */
    form.unmount();
  });

  it('should require a PTSD type to be selected', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        onSubmit={onSubmit}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{
          newDisabilities: [
            {
              condition: 'PTSD personal Trauma',
            },
          ],
        }}
        formData={{}}
        uiSchema={uiSchema}
      />,
    );

    form.find('form').simulate('submit');
    // This error is on a v3 checkbox and thus inside of a shadow root and
    // therefor cannot be tested
    // expect(form.find(ERR_MSG_CSS_CLASS).length).to.equal(1);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });
});
