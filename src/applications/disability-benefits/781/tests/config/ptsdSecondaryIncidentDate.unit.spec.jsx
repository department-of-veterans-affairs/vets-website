import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import { DefinitionTester, // selectCheckbox 
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
  });
});
