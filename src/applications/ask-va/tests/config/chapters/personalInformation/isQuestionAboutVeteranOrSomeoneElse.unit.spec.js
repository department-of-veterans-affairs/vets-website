import { $$ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import { Provider } from 'react-redux';

import formConfig from '../../../../config/form';
import { getData } from '../../../fixtures/data/mock-form-data';
import { removeReqFromLabel } from '../../../fixtures/test-helpers/helpers';

const {
  schema,
  uiSchema,
} = formConfig.chapters.aboutSomeoneElseRelationshipFamilyMember.pages.isQuestionAboutVeteranOrSomeoneElse_aboutsomeoneelserelationshipfamilymember;

describe('isQuestionAboutVeteranOrSomeoneElsePage', () => {
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

    const radioLabels = $$('.form-radio-buttons > label', container);
    const radioLabelList = ['Veteran', 'Someone else'];

    const vaRadio = container.querySelector('va-radio');
    expect(vaRadio.getAttribute('label')).to.equal(
      'Is your question about the Veteran or someone else?',
    );

    radioLabels.forEach(
      radio =>
        expect(radioLabelList.includes(removeReqFromLabel(radio.textContent)))
          .to.be.true,
    );
  });
});
