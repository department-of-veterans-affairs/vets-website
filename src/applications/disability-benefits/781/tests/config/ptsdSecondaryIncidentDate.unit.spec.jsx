import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import { DefinitionTester, fillDate
} from '../../../../../platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../config/form.js';

describe('781a Incident Date', () => {
  const page = formConfig.chapters.introductionPage.pages.ptsdSecondaryIncidentDate;
  const { schema, uiSchema, arrayPath } = page;

  it('should render', () => {
    const form = mount(<DefinitionTester
      arrayPath={arrayPath}
      pagePerItemIndex={0}
      definitions={formConfig.defaultDefinitions}
      schema={schema}
      data={{}}
      uiSchema={uiSchema}/>
    );
    expect(form.find('input').length).to.equal(1);
    expect(form.find('select').length).to.equal(2);
  });

  it('should fill in incident date', () => {
    const onSubmit = sinon.spy();
    const form = mount(<DefinitionTester
      arrayPath={arrayPath}
      pagePerItemIndex={0}
      onSubmit={onSubmit}
      definitions={formConfig.defaultDefinitions}
      schema={schema}
      data={{
        ptsdSecondaryIncidentDate: ''
      }}
      uiSchema={uiSchema}/>
    );

    fillDate(form, 'root_secondaryIncidentDate', '2016-07-10');
    form.find('form').simulate('submit');

    expect(form.find('.usa-input-error-message').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });
  it('should allow submission if no incident date submitted', () => {
    const onSubmit = sinon.spy();
    const form = mount(<DefinitionTester
      arrayPath={arrayPath}
      pagePerItemIndex={0}
      onSubmit={onSubmit}
      definitions={formConfig.defaultDefinitions}
      schema={schema}
      data={{
        ptsdSecondaryIncidentDate: ''
      }}
      formData={{
        ptsdSecondaryIncidentDate: ''
      }}
      uiSchema={uiSchema}/>);

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(0);
    expect(onSubmit.called).to.be.true;

  });
});
