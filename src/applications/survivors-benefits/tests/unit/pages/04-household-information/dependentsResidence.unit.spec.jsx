import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import page from '../../../../config/chapters/04-household-information/dependentsResidence';

describe('Dependents Residence page', () => {
  const { schema, uiSchema } = page;
  it('displays residenceAlert childrenLiveTogetherButNotWithSpouse is No', () => {
    const form = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        data={{ veteranChildrenCount: '2' }}
      />,
    );
    const formDOM = getFormDOM(form);
    const vaRadio = $(
      'va-radio[label*="Do the children who don’t live with you reside at the same address?"]',
      formDOM,
    );
    expect($$('va-alert-expandable', formDOM).length).to.equal(0);
    vaRadio.__events.vaValueChange({
      detail: { value: 'Y' },
    });
    expect($$('va-alert-expandable', formDOM).length).to.equal(0);
    vaRadio.__events.vaValueChange({
      detail: { value: 'N' },
    });
    expect($$('va-alert-expandable', formDOM).length).to.equal(1);
  });
});
