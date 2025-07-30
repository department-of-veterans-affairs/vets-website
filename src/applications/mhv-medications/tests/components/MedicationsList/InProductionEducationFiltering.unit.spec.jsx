import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouterV6 } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import sinon from 'sinon';
import { datadogRum } from '@datadog/browser-rum';
import { fireEvent, waitFor } from '@testing-library/dom';
import InProductionEducationFiltering from '../../../components/MedicationsList/InProductionEducationFiltering';
import reducers from '../../../reducers';
import { dataDogActionNames } from '../../../util/dataDogConstants';
import { tooltipHintContent } from '../../../util/constants';

describe('In Production Education Filtering component', () => {
  const initialState = {
    rx: {
      inProductEducation: {
        tooltipVisible: true,
        tooltipId: 123,
      },
    },
  };
  const setup = (state = initialState) => {
    return renderWithStoreAndRouterV6(<InProductionEducationFiltering />, {
      initialState: state,
      reducers,
    });
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen);
  });

  it('calls Data Dog on Secondary button click', async () => {
    const screen = setup(initialState);
    const spyDog = sinon.spy(datadogRum, 'addAction');
    const stopShowingThisHintButton = screen.getByTestId(
      'rx-ipe-filtering-stop-showing-this-hint',
    );

    fireEvent.click(stopShowingThisHintButton);

    await waitFor(() => {
      expect(spyDog.called).to.be.true;
      expect(
        spyDog.calledWith(
          dataDogActionNames.medicationsListPage
            .STOP_SHOWING_IPE_FILTERING_HINT,
        ),
      ).to.be.true;
    });

    spyDog.restore();
  });

  it('hides component if tooltipVisible attribute is false', async () => {
    const initialStateToHideTooltip = {
      ...initialState,
      rx: {
        tooltipVisible: false,
      },
    };

    const screen = setup(initialStateToHideTooltip);

    const hintText = screen.queryByText(
      tooltipHintContent.filterAccordion.HINT,
    );
    expect(hintText).to.not.exist;
  });
});
