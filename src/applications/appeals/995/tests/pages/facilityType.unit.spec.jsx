import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import readableList from 'platform/forms-system/src/js/utilities/data/readableList';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import formConfig from '../../config/form';
import {
  facilityTypeChoices,
  facilityTypeList,
  facilityTypeReviewField as ReviewField,
} from '../../content/facilityTypes';

describe('Supplemental Claims option for facility type page', () => {
  const { schema, uiSchema } = formConfig.chapters.evidence.pages.facilityTypes;

  it('should render', () => {
    const onSubmitSpy = sinon.spy();
    const { container } = render(
      <DefinitionTester
        definitions={{}}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
        onSubmit={onSubmitSpy}
      />,
    );

    const group = $('va-checkbox-group', container);
    expect(group.getAttribute('required')).to.eq('true');
    expect(group.getAttribute('label-header-level')).to.eq('3');
    expect($$('va-checkbox', container).length).to.eq(6);

    fireEvent.click($('button[type="submit"]', container));

    expect($('va-checkbox-group[error]', container)).to.exist;
    expect(onSubmitSpy.called).to.be.false;
  });

  it('should submit when a checkbox is checked', () => {
    const onSubmitSpy = sinon.spy();
    const { container } = render(
      <DefinitionTester
        definitions={{}}
        schema={schema}
        uiSchema={uiSchema}
        data={{ facilityTypes: { vamc: true } }}
        formData={{}}
        onSubmit={onSubmitSpy}
      />,
    );

    fireEvent.click($('button[type="submit"]', container));

    expect($('va-checkbox-group[error]', container)).to.not.exist;
    expect(onSubmitSpy.called).to.be.true;
  });

  it('should submit when the "other" input is filled', () => {
    const onSubmitSpy = sinon.spy();
    const { container } = render(
      <DefinitionTester
        definitions={{}}
        schema={schema}
        uiSchema={uiSchema}
        data={{ facilityTypes: { other: 'test' } }}
        formData={{}}
        onSubmit={onSubmitSpy}
      />,
    );

    fireEvent.click($('button[type="submit"]', container));

    expect($('va-checkbox-group[error]', container)).to.not.exist;
    expect(onSubmitSpy.called).to.be.true;
  });
});

describe('facilityTypeList', () => {
  it('should render and show single choice', () => {
    const data = { vamc: true };
    expect(facilityTypeList(data)).to.eq(facilityTypeChoices.vamc);
  });

  it('should render two choices', () => {
    const data = { ccp: true, nonVa: true };
    const result = readableList(
      Object.keys(data).map(
        key => facilityTypeChoices[key]?.title || facilityTypeChoices[key],
      ),
    );
    expect(facilityTypeList(data)).to.eq(result);
  });

  it('should render multiple choices', () => {
    const data = { vetCenter: true, cboc: true, mtf: true };
    const result = readableList(
      Object.keys(data).map(
        key => facilityTypeChoices[key]?.title || facilityTypeChoices[key],
      ),
    );
    expect(facilityTypeList(data)).to.eq(result);
  });

  it('should render an unknown choice message', () => {
    const data = { vamc: true, other: 'testing', other2: true };
    const result = `${
      facilityTypeChoices.vamc
    }, testing, and Unknown facility type choice`;
    expect(facilityTypeList(data)).to.eq(result);
  });
});

describe('facilityTypeReviewField', () => {
  it('should render and show single choice', () => {
    const data = { vamc: true };
    const { container } = render(<ReviewField formData={data} />);
    expect($('dd', container).textContent).to.eq(facilityTypeChoices.vamc);
  });

  it('should render two choices', () => {
    const data = { ccp: true, nonVa: true };
    const result = readableList(
      Object.keys(data).map(
        key => facilityTypeChoices[key]?.title || facilityTypeChoices[key],
      ),
    );
    const { container } = render(<ReviewField formData={data} />);
    expect($('dd', container).textContent).to.eq(result);
  });

  it('should render multiple choices', () => {
    const data = { vetCenter: true, cboc: true, mtf: true };
    const result = readableList(
      Object.keys(data).map(
        key => facilityTypeChoices[key]?.title || facilityTypeChoices[key],
      ),
    );
    const { container } = render(<ReviewField formData={data} />);
    expect($('dd', container).textContent).to.eq(result);
  });

  it('should render an unknown choice message', () => {
    const data = { vamc: true, other: 'testing', other2: true };
    const result = `${
      facilityTypeChoices.vamc
    }, testing, and Unknown facility type choice`;
    const { container } = render(<ReviewField formData={data} />);
    expect($('dd', container).textContent).to.eq(result);
  });
});
