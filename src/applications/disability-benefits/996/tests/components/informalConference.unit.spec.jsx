import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';

import formConfig from '../../config/form';
import informalConference from '../../pages/informalConference';
import initialData from '../schema/initialData';

const { schema, uiSchema } = informalConference;
const nextStep = '4';

// TO-DO: Test scheduleTimes validation... not working currently

describe('Higher-Level Review 0996 informal conference', () => {
  it('should render informal conference form', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{}}
        formData={{}}
        uiSchema={uiSchema}
      />,
    );

    // Yes/No choice for informal conference
    expect(form.find('input[type="radio"]').length).to.equal(2);
    form.unmount();
  });

  it('should show the call representative choice', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{
          veteran: {
            informalConferenceChoice: true,
          },
        }}
        formData={{}}
        uiSchema={uiSchema}
      />,
    );

    // Yes/No choice for informal conference & call representative
    expect(form.find('input[type="radio"]').length).to.equal(4);
    expect(
      form.find('#root_veteran_informalConferenceChoiceYes').props().checked,
    ).to.be.true;
    form.unmount();
  });

  it('should show the call representative name & phone inputs and time checkboxes', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{
          veteran: {
            informalConferenceChoice: true,
            contactRepresentativeChoice: true,
          },
        }}
        formData={{}}
        uiSchema={uiSchema}
      />,
    );

    // 4 Radio: Yes/No choice for informal conference & call representative
    // 2 inputs (text + tel): rep name & phone
    // 4 checkboxes - time period
    expect(form.find('input').length).to.equal(10);
    form.unmount();
  });

  it('should show the call representative name & phone info', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{
          veteran: {
            informalConferenceChoice: true,
            contactRepresentativeChoice: true,
            representative: {
              fullName: 'John Doe',
              phone: '800 555-1212',
            },
          },
        }}
        formData={{}}
        uiSchema={uiSchema}
      />,
    );

    expect(form.find('input[type="text"]').props().value).to.equal('John Doe');
    expect(form.find('input[type="tel"]').props().value).to.equal(
      '800 555-1212',
    );
    form.unmount();
  });

  it('should show the time checkboxes', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{
          veteran: {
            informalConferenceChoice: true,
            contactRepresentativeChoice: false,
          },
        }}
        formData={{}}
        uiSchema={uiSchema}
      />,
    );

    // 4 Radio: Yes/No choice for informal conference & call representative
    // 4 checkboxes - time period
    expect(form.find('input').length).to.equal(8);
    form.unmount();
  });

  /* Successful submits */
  it('successfully submits when no informal conference is selected', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={initialData}
        formData={{}}
        uiSchema={uiSchema}
      />,
    );

    // Simulating a click event doesn't trigger onChange, so we have to call it
    // explicitly
    form
      .find('input#root_veteran_informalConferenceChoiceNo')
      .props()
      .onChange({ target: { checked: true } });
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);

    setTimeout(() => {
      // Check header content to see if we're on the next step
      const text = form.find('.form-process-step.current').text();
      expect(text).to.equal(nextStep);
      form.unmount();
    }, 500);
  });

  it('successfully submits when a conference & time is selected', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{
          veteran: {
            informalConferenceChoice: true,
            contactRepresentativeChoice: false,
            scheduleTimes: {
              time1000to1200: true,
            },
          },
        }}
        formData={{}}
        uiSchema={uiSchema}
      />,
    );

    // Simulating a click event doesn't trigger onChange, so we have to call it
    // explicitly
    form
      .find('input#root_veteran_informalConferenceChoiceYes')
      .props()
      .onChange({ target: { checked: true } });
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);

    setTimeout(() => {
      // Check header content to see if we're on the next step
      const text = form.find('.form-process-step.current').text();
      expect(text).to.equal(nextStep);
      form.unmount();
    }, 500);
  });

  it('successfully submits when a conference w/rep & time is selected', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{
          veteran: {
            informalConferenceChoice: true,
            contactRepresentativeChoice: true,
            representative: {
              fullName: 'John Doe',
              phone: '8005551212',
            },
            scheduleTimes: {
              time1000to1200: true,
            },
          },
        }}
        formData={{}}
        uiSchema={uiSchema}
      />,
    );

    // Simulating a click event doesn't trigger onChange, so we have to call it
    // explicitly
    form
      .find('input#root_veteran_informalConferenceChoiceYes')
      .props()
      .onChange({ target: { checked: true } });
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);

    setTimeout(() => {
      // Check header content to see if we're on the next step
      const text = form.find('.form-process-step.current').text();
      expect(text).to.equal(nextStep);
      form.unmount();
    }, 500);
  });

  /* Unsuccessful submits */
  it('prevents submit when informal conference is not selected', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{}}
        formData={{}}
        uiSchema={uiSchema}
      />,
    );

    // Simulating a click event doesn't trigger onChange, so we have to call it
    // explicitly
    // form
    //   .find('input#root_veteran_informalConferenceChoiceYes')
    //   .props()
    //   .onChange({ target: { checked: true } });
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(1);

    setTimeout(() => {
      // Check header content to see if we're on the next step
      const text = form.find('.form-process-step.current').text();
      expect(text).to.not.equal(nextStep);
      form.unmount();
    }, 500);
  });

  it('prevents submit when call rep is not selected', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{
          veteran: {
            informalConferenceChoice: true,
          },
        }}
        formData={{}}
        uiSchema={uiSchema}
      />,
    );

    // Simulating a click event doesn't trigger onChange, so we have to call it
    // explicitly
    form
      .find('input#root_veteran_informalConferenceChoiceYes')
      .props()
      .onChange({ target: { checked: true } });
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(1);

    setTimeout(() => {
      // Check header content to see if we're on the next step
      const text = form.find('.form-process-step.current').text();
      expect(text).to.not.equal(nextStep);
      form.unmount();
    }, 500);
  });

  it('prevents submit when no time is selected', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{
          veteran: {
            informalConferenceChoice: true,
            contactRepresentativeChoice: false,
            scheduleTimes: {},
          },
        }}
        formData={{}}
        uiSchema={uiSchema}
      />,
    );

    // Simulating a click event doesn't trigger onChange, so we have to call it
    // explicitly
    form
      .find('input#root_veteran_informalConferenceChoiceYes')
      .props()
      .onChange({ target: { checked: true } });
    form.find('form').simulate('submit');

    // Choose at least one time period error message
    expect(form.find('.usa-input-error').length).to.equal(1);

    setTimeout(() => {
      // Check header content to see if we're on the next step
      const text = form.find('.form-process-step.current').text();
      expect(text).to.not.equal(nextStep);
      form.unmount();
    }, 500);
  });
});
