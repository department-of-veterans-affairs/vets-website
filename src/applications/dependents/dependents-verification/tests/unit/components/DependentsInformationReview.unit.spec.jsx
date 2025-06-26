import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { Provider } from 'react-redux';

import { $$ } from 'platform/forms-system/src/js/utilities/ui';

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
      'Has the status of your dependents changedNo',
    ]);
  });
});
