import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import TitleField from '../../../src/js/fields/TitleField';

describe('Schemaform <TitleField>', () => {
  it('should render legend for root', () => {
    const { container } = render(
      <TitleField id="root__title" title="foo" />,
    );
    expect(container.querySelector('legend')).not.to.be.null;
  });
  it('should render h3 for root', () => {
    const useHeaderStyling = true;
    const { container } = render(
      <TitleField
        id="root__title"
        title="foo"
        useHeaderStyling={useHeaderStyling}
      />,
    );
    expect(container.querySelector('h3')).not.to.be.null;
  });
  it('should not render h3 for root', () => {
    const useHeaderStyling = false;
    const { container } = render(
      <TitleField
        id="root__title"
        title="foo"
        useHeaderStyling={useHeaderStyling}
      />,
    );
    expect(container.querySelector('h3')).to.be.null;
  });
  it('should render subtitle for non-root', () => {
    const Foo = () => <div>Foo</div>;
    const { container } = render(
      <TitleField id="root_someField" title={<Foo />} />,
    );
    expect(container.querySelector('.schemaform-block-subtitle')).not.to.be.null;
  });
  it('should not render anything if no title is provided', () => {
    const { container } = render(<TitleField id="root__title" />);
    expect(container.firstChild).to.be.null;
  });
});
