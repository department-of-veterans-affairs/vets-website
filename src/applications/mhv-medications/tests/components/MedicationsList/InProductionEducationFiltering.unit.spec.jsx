import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import reducers from '../../../reducers';
import InProductionEducationFiltering from '../../../components/MedicationsList/InProductionEducationFiltering';

describe('In Production Education Filtering component', () => {
  const setup = () => {
    return renderWithStoreAndRouter(<InProductionEducationFiltering />, {
      path: '/',
      state: {},
      reducers,
    });
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen);
  });
  // TODO: need to find a way to stub the api calls to the tooltip api.
  // it('calls Data Dog on Secondary button click', async () => {
  //   const screen = setup();
  //   const spyDog = sinon.spy(datadogRum, 'addAction');
  //   const stopShowingThisHintButton = screen.getByTestId(
  //     'rx-ipe-filtering-stop-showing-this-hint',
  //   );

  //   fireEvent.click(stopShowingThisHintButton);

  //   await waitFor(() => {
  //     expect(spyDog.called).to.be.true;
  //     expect(
  //       spyDog.calledWith(
  //         dataDogActionNames.medicationsListPage
  //           .STOP_SHOWING_IPE_FILTERING_HINT,
  //       ),
  //     ).to.be.true;
  //   });

  //   spyDog.restore();
  // });

  // it('calls Data Dog on Close button click', async () => {
  //   const screen = setup();
  //   const spyDog = sinon.spy(datadogRum, 'addAction');
  //   const closeButton = screen.getByTestId('rx-ipe-filtering-close');

  //   fireEvent.click(closeButton);

  //   await waitFor(() => {
  //     expect(spyDog.called).to.be.true;
  //     expect(
  //       spyDog.calledWith(
  //         dataDogActionNames.medicationsListPage
  //           .STOP_SHOWING_IPE_FILTERING_HINT,
  //       ),
  //     ).to.be.true;
  //   });

  //   spyDog.restore();
  // });
});
