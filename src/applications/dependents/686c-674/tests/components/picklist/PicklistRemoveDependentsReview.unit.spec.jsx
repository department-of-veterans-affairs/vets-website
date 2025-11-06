import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';

import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import PicklistRemoveDependentsReview from '../../../components/picklist/PicklistRemoveDependentsReview';

import { PICKLIST_DATA } from '../../../config/constants';
import { createDoB } from '../../test-helpers';

describe('PicklistRemoveDependentsReview', () => {
  const defaultData = (checked = true) => ({
    [PICKLIST_DATA]: [
      {
        key: 'spousy-1234',
        fullName: {
          first: 'SPOUSY',
          last: 'FOSTER',
        },
        dateOfBirth: createDoB(45),
        age: 45,
        labeledAge: '45 years old',
        ssn: '000111234',
        relationshipToVeteran: 'Spouse',
        selected: true,
        awardIndicator: 'Y',
      },
      {
        key: 'penny-1234',
        fullName: {
          first: 'PENNY',
          last: 'FOSTER',
        },
        dateOfBirth: createDoB(11),
        age: 11,
        labeledAge: '11 years old',
        ssn: '000111234',
        relationshipToVeteran: 'Child',
        selected: checked,
        awardIndicator: 'Y',
      },
      {
        key: 'stacy-1234',
        fullName: {
          first: 'STACY',
          last: 'FOSTER',
        },
        dateOfBirth: createDoB(0, 3),
        age: 0,
        labeledAge: '3 months old',
        ssn: '000111234',
        relationshipToVeteran: 'Child',
        selected: true,
        awardIndicator: 'Y',
      },
      {
        key: 'peter-1234',
        fullName: {
          first: 'PETER',
          last: 'FOSTER',
        },
        dateOfBirth: createDoB(82),
        age: 82,
        labeledAge: '82 years old',
        ssn: '000111234',
        relationshipToVeteran: 'Parent',
        selected: true,
        awardIndicator: 'Y',
      },
    ],
  });

  const renderComponent = ({
    data = defaultData(),
    goToPath = () => {},
  } = {}) =>
    render(<PicklistRemoveDependentsReview data={data} goToPath={goToPath} />);

  it('should render an error message if no dependents are selected', () => {
    const { container } = render(<PicklistRemoveDependentsReview />);

    expect('.usa-input-error-message', container).to.exist;
  });

  it('should render selected dependents from picklist', () => {
    const { container } = renderComponent();
    const cards = $$('va-card', container);

    expect($('h4', container).textContent).to.equal(
      'Dependents you would like to remove',
    );
    expect('va-button.edit-page', container).to.exist;
    expect(
      $$('.dd-privacy-mask[data-dd-action-name]', container).length,
    ).to.equal(4);
    expect($$('va-card h5').map(cb => cb.textContent)).to.deep.equal([
      'SPOUSY FOSTER',
      'PENNY FOSTER',
      'STACY FOSTER',
      'PETER FOSTER',
    ]);
    expect(cards.length).to.equal(4);
    expect(cards.map(cb => cb.textContent)).to.deep.equal([
      'SPOUSY FOSTERSpouse, 45 years old',
      'PENNY FOSTERChild, 11 years old',
      'STACY FOSTERChild, 3 months old',
      'PETER FOSTERParent, 82 years old',
    ]);
  });

  it('should render only the selected cards', () => {
    const { container } = renderComponent({ data: defaultData(false) });

    const cards = $$('va-card', container);
    expect(cards.length).to.equal(3);

    expect(cards.map(cb => cb.textContent)).to.deep.equal([
      'SPOUSY FOSTERSpouse, 45 years old',
      'STACY FOSTERChild, 3 months old',
      'PETER FOSTERParent, 82 years old',
    ]);
  });

  it('should go to the picklist page when clicking the edit button', () => {
    const goToPath = sinon.spy();
    const { container } = renderComponent({ goToPath });

    const editButton = $('va-button.edit-page', container);
    expect(editButton).to.exist;

    fireEvent.click(editButton);
    expect(goToPath.calledOnce).to.be.true;
    expect(goToPath.firstCall.args[0]).to.equal(
      '/options-selection/remove-active-dependents',
    );
  });
});
