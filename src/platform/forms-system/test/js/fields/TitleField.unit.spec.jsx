import React from 'react';

import { expect } from 'chai';
import SkinDeep from 'skin-deep';
import { render } from '@testing-library/react';

import TitleField from '../../../src/js/fields/TitleField';

describe('Schemaform <TitleField>', () => {
  it('should render legend for root', () => {
    const tree = SkinDeep.shallowRender(
      <TitleField id="root__title" title="foo" />,
    );
    expect(tree.subTree('legend')).not.to.be.false;
  });
  it('should render subtitle for non-root', () => {
    const Foo = <div>Foo</div>;
    const tree = SkinDeep.shallowRender(
      <TitleField id="root_someField" title={<Foo />} />,
    );
    expect(tree.subTree('.schemaform-block-subtitle')).not.to.be.false;
  });
  it('should not render anything if no title is provided', () => {
    const tree = SkinDeep.shallowRender(<TitleField id="root__title" />);
    expect(tree.subTree('TitleField')).to.be.false;
  });

  it('should render string title as-is', () => {
    const titleOnFormPage = render(
      <TitleField
        id="root__title"
        title="foo"
        formContext={{ onReviewPage: false }}
      />,
    );
    const titleOnReviewPage = render(
      <TitleField
        id="root__title"
        title="foo"
        formContext={{ onReviewPage: true }}
      />,
    );

    expect(titleOnFormPage.findByText('foo', { selector: 'legend' })).to.exist;
    expect(titleOnReviewPage.findByText('foo', { selector: 'legend' })).to
      .exist;
  });

  it('should render React-element title as-is on form page', async () => {
    const Foo = <div>Foo</div>;
    const titleOnFormPage = await render(
      <TitleField
        id="root__title"
        title={Foo}
        formContext={{ onReviewPage: false }}
      />,
    );

    expect(titleOnFormPage.findByText('Foo', { selector: 'legend > div' })).to
      .exist;
  });

  it('should render React-element title with h4 on review page', async () => {
    const Foo = <h3>Foo</h3>;
    const titleOnReviewPage = await render(
      <TitleField
        id="root__title"
        title={Foo}
        f
        ormContext={{ onReviewPage: true }}
      />,
    );

    expect(
      titleOnReviewPage.findByText('Foo', {
        selector: 'legend > h4',
      }),
    ).to.exist;
  });
});
