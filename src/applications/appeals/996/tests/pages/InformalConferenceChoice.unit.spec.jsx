import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';

import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import { $$ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import formConfig from '../../config/form';
import informalConferenceChoice from '../../pages/informalConferenceChoice';

import { mockStore } from '../../../shared/tests/test-helpers';

const { schema, uiSchema } = informalConferenceChoice;

describe('Higher-Level Review 0996 informal conference', () => {
  it('should render informal conference choice form', () => {
    const { container } = render(
      <Provider store={mockStore()}>
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          data={{}}
          formData={{}}
          uiSchema={uiSchema}
        />
      </Provider>,
    );

    expect($$('va-radio-option', container).length).to.equal(2);
  });
});
