import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render } from '@testing-library/react';
import { content } from '../../../content/evidence/summary';
import * as helpers from '../../../../shared/utils/helpers';

describe('summary', () => {
  it('should render an h5 on the review page', () => {
    const isOnReviewPageStub = sinon
      .stub(helpers, 'isOnReviewPage')
      .returns(true);

    const { getByRole } = render(<div>{content.addMoreLink()}</div>);
    expect(getByRole('heading').tagName).to.eq('H5');
    isOnReviewPageStub.restore();
  });
});
