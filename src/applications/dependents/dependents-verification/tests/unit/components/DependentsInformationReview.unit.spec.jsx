import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { Provider } from 'react-redux';

import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import { DependentsInformationReview } from '../../../components/DependentsInformationReview';
import { defaultData } from './dependent-data';
import { calculateAge } from '../../../../shared/utils';

function renderPage({ data = defaultData, goToPath = () => {} } = {}) {
  const mockStore = {
    getState: () => ({
      form: { data },
    }),
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
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    if (sandbox) {
      sandbox.restore();
    }
  });

  it('renders all sections with prefilled data', () => {
    const { container } = renderPage();

    expect($$('h4', container).map(h4 => h4.textContent)).to.deep.equal([
      'Morty Smith',
      'Summer Smith',
      'Has the status of your dependents changed?',
    ]);
    const text = $$('.review-row', container).map(row => row.textContent);
    const child1 = calculateAge(defaultData.dependents[0].dateOfBirth);
    const child2 = calculateAge(defaultData.dependents[1].dateOfBirth);

    expect(text).to.deep.equal([
      'Social Security number●●●–●●-6791ending with 6 7 9 1',
      `Date of birth${child1.dobStr}`,
      `Age${child1.labeledAge}`,
      'RelationshipChild',
      'Social Security number●●●–●●-6790ending with 6 7 9 0',
      `Date of birth${child2.dobStr}`,
      `Age${child2.labeledAge}`,
      'RelationshipChild',
      'Has the status of your dependents changed?Yes, I need to update my dependents’ information.',
    ]);
    expect(
      $$('.dd-privacy-hidden[data-dd-action-name]', container),
    ).to.have.lengthOf(10);
  });

  it('should render "No dependents found" when no dependents are present', () => {
    const { container } = renderPage({
      data: { dependents: [], hasDependentsStatusChanged: 'Y' },
    });

    expect(container.textContent).to.contain('No dependents found');
    expect($('.review-row', container).textContent).to.include(
      'Has the status of your dependents changed?Yes',
    );
  });

  it('should redirect edit button to dependents page', async () => {
    const goToPathSpy = sandbox.spy();
    const { container } = renderPage({ data: null, goToPath: goToPathSpy });

    await waitFor(() => {
      fireEvent.click($('va-button[text="Edit"]', container));
      expect(goToPathSpy.calledWith('/dependents')).to.be.true;
    });
  });
});
