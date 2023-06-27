import React from 'react';
import { expect } from 'chai';
import { fireEvent, render } from '@testing-library/react';
import sinon from 'sinon';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import formConfig from '../../config/form';
import informalConference from '../../pages/informalConference';
import { InformalConferenceTitle } from '../../content/InformalConference';

const { schema, uiSchema } = informalConference;

describe('Higher-Level Review 0996 informal conference', () => {
  it('should render informal conference form', () => {
    const { container } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{}}
        formData={{}}
        uiSchema={uiSchema}
      />,
    );

    expect($$('input[type="radio"]', container).length).to.equal(3);
  });

  /* Successful submits */
  it('successfully submits when no informal conference is selected', () => {
    const onSubmit = sinon.spy();
    const { container } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        schema={schema}
        data={{ informalConference: 'no' }}
        formData={{}}
        uiSchema={uiSchema}
      />,
    );

    fireEvent.submit($('form', container));
    expect($$('.usa-input-error', container).length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });

  /* Unsuccessful submits */
  it('prevents submit when informal conference is not selected', () => {
    const onSubmit = sinon.spy();
    const { container } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        schema={schema}
        data={{}}
        formData={{}}
        uiSchema={uiSchema}
      />,
    );

    fireEvent.submit($('form', container));
    expect($$('.usa-input-error', container).length).to.equal(1);
    expect(onSubmit.called).not.to.be.true;
  });

  it('should capture google analytics', () => {
    global.window.dataLayer = [];
    const { container } = render(
      <DefinitionTester
        definitions={{}}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
        onSubmit={() => {}}
      />,
    );

    fireEvent.click($('input[value="me"]', container));

    const event = global.window.dataLayer.slice(-1)[0];
    expect(event).to.deep.equal({
      event: 'int-radio-button-option-click',
      'radio-button-label': InformalConferenceTitle,
      'radio-button-optionLabel': 'me',
      'radio-button-required': true,
    });
  });
});
