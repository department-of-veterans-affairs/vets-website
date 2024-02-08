import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';

import formConfig from '../../../config/form';
import { removeReqFromLabel } from '../../fixtures/test-helpers/helpers';
import { getData } from '../../fixtures/data/mock-form-data';

const {
  schema,
  uiSchema,
} = formConfig.chapters.personalInformation.pages.yourAddress_generalquestion;

describe('yourAddressPage', () => {
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

    const labels = $$('label', container);
    const labelList = [
      'Street address',
      'Street address 2',
      'City',
      'State/Province/Region',
      'Postal code',
    ];

    expect($('h3', container).textContent).to.eq('Your address');
    labels.forEach(
      label =>
        expect(labelList.includes(removeReqFromLabel(label.textContent))).to.be
          .true,
    );
  });

  it('should render with military options', () => {
    const { container, getByLabelText } = render(
      <Provider store={{ ...getData().mockStore }}>
        <DefinitionTester
          definitions={{}}
          schema={schema}
          uiSchema={uiSchema}
          data={{ onBaseOutsideUS: true }}
          formData={{}}
        />
        ,
      </Provider>,
    );

    const postOfficeRadio = getByLabelText('Army post office');
    const regionRadio = getByLabelText('Armed Forces America (AA)');

    expect(postOfficeRadio.checked).to.be.false;
    expect(regionRadio.checked).to.be.false;

    fireEvent.click(postOfficeRadio);
    fireEvent.click(regionRadio);

    expect(postOfficeRadio.checked).to.be.true;
    expect(regionRadio.checked).to.be.true;

    expect($$('input[type="radio"]', container).length).to.eq(6);
  });
});
