import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import { Provider } from 'react-redux';
import { getData } from '../mocks/mockFormData';
import giBillStatusConfig from '../../../pages/giBillStatus';

describe('giBill page', () => {
  it('should render the correct radio component', () => {
    const { container } = render(
      <Provider store={{ ...getData().mockStore }}>
        <DefinitionTester
          definitions={{}}
          schema={giBillStatusConfig.schema}
          uiSchema={giBillStatusConfig.uiSchema}
          data={{}}
          formData={{}}
        />
        ,
      </Provider>,
    );

    expect($('va-radio', container)).to.exist;
  });
});
