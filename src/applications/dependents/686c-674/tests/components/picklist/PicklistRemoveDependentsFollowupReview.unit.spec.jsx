import React from 'react';
import { expect } from 'chai';
import { render, fireEvent, waitFor } from '@testing-library/react';
import sinon from 'sinon';

import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import PicklistRemoveDependentFollowupReview from '../../../components/picklist/PicklistRemoveDependentFollowupReview';

import {
  PICKLIST_DATA,
  PICKLIST_EDIT_REVIEW_FLAG,
} from '../../../config/constants';
import { createDoB } from '../../test-helpers';

describe('PicklistRemoveDependentFollowupReview', () => {
  const defaultData = (selected = []) => ({
    [PICKLIST_DATA]: [
      {
        fullName: {
          first: 'PENNY',
          last: 'FOSTER',
        },
        dateOfBirth: createDoB(11),
        age: 11,
        labeledAge: '11 years old',
        ssn: '000111234',
        relationshipToVeteran: 'Child',
        awardIndicator: 'Y',
        key: 'penny-1234',
        selected: selected.includes(0),
        endDate: '2020-01-01',
        endOutsideUs: true,
        endCity: 'Test',
        endProvince: 'Prov',
        endCountry: 'AGO',
        endState: 'AK',
      },
      {
        fullName: {
          first: 'STACY',
          last: 'FOSTER',
        },
        dateOfBirth: createDoB(0, 3),
        age: 0,
        labeledAge: '3 months old',
        ssn: '000111234',
        relationshipToVeteran: 'Child',
        awardIndicator: 'Y',
        key: 'stacy-1234',
        selected: selected.includes(1),
        endDate: '2020-01-01',
        endOutsideUs: true,
        endCity: 'Test',
        endProvince: 'Prov',
        endCountry: 'AGO',
        endState: 'AK',
      },
      {
        fullName: {
          first: 'SPOUSY',
          last: 'FOSTER',
        },
        dateOfBirth: createDoB(45),
        age: 45,
        labeledAge: '45 years old',
        ssn: '000111234',
        relationshipToVeteran: 'Spouse',
        awardIndicator: 'Y',
        key: 'spousy-1234',
        selected: selected.includes(2),
        removalReason: 'marriageEnded',
        endType: 'annulmentOrVoid',
        endAnnulmentOrVoidDescription: 'Test description',
        endDate: '2020-01-01',
        endOutsideUs: true,
        endCity: 'Test',
        endProvince: 'Prov',
        endCountry: 'AGO',
        endState: 'AK',
      },
      {
        fullName: {
          first: 'PETER',
          last: 'FOSTER',
        },
        dateOfBirth: createDoB(82),
        age: 82,
        labeledAge: '82 years old',
        ssn: '997010104',
        relationshipToVeteran: 'Parent',
        awardIndicator: 'Y',
        key: 'peter-0104',
        selected: selected.includes(3),
        removalReason: 'parentOther',
        endDate: '2020-01-01',
        endOutsideUs: false,
        endCity: 'Test',
        endProvince: 'Prov',
        endCountry: 'AGO',
        endState: 'AK',
      },
      {
        fullName: {
          first: 'MARY',
          last: 'FOSTER',
        },
        dateOfBirth: createDoB(85),
        age: 85,
        labeledAge: '85 years old',
        ssn: '997010155',
        relationshipToVeteran: 'Parent',
        awardIndicator: 'Y',
        selected: selected.includes(4),
        key: 'mary-0155',
        removalReason: 'parentDied',
        endDate: '2020-01-01',
        endOutsideUs: false,
        endCity: 'Test',
        endProvince: 'Prov',
        endCountry: 'AGO',
        endState: 'AK',
      },
    ],
  });

  const renderComponent = ({ selected = [], goToPath = () => {} } = {}) =>
    render(
      <>
        <div name="topScrollElement" />
        <PicklistRemoveDependentFollowupReview
          data={defaultData(selected)}
          goToPath={goToPath}
        />
      </>,
    );

  it('should render nothing with no data', () => {
    const { container } = render(<PicklistRemoveDependentFollowupReview />);
    expect(container.innerHTML).to.equal('');
  });

  it('should render spouse for removal', () => {
    const { container } = renderComponent({ selected: [2] });
    expect($$('.form-review-panel-page', container).length).to.equal(1);
    expect($('h4', container).textContent).to.equal(
      'SPOUSY FOSTER (45 years old)',
    );
    expect($('va-button.edit-page', container)).to.exist;
    expect(
      $$('dd.dd-privacy-hidden[data-dd-action-name]', container).length,
    ).to.equal(3);

    const rows = $$('.review-row', container);
    expect(rows.length).to.equal(5);
    expect(rows.map(row => row.textContent)).to.deep.equal([
      'Reason for removing SPOUSYYou’re no longer married to them',
      'How did the marriage end?Your marriage was annulled or declared void',
      'Description of annulment or voidTest description',
      'When did the marriage end?January 1, 2020',
      'Where did the marriage end?Test, Prov, AGO',
    ]);
  });

  it('should render success alert after editing', async () => {
    sessionStorage.setItem(PICKLIST_EDIT_REVIEW_FLAG, 'spousy-1234');
    const { container } = renderComponent({ selected: [2] });
    const page = $('.form-review-panel-page', container);
    const alert = $('va-alert[status="success"]', page);

    expect(alert).to.exist;

    await alert.__events.closeEvent();

    await waitFor(() => {
      expect(sessionStorage.getItem(PICKLIST_EDIT_REVIEW_FLAG)).to.be.null;
      expect($('va-alert[status="success"]', page)).to.not.exist;
    });
  });

  it('should render 2 parents for removal', () => {
    const { container } = renderComponent({ selected: [3, 4] });
    expect($$('.form-review-panel-page', container).length).to.equal(2);
    expect($$('h4', container).map(el => el.textContent)).to.deep.equal([
      'PETER FOSTER (82 years old)',
      'MARY FOSTER (85 years old)',
    ]);
    expect($$('va-button.edit-page', container).length).to.equal(2);
    expect(
      $$('dd.dd-privacy-hidden[data-dd-action-name]', container).length,
    ).to.equal(3);

    const rows = $$('.review-row', container);
    expect(rows.length).to.equal(4);
    expect(rows.map(row => row.textContent)).to.deep.equal([
      'This form only supports removing a parent if they diedPETER will remain on your benefits',
      'Reason for removing MARYThey died',
      'When was the death?January 1, 2020',
      'Where was the death?Test, AK',
    ]);
  });

  it('should call goToPath with correct params when edit button clicked', async () => {
    const goToPath = sinon.spy();
    const { container } = renderComponent({ selected: [2, 3], goToPath });

    const editButtons = $$('va-button.edit-page', container);
    expect(editButtons.length).to.equal(2);

    // Click spouse edit button
    await fireEvent.click(editButtons[0]);
    // Click parent edit button
    await fireEvent.click(editButtons[1]);

    await waitFor(() => {
      expect(goToPath.called).to.be.true;
      expect(goToPath.firstCall.args[0]).to.equal(
        '/remove-dependent?index=2&page=spouse-reason-to-remove',
      );
      expect(goToPath.calledTwice).to.be.true;
      expect(goToPath.secondCall.args[0]).to.equal(
        '/remove-dependent?index=3&page=parent-reason-to-remove',
      );
    });
  });
});
