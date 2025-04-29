import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import { Provider } from 'react-redux';
import formConfig from '../../../../config/form';
import { useThisSchoolOptions } from '../../../../constants';
import { getData } from '../../../fixtures/data/mock-form-data';

const {
  schema,
  uiSchema,
} = formConfig.chapters.aboutSomeoneElseRelationshipConnectedThroughWorkEducation.pages.useThisSchool_aboutsomeoneelserelationshipconnectedthroughworkeducation;

describe('useThisSchoolPage', () => {
  it('should render', () => {
    const { container } = render(
      <Provider store={{ ...getData().mockStore }}>
        <DefinitionTester
          definitions={{}}
          schema={schema}
          uiSchema={uiSchema}
          data={{}}
          formData={{}}
        />
        ,
      </Provider>,
    );

    const radioLabels = $$('.form-radio-buttons', container);
    const radioLabelList = Object.values(useThisSchoolOptions);

    expect($('h3', container).textContent).to.eq('Your school facility');

    radioLabels.forEach(
      radio => expect(radioLabelList.includes(radio.textContent)).to.be.true,
    );
  });
});
