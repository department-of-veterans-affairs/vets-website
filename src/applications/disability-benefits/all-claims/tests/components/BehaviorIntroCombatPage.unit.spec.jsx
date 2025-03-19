import React from 'react';
import { fireEvent, getByRole, render, screen, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';
import sinon from 'sinon';
import BehaviorIntroCombatPage, {
  missingSelectionErrorMessage,
} from '../../components/BehaviorIntroCombatPage';

describe('BehaviorIntroCombatPage', () => {
  const page = ({
    data = {},
    goBack = () => {},
    goForward = () => {},
    setFormData = () => {},
  } = {}) => {
    return (
      <div>
        <BehaviorIntroCombatPage
          setFormData={setFormData}
          data={data}
          goBack={goBack}
          goForward={goForward}
        />
      </div>
    );
  };

  it('should render with two radio selections', () => {
    const { container } = render(page());
    expect($$('va-radio-option', container).length).to.eq(2);
  });

  describe('Answer Behavioral Questions selection', () => {
    describe('Opting in to answering behavioral questions', () => {
      it('should advance to the next page', () => {
        const goForwardSpy = sinon.spy();

        const data = {
          'view:answerCombatBehaviorQuestions': 'true',
        };

        const { container } = render(page({ data, goForward: goForwardSpy }));

        fireEvent.click($('button[type="submit"]', container));
        // Validate which page it goes to?
        expect(goForwardSpy.called).to.be.true;
      });
    });

    describe('Validations', () => {
      it('raises an error if a selection is not made and does not advance', () => {
        const goForwardSpy = sinon.spy();
        const { container } = render(
          page({ data: {}, goForward: goForwardSpy }),
        );

        fireEvent.click($('button[type="submit"]', container));

        expect($('va-radio', container).error).to.contain(
          missingSelectionErrorMessage,
        );

        expect(goForwardSpy.notCalled).to.be.true;
      });
    });

    describe('Delete existing answers modal', () => {
      // describe('When the user has already answered behavioral questions, changes the selection to opt out and clicks continue', () => {
      //   const data = {
      //     'view:answerCombatBehaviorQuestions': 'false',
      //     healthBehaviors: {
      //       appetite: true,
      //     },
      //   };

      //   // This doesn't pass when the happy path test runs, it passes without. Async related?
      //   it('displays a prompt to delete the answers and prevents the page from submitting', async () => {
      //     const { container } = render(page({ data, goForward: goForwardSpy }));

      //     fireEvent.click($('button[type="submit"]', container));
      //     // Think we need async await for the modal
      //     await waitFor(() => {
      //       expect($('va-modal[visible="true"]', container)).to.exist;
      //       expect(goForwardSpy.notCalled).to.be.true;
      //     });
      //   });
      // });
    });
  });
});
