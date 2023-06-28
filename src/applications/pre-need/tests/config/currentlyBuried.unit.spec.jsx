import sinon from 'sinon';
import { mount } from 'enzyme';
import React from 'react';

import {
  DefinitionTester,
  fillData,
  selectRadio,
} from 'platform/testing/unit/schemaform-utils';
import { mockFetch } from 'platform/testing/unit/helpers';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import formConfig from '../../config/form';

const response = {
  data: [
    {
      id: 915,
      type: 'preneeds_cemeteries',
      attributes: {
        // eslint-disable-next-line camelcase
        cemetery_id: '915',
        name: 'ABRAHAM LINCOLN NATIONAL CEMETERY',
        // eslint-disable-next-line camelcase
        cemetery_type: 'N',
        num: '915',
      },
    },
  ],
};
const middleware = [thunk];
const mockStore = configureStore(middleware);
const store = mockStore(response);

describe('Pre-need burial benefits', () => {
  beforeEach(() => mockFetch());
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.burialBenefits.pages.burialBenefits;

  it('should add another currently buried person', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <Provider store={store}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          onSubmit={onSubmit}
          uiSchema={uiSchema}
        />
      </Provider>,
    );
    selectRadio(form, 'root_application_hasCurrentlyBuried', '1');

    fillData(
      form,
      'input#root_application_currentlyBuriedPersons_0_name_first',
      'test',
    );
    fillData(
      form,
      'input#root_application_currentlyBuriedPersons_0_name_last',
      'test2',
    );

    form.find('.va-growable-add-btn').simulate('click');

    fillData(
      form,
      'input#root_application_currentlyBuriedPersons_1_name_first',
      'test',
    );
    fillData(
      form,
      'input#root_application_currentlyBuriedPersons_1_name_last',
      'test2',
    );

    form.find('form').simulate('submit');

    expect(onSubmit.called).to.be.true;
    form.unmount();
  });

  it('should fill cemetery for currently buried person', done => {
    const onSubmit = sinon.spy();
    const form = mount(
      <Provider store={store}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          onSubmit={onSubmit}
          uiSchema={uiSchema}
        />
      </Provider>,
    );

    selectRadio(form, 'root_application_hasCurrentlyBuried', '1');

    const cemeteryField = form.find(
      'input#root_application_currentlyBuriedPersons_0_cemeteryNumber',
    );
    cemeteryField.simulate('focus').simulate('change', {
      target: { value: 'ABRAHAM LINCOLN NATIONAL CEMETERY' },
    });

    setTimeout(() => {
      cemeteryField
        .simulate('keyDown', { key: 'ArrowDown', keyCode: 40 })
        .simulate('blur');

      // have to pull this again, doesn't work if we use cemeteryField
      expect(
        form
          .find(
            'input#root_application_currentlyBuriedPersons_0_cemeteryNumber',
          )
          .props().value,
      ).to.equal('ABRAHAM LINCOLN NATIONAL CEMETERY');

      form.unmount();
      done();
    });
  });
});
