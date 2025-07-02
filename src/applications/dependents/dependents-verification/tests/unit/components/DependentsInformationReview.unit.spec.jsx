import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { Provider } from 'react-redux';

import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import { DependentsInformationReview } from '../../../components/DependentsInformationReview';

import { defaultData } from './dependent-data';

function renderPage({ data = defaultData, goToPath = () => {} } = {}) {
  const mockStore = {
    getState: () => {},
    dispatch: () => {},
    subscribe: () => {},
  };
  return render(
    <Provider store={mockStore}>
      <DependentsInformationReview data={data} goToPath={goToPath} />
    </Provider>,
  );
}

describe('DependentsInformationReview', () => {
  it('renders all sections with prefilled data', () => {
    const { container } = renderPage();

    const text = $$('.review-row', container).map(row => row.textContent);
    expect(text).to.deep.equal([
      'First nameMorty',
      'Middle nameCharles',
      'Last nameSmith',
      'SuffixNone',
      'Social Security number●●●–●●-6791ending with 6 7 9 1',
      'Date of birthJanuary 4, 2011',
      'Age14 years old',
      'RelationshipChild',
      'First nameSummer',
      'Middle nameSusan',
      'Last nameSmith',
      'SuffixNone',
      'Social Security number●●●–●●-6790ending with 6 7 9 0',
      'Date of birthAugust 1, 2008',
      'Age17 years old',
      'RelationshipChild',
      'Is your dependent information correct?Yes, my dependent information is correct.',
    ]);
    expect(
      $$('.dd-privacy-mask[data-dd-action-name]', container),
    ).to.have.lengthOf(14);
  });

  it('should render "No dependents found" when no dependents are present', () => {
    const { container } = renderPage({
      data: { dependents: [], hasDependentsStatusChanged: 'Y' },
    });

    expect(container.textContent).to.contain('No dependents found');
    expect($('.review-row', container).textContent).to.include(
      'Is your dependent information correct?Yes',
    );
  });

  it('should redirect edit button to dependents page', async () => {
    const goToPathSpy = sinon.spy();
    const { container } = renderPage({ data: null, goToPath: goToPathSpy });

    await fireEvent.click($('va-button[text="Edit"]', container));

    expect(goToPathSpy.calledWith('/dependents')).to.be.true;
  });
});
