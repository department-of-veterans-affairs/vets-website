import React from 'react';
import sinon from 'sinon';
import { render, waitFor, cleanup } from '@testing-library/react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import createCommonStore from '@department-of-veterans-affairs/platform-startup/store';
import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../../../config/form';

// const scrollSpy = sinon.spy();

// before(() => {
//   Element.prototype.scrollIntoView = scrollSpy;
// });

const defaultStore = createCommonStore();
const baseFormData = {
  'view:selectable686Options': { addChild: true },
  childrenToAdd: [{}],
};

describe('686 add child relationship step two', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.addChild.pages.addChildRelationshipPartTwo;

  const scrollSpy = sinon.spy();

  before(() => {
    Element.prototype.scrollIntoView = scrollSpy;
  });

  afterEach(() => {
    cleanup();
  });

  it('should render', () => {
    const form = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={baseFormData}
          arrayPath="childrenToAdd"
          pagePerItemIndex={0}
        />
      </Provider>,
    );
    const formDOM = getFormDOM(form);
    expect(formDOM.querySelectorAll('va-checkbox').length).to.eq(2);
  });

  it('should scroll checkboxes into view when evidence appears', async () => {
    let form = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={baseFormData}
          arrayPath="childrenToAdd"
          pagePerItemIndex={0}
        />
      </Provider>,
    );
    let formDOM = getFormDOM(form);

    const group = formDOM.querySelector('.relationship-checkbox-group');
    expect(group).to.exist;
    group.getBoundingClientRect = () => ({
      top: -100, // Simulate "above the viewport"
      bottom: -50,
      left: 0,
      right: 0,
      width: 100,
      height: 50,
    });

    const checkedData = {
      ...baseFormData,
      relationshipToChild: { adopted: true },
    };

    form = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={checkedData}
          arrayPath="childrenToAdd"
          pagePerItemIndex={0}
        />
      </Provider>,
    );
    formDOM = getFormDOM(form);

    await waitFor(() => {
      expect(formDOM.textContent).to.include(
        'Based on your answers, you’ll need to submit additional evidence',
      );
    });

    if (group.scrollIntoView)
      group.scrollIntoView({ behavior: 'smooth', block: 'start' });

    await waitFor(() => {
      expect(scrollSpy.called).to.be.true;
    });
  });
});
