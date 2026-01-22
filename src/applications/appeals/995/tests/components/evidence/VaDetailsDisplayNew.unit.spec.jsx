import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';
import { content } from '../../../content/evidence/summary';
import {
  VaDetailsDisplayNew,
  getFormattedTreatmentDate,
} from '../../../components/evidence/VaDetailsDisplayNew';
import { verifyHeader, verifyProviderVA } from '../../unit-test-helpers';
import { vaEvidence } from '../../data/array-builder-evidence';

describe('VaDetailsDisplayNew', () => {
  describe('on the evidence review page', () => {
    it('should render the proper (editable) content', () => {
      const { container } = render(
        <VaDetailsDisplayNew
          isOnReviewPage={false}
          list={vaEvidence}
          reviewMode={false}
          testing
        />,
      );

      const h4s = $$('h4', container);
      const h5s = $$('h5', container);
      const listItems = $$('li', container);
      const firstProvider = vaEvidence[0];
      const secondProvider = vaEvidence[1];
      const thirdProvider = vaEvidence[2];

      verifyHeader(h4s, 0, content.vaTitle);
      verifyProviderVA(
        h5s,
        listItems,
        {
          providerName: firstProvider.vaTreatmentLocation,
        },
        0,
        0,
        false,
      );

      verifyProviderVA(
        h5s,
        listItems,
        {
          providerName: secondProvider.vaTreatmentLocation,
        },
        1,
        1,
        false,
      );

      verifyProviderVA(
        h5s,
        listItems,
        {
          providerName: thirdProvider.vaTreatmentLocation,
        },
        2,
        2,
        false,
      );
    });
  });

  describe('on the review & submit page', () => {
    it('should render the proper (non-editable) content', () => {
      const { container } = render(
        <VaDetailsDisplayNew
          isOnReviewPage
          list={vaEvidence}
          reviewMode
          testing
        />,
      );

      const h5s = $$('h5', container);
      const h6s = $$('h6', container);
      const listItems = $$('li', container);
      const firstProvider = vaEvidence[0];
      const secondProvider = vaEvidence[1];
      const thirdProvider = vaEvidence[2];

      verifyHeader(h5s, 0, content.vaTitle);
      verifyProviderVA(
        h6s,
        listItems,
        {
          providerName: firstProvider.vaTreatmentLocation,
          dates: 'Jan. 1, 2000',
        },
        0,
        0,
        true,
      );

      verifyProviderVA(
        h6s,
        listItems,
        {
          providerName: secondProvider.vaTreatmentLocation,
        },
        1,
        1,
        true,
      );

      verifyProviderVA(
        h6s,
        listItems,
        {
          providerName: thirdProvider.vaTreatmentLocation,
        },
        2,
        2,
        true,
      );
    });

    describe('on the app confirmation page', () => {
      it('should render the proper (non-editable) content', () => {
        const { container } = render(
          <VaDetailsDisplayNew
            isOnReviewPage={false}
            list={vaEvidence}
            reviewMode
            testing
          />,
        );

        const h4s = $$('h4', container);
        const h5s = $$('h5', container);
        const listItems = $$('li', container);
        const firstProvider = vaEvidence[0];
        const secondProvider = vaEvidence[1];
        const thirdProvider = vaEvidence[2];

        verifyHeader(h4s, 0, content.vaTitle);
        verifyProviderVA(
          h5s,
          listItems,
          {
            providerName: firstProvider.vaTreatmentLocation,
            dates: 'Jan. 1, 2000',
          },
          0,
          0,
          true,
        );

        verifyProviderVA(
          h5s,
          listItems,
          {
            providerName: secondProvider.vaTreatmentLocation,
          },
          1,
          1,
          true,
        );

        verifyProviderVA(
          h5s,
          listItems,
          {
            providerName: thirdProvider.vaTreatmentLocation,
          },
          2,
          2,
          true,
        );
      });
    });

    describe('when there is no list data', () => {
      it('should render nothing', () => {
        const { container } = render(<VaDetailsDisplayNew testing />);

        expect(container.innerHTML).to.eq('');
      });
    });
  });

  describe('when parts of the data are missing', () => {
    const fullData = vaEvidence[0];

    const getContainer = partialData => {
      return render(
        <VaDetailsDisplayNew
          list={[partialData]}
          isOnReviewPage={false}
          reviewMode
          testing={false}
        />,
      );
    };

    describe('when the provider name is missing', () => {
      it('should render the proper errors', () => {
        const partialData = { ...fullData, vaTreatmentLocation: '' };
        getContainer(partialData);

        const error = $$('.usa-input-error-message')[0];
        expect(error.textContent).to.contain('Missing location name');
      });
    });

    describe('when the treatmentMonthYear is missing', () => {
      it('should render the proper errors', () => {
        const partialData = {
          ...fullData,
          treatmentMonthYear: '',
        };

        getContainer(partialData);

        const error = $$('.usa-input-error-message')[0];
        expect(error.textContent).to.contain('Missing treatment date');
      });
    });
  });

  it('should execute callback when removing an entry', () => {
    const removeSpy = sinon.spy();
    const handlers = { showModal: removeSpy };

    const { container } = render(
      <VaDetailsDisplayNew list={vaEvidence} handlers={handlers} testing />,
    );

    const buttons = $$('.remove-item', container);
    fireEvent.click(buttons[0]);

    expect(removeSpy.calledOnce).to.be.true;
    expect(removeSpy.args[0][0].target.getAttribute('data-index')).to.eq('0');
    expect(removeSpy.args[0][0].target.getAttribute('data-type')).to.eq('va');

    fireEvent.click(buttons[1]);

    expect(removeSpy.calledTwice).to.be.true;
    expect(removeSpy.args[1][0].target.getAttribute('data-index')).to.eq('1');
    expect(removeSpy.args[1][0].target.getAttribute('data-type')).to.eq('va');
  });

  describe('getFormattedTreatmentDate', () => {
    it('should return the proper output', () => {
      expect(getFormattedTreatmentDate('2020-05')).to.eq('May 1, 2020');
      expect(getFormattedTreatmentDate('')).to.eq(null);
    });
  });
});
