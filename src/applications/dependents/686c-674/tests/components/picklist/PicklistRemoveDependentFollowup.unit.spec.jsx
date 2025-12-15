import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';

import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import PicklistRemoveDependentFollowup from '../../../components/picklist/PicklistRemoveDependentFollowup';
import { labels } from '../../../components/picklist/utils';

import {
  PICKLIST_DATA,
  PICKLIST_EDIT_REVIEW_FLAG,
  PICKLIST_PATHS,
} from '../../../config/constants';
import { createDoB } from '../../test-helpers';

describe('PicklistRemoveDependentFollowup', () => {
  const defaultData = (options = {}, parentSelected = true) => ({
    [PICKLIST_DATA]: [
      {
        fullName: {
          first: 'PENNY',
          last: 'FOSTER',
        },
        dateOfBirth: createDoB(11),
        ssn: '000111234',
        relationshipToVeteran: 'Child',
        selected: false,
        awardIndicator: 'Y',
        key: 'penny-1234',
      },
      {
        fullName: {
          first: 'STACY',
          last: 'FOSTER',
        },
        dateOfBirth: createDoB(0, 3),
        ssn: '000111234',
        relationshipToVeteran: 'Child',
        selected: false,
        awardIndicator: 'Y',
        key: 'stacy-1234',
      },
      {
        fullName: {
          first: 'SPOUSY',
          last: 'FOSTER',
        },
        dateOfBirth: createDoB(45),
        ssn: '000111234',
        relationshipToVeteran: 'Spouse',
        selected: true,
        awardIndicator: 'Y',
        key: 'spousy-1234',
        ...options,
      },
      {
        fullName: {
          first: 'PETER',
          last: 'FOSTER',
        },
        dateOfBirth: createDoB(82),
        ssn: '000111234',
        relationshipToVeteran: 'Parent',
        selected: parentSelected,
        awardIndicator: 'Y',
        key: 'peter-1234',
      },
    ],
  });

  const renderComponent = ({
    data = defaultData(),
    goBack = () => {},
    goForward = () => {},
    goToPath = () => {},
    setFormData = () => {},
    contentBeforeButtons = <div id="before">before</div>,
    contentAfterButtons = <div id="after">after</div>,
    testUrl = '?index=2',
  } = {}) =>
    render(
      <>
        <div name="topScrollElement" />
        <PicklistRemoveDependentFollowup
          name="PicklistRemoveDependentFollowup"
          data={data}
          goBack={goBack}
          goForward={goForward}
          goToPath={goToPath}
          setFormData={setFormData}
          contentBeforeButtons={contentBeforeButtons}
          contentAfterButtons={contentAfterButtons}
          urlTestingOnly={testUrl}
        />
      </>,
    );

  it('should render dependent picklist checkboxes', () => {
    const { container } = renderComponent();

    const radioWrap = $('va-radio', container);
    expect(radioWrap).to.exist;
    expect(radioWrap.getAttribute('label')).to.equal(
      labels.Spouse.removalReason,
    );
    const options = $$('va-radio-option', container);
    expect(options.length).to.equal(2);
    expect(options.map(cb => cb.getAttribute('label'))).to.deep.equal([
      labels.Spouse.marriageEnded,
      labels.Spouse.spouseDied,
    ]);
    expect(radioWrap).to.exist;
    expect($('.form-progress-buttons', container)).to.exist;
    expect($('#before', container)).to.exist;
    expect($('va-button[back]', container)).to.exist;
    expect($('va-button[continue]', container)).to.exist;
    expect($('#after', container)).to.exist;
  });

  it('should render exit page continue button without content before or after', () => {
    const { container } = renderComponent({
      data: {
        ...defaultData({ selected: false }, true),
        [PICKLIST_PATHS]: [{ path: 'parent-exit', index: 3 }],
      },
      testUrl: '?index=3&page=parent-exit',
    });

    expect($('#before', container)).to.not.exist;
    expect($('va-button[back]', container)).to.exist;
    expect($('va-button.exit-form', container)).to.exist;
    expect($('#after', container)).to.not.exist;
  });

  it('should update PICKLIST_DATA in form data on change', () => {
    const setFormData = sinon.spy();
    const { container } = renderComponent({ setFormData });

    $('va-radio', container).__events.vaValueChange({
      detail: { value: 'marriedEnded' },
      target: { getAttribute: () => 'stacy-1234' },
    });

    const result = defaultData()[PICKLIST_DATA].map(
      (dep, index) =>
        index === 2 ? { ...dep, removalReason: 'marriedEnded' } : dep,
    );

    expect(setFormData.calledOnce).to.be.true;
    expect(setFormData.firstCall.args[0][PICKLIST_DATA]).to.deep.equal(result);
  });

  it('should navigate to spouse follow up page', () => {
    const goToPath = sinon.spy();
    const { container } = renderComponent({
      goToPath,
      data: defaultData({ removalReason: 'marriageEnded' }),
    });

    fireEvent.submit($('form', container));

    expect(goToPath.calledOnce).to.be.true;
    expect(goToPath.firstCall.args[0]).to.equal(
      'remove-dependent?index=2&page=spouse-marriage-ended',
    );
  });

  it('should navigate to spouse follow up page', () => {
    const goToPath = sinon.spy();
    const { container } = renderComponent({
      goToPath,
      data: defaultData({ removalReason: 'spouseDied' }),
    });

    fireEvent.submit($('form', container));

    expect(goToPath.calledOnce).to.be.true;
    expect(goToPath.firstCall.args[0]).to.equal(
      'remove-dependent?index=2&page=spouse-death',
    );
  });

  it('should navigate to spouse marriage ended follow up page', () => {
    const goToPath = sinon.spy();
    const { container } = renderComponent({
      goToPath,
      testUrl: '?index=2&page=spouse-reason-to-remove',
      data: defaultData({
        removalReason: 'marriageEnded',
      }),
    });

    fireEvent.submit($('form', container));

    expect(goToPath.calledOnce).to.be.true;
    expect(goToPath.firstCall.args[0]).to.equal(
      'remove-dependent?index=2&page=spouse-marriage-ended',
    );
  });

  it('should navigate using goForward after continuing past last spouse marriage ended page when there are further selected dependents', () => {
    const goToPath = sinon.spy();
    const goForward = sinon.spy();
    const { container } = renderComponent({
      goToPath,
      goForward,
      testUrl: '?index=2&page=spouse-marriage-ended',
      data: defaultData(
        {
          removalReason: 'marriageEnded',
          endType: 'divorce',
          endDate: '2020-1-1',
          endCity: 'Test',
          endState: 'AK',
        },
        false, // unselect parent
      ),
    });

    fireEvent.submit($('form', container));

    expect(goToPath.notCalled).to.be.true;
    expect(goForward.calledOnce).to.be.true;
  });

  it('should navigate to parent removal follow up page', () => {
    const goToPath = sinon.spy();
    const { container } = renderComponent({
      goToPath,
      testUrl: '?index=2&page=spouse-marriage-ended',
      data: defaultData({
        removalReason: 'marriageEnded',
        endType: 'divorce',
        endDate: '2020-1-1',
        endCity: 'Test',
        endState: 'AK',
      }),
    });

    fireEvent.submit($('form', container));

    expect(goToPath.calledOnce).to.be.true;
    expect(goToPath.firstCall.args[0]).to.equal('remove-dependent?index=3');
  });

  it('should navigate to parent removal follow up page', () => {
    const goToPath = sinon.spy();
    const { container } = renderComponent({
      goToPath,
      testUrl: '?index=2&page=spouse-marriage-ended',
      data: defaultData({
        removalReason: 'marriageEnded',
        endType: 'divorce',
        endDate: '2020-1-1',
        endCity: 'Test',
        endState: 'AK',
      }),
    });

    fireEvent.submit($('form', container));

    expect(goToPath.calledOnce).to.be.true;
    expect(goToPath.firstCall.args[0]).to.equal('remove-dependent?index=3');
  });

  it('should navigate back to main picklist page', () => {
    const goToPath = sinon.spy();
    const goBack = sinon.spy();
    const { container } = renderComponent({
      goToPath,
      goBack,
      testUrl: '?index=0',
    });

    fireEvent.click($('va-button[back]', container));

    expect(goToPath.notCalled).to.be.true;
    expect(goBack.calledOnce).to.be.true;
  });

  it('should navigate back to first page of previous selected dependent', () => {
    const goToPath = sinon.spy();
    const { container } = renderComponent({
      goToPath,
      testUrl: '?index=3&page=parent-reason-to-remove',
    });

    fireEvent.click($('va-button[back]', container));

    expect(goToPath.calledOnce).to.be.true;
    expect(goToPath.firstCall.args[0]).to.equal(
      'remove-dependent?index=2&page=spouse-death',
    );
  });

  it('should navigate back to spouse reason to remove page', () => {
    const goToPath = sinon.spy();
    const { container } = renderComponent({
      goToPath,
      testUrl: '?index=2&page=spouse-death',
    });

    fireEvent.click($('va-button[back]', container));

    expect(goToPath.calledOnce).to.be.true;
    expect(goToPath.firstCall.args[0]).to.equal(
      'remove-dependent?index=2&page=spouse-reason-to-remove',
    );
  });

  it('should render last spouse marriage ended page when the url doesnt have any parameters (navigating back from review & submit)', () => {
    const goToPath = sinon.spy();
    const goForward = sinon.spy();
    const { container } = renderComponent({
      goToPath,
      goForward,
      testUrl: '?',
      data: defaultData(
        {
          removalReason: 'marriageEnded',
          endType: 'divorce',
          endDate: '2020-1-1',
          endCity: 'Test',
          endState: 'AK',
        },
        false, // unselect parent
      ),
    });

    expect($('h3', container).textContent).to.contain('end of your marriage');
  });

  it('should redirect back to the main picklist page if the URL is invalid', () => {
    const goToPath = sinon.spy();
    renderComponent({ goToPath, testUrl: '?index=12&page=something' });

    expect(goToPath.called).to.be.true;
    expect(goToPath.firstCall.args[0]).to.equal(
      'options-selection/remove-active-dependents',
    );
  });

  it('should navigate back to the reason for removal page', () => {
    const goToPath = sinon.spy();
    const { container } = renderComponent({
      goToPath,
      data: defaultData({ removalReason: 'marriageEnded' }),
      testUrl: '?index=2&page=spouse-marriage-ended',
    });

    fireEvent.click($('va-button[back]', container));

    expect(goToPath.called).to.be.true;
    expect(goToPath.firstCall.args[0]).to.equal(
      'remove-dependent?index=2&page=spouse-reason-to-remove',
    );
  });

  it('should navigate back to the previous dependent last page', () => {
    const goToPath = sinon.spy();
    const { container } = renderComponent({
      goToPath,
      data: defaultData({ removalReason: 'marriageEnded' }),
      testUrl: '?index=3',
      parentSelected: true,
    });

    fireEvent.click($('va-button[back]', container));

    expect(goToPath.called).to.be.true;
    expect(goToPath.firstCall.args[0]).to.equal(
      'remove-dependent?index=2&page=spouse-marriage-ended',
    );
  });

  it('should navigate to the review & submit page after completing edit parent', () => {
    sessionStorage.setItem(PICKLIST_EDIT_REVIEW_FLAG, 'spousy-1234');
    const goToPath = sinon.spy();
    const { container } = renderComponent({
      goToPath,
      testUrl: '?index=2&page=spouse-marriage-ended',
      data: defaultData({
        removalReason: 'marriageEnded',
        endType: 'divorce',
        endDate: '2020-1-1',
        endCity: 'Test',
        endState: 'AK',
      }),
    });

    fireEvent.submit($('form', container));

    expect(goToPath.calledOnce).to.be.true;
    expect(goToPath.firstCall.args[0]).to.equal('/review-and-submit');
  });

  it('should not navigate to the next page on submit of an exit form page', () => {
    sessionStorage.setItem(PICKLIST_EDIT_REVIEW_FLAG, 'peter-1234');
    const goToPath = sinon.spy();
    const { container } = renderComponent({
      data: {
        ...defaultData({ selected: false }, true),
        [PICKLIST_PATHS]: [{ path: 'parent-exit', index: 3 }],
      },
      testUrl: '?index=3&page=parent-exit',
    });

    fireEvent.submit($('form', container));
    expect(goToPath.called).to.be.false;
  });
});
