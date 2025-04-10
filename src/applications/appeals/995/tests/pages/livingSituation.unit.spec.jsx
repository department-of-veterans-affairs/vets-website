import React from 'react';
import { expect } from 'chai';
import { render, fireEvent, waitFor } from '@testing-library/react';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import readableList from 'platform/forms-system/src/js/utilities/data/readableList';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import formConfig from '../../config/form';

import {
  livingSituationList,
  livingSituationReviewField as ReviewField,
  livingSituationChoices,
  livingSituationChoicesShortened,
  livingSituationError,
} from '../../content/livingSituation';

describe('Supplemental Claims living situation page', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.infoPages.pages.livingSituation;

  it('should render', () => {
    const { container } = render(
      <DefinitionTester
        definitions={{}}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
      />,
    );

    const group = $('va-checkbox-group', container);
    // Not required
    expect(group.getAttribute('required')).to.eq('false');
    expect(group.getAttribute('label-header-level')).to.eq('3'); // h3
    expect($$('va-checkbox', container).length).to.eq(7);
    expect($('va-additional-info', container)).to.exist;

    expect($('button[type="submit"]', container)).to.exist;
  });

  it('should render an h4 on the review & submit page', () => {
    window.location = { pathname: '/review-and-submit' };
    const { container } = render(
      <DefinitionTester
        definitions={{}}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
      />,
    );

    const group = $('va-checkbox-group', container);
    // Not required
    expect(group.getAttribute('required')).to.eq('false');
    expect(group.getAttribute('label-header-level')).to.eq('4'); // h4

    expect($$('va-checkbox', container).length).to.eq(7);
    expect($('va-additional-info', container)).to.exist;

    expect($('button[type="submit"]', container)).to.exist;
  });

  it('should prevent submission & show error if none & any other option selected', () => {
    const data = { notRegular: true, home30Days: true };
    const { container } = render(
      <DefinitionTester
        definitions={{}}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={data}
      />,
    );

    fireEvent.click($('button[type="submit"]', container));

    waitFor(() => {
      expect($('va-checkbox-group', container).getAttribute('error')).to.eq(
        livingSituationError,
      );
    });
  });
});

describe('livingSituationList', () => {
  it('should render and show single choice', () => {
    const data = { facility30Days: true };
    expect(livingSituationList(data)).to.eq(
      livingSituationChoices.facility30Days,
    );
  });
  it('should render two choices', () => {
    const data = { facility30Days: true, other: true };
    const result = readableList(
      Object.keys(data).map(key => livingSituationChoicesShortened[key]),
    );
    expect(livingSituationList(data)).to.eq(result);
  });
  it('should render multiple choices', () => {
    const data = { notRegular: true, shelter: true, friendOrFamily: true };
    const result = readableList(
      Object.keys(data).map(key => livingSituationChoicesShortened[key]),
    );
    expect(livingSituationList(data)).to.eq(result);
  });
});

describe('livingSituationReviewField', () => {
  it('should render and show single choice', () => {
    const data = { facility30Days: true };
    const { container } = render(<ReviewField formData={data} />);

    expect($('dd', container).textContent).to.eq(
      livingSituationChoices.facility30Days,
    );
  });
  it('should render two choices', () => {
    const data = { facility30Days: true, other: true };
    const result = readableList(
      Object.keys(data).map(key => livingSituationChoicesShortened[key]),
    );
    const { container } = render(<ReviewField formData={data} />);

    expect($('dd', container).textContent).to.eq(result);
  });
  it('should render multiple choices', () => {
    const data = { notRegular: true, shelter: true, friendOrFamily: true };
    const result = readableList(
      Object.keys(data).map(key => livingSituationChoicesShortened[key]),
    );
    const { container } = render(<ReviewField formData={data} />);

    expect($('dd', container).textContent).to.eq(result);
  });
});
