import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { submitHandler, pageTitle } from '../../../utils/helpers';

describe('submitHandler method', () => {
  it('should return from the function', () => {
    const click = sinon.mock();
    sinon.stub(document, 'getElementById').returns({ click });

    expect(submitHandler()).to.be.empty;
    expect(click.called).to.be.true;
  });
});

describe('pageTitle method', () => {
  it('should return react fragment with a title and subtitle', () => {
    const element = pageTitle('title', 'subtitle');
    const { container } = render(element);

    expect(container.querySelectorAll('p')).to.have.lengthOf(2);
  });

  it('can return react fragment with only a title and no subtitle', () => {
    const element = pageTitle('title');
    const { container } = render(element);

    expect(container.querySelectorAll('p')).to.have.lengthOf(1);
  });
});
