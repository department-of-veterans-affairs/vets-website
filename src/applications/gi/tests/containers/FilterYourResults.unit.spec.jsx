import React from 'react';
import { expect } from 'chai';
import { waitFor, fireEvent } from '@testing-library/react';
import environment from 'platform/utilities/environment';
import { mockConstants, renderWithStoreAndRouter } from '../helpers';
import FilterYourResults from '../../containers/FilterYourResults';

describe('<FilterYourResults>', () => {
  it('should render', async () => {
    const screen = renderWithStoreAndRouter(<FilterYourResults />, {
      initialState: {
        constants: mockConstants(),
      },
    });
    await waitFor(() => {
      expect(screen).to.not.be.null;
    });
  });

  it('should click on Historically Black college or university and change status to clicked', async () => {
    const screen = renderWithStoreAndRouter(<FilterYourResults />, {
      initialState: {
        constants: mockConstants(),
      },
    });
    const filterButton = screen.getByRole('button', {
      name: 'Filter your results',
    });
    fireEvent.click(filterButton);
    const HBCUCheckBox = screen.getByRole('checkbox', {
      name: environment.isProduction()
        ? 'Specialized mission (i.e., Single-gender, Religious affiliation, HBCU) Historically Black college or university'
        : 'Community focus (i.e., Single-gender, Religious affiliation, HBCU) Historically Black college or university',
    });
    fireEvent.click(HBCUCheckBox);

    await waitFor(() => {
      expect(HBCUCheckBox).to.have.property('checked', true);
    });
  });

  it('should click Public school and change status to unclicked', async () => {
    const screen = renderWithStoreAndRouter(<FilterYourResults />, {
      initialState: {
        constants: mockConstants(),
      },
    });
    const filterButton = screen.getByRole('button', {
      name: 'Filter your results',
    });
    fireEvent.click(filterButton);

    const publicSchoolCheckBox = screen.getByRole('checkbox', {
      name: 'Include these school types: Public',
    });
    fireEvent.click(publicSchoolCheckBox);

    await waitFor(() => {
      expect(publicSchoolCheckBox).to.have.property('checked', false);
    });
  });

  it('should click Public school checkbox twice and status should be clicked', async () => {
    const screen = renderWithStoreAndRouter(<FilterYourResults />, {
      initialState: {
        constants: mockConstants(),
      },
    });
    const filterButton = screen.getByRole('button', {
      name: 'Filter your results',
    });
    fireEvent.click(filterButton);

    const publicSchoolCheckBox = screen.getByRole('checkbox', {
      name: 'Include these school types: Public',
    });
    // first click unchecks the box
    fireEvent.click(publicSchoolCheckBox);
    // second click should check the box
    fireEvent.click(publicSchoolCheckBox);

    await waitFor(() => {
      expect(publicSchoolCheckBox).to.have.property('checked', true);
    });
  });

  it('should click Vet Tec and change status to unclicked', async () => {
    const screen = renderWithStoreAndRouter(<FilterYourResults />, {
      initialState: {
        constants: mockConstants(),
      },
    });
    const filterButton = screen.getByRole('button', {
      name: 'Filter your results',
    });
    fireEvent.click(filterButton);

    const VETTECCheckBox = screen.getByRole('checkbox', {
      name: 'VET TEC providers',
    });
    fireEvent.click(VETTECCheckBox);

    await waitFor(() => {
      expect(VETTECCheckBox).to.have.property('checked', false);
    });
  });

  it('should click Preferred Provider and change status to clicked', async () => {
    const screen = renderWithStoreAndRouter(<FilterYourResults />, {
      initialState: {
        constants: mockConstants(),
      },
    });
    const filterButton = screen.getByRole('button', {
      name: 'Filter your results',
    });
    fireEvent.click(filterButton);

    const VETTECPerferredProviderCheckBox = screen.getByRole('checkbox', {
      name: 'VET TEC Preferred providers',
    });
    fireEvent.click(VETTECPerferredProviderCheckBox);

    await waitFor(() => {
      expect(VETTECPerferredProviderCheckBox).to.have.property('checked', true);
    });
  });

  it('should click Update Results button', async () => {
    const screen = renderWithStoreAndRouter(<FilterYourResults />, {
      initialState: {
        constants: mockConstants(),
      },
    });
    const filterButton = screen.getByRole('button', {
      name: 'Filter your results',
    });
    fireEvent.click(filterButton);

    const updateFilterResultsButton = screen.getByRole('button', {
      name: 'Update results',
    });
    fireEvent.click(updateFilterResultsButton);

    await waitFor(() => {
      expect(screen).to.not.be.null;
    });
  });

  it('should click Update Results button in a mobile screen', async () => {
    const screen = renderWithStoreAndRouter(
      <FilterYourResults modalClose={() => {}} smallScreen />,
      {
        initialState: {
          constants: mockConstants(),
        },
      },
    );
    const updateFilterResultsButton = screen.getByRole('button', {
      name: 'Update results',
    });
    fireEvent.click(updateFilterResultsButton);

    await waitFor(() => {
      expect(screen).to.not.be.null;
    });
  });

  it('should unclick On The Job Training checkbox', async () => {
    const screen = renderWithStoreAndRouter(<FilterYourResults />, {
      initialState: {
        constants: mockConstants(),
      },
    });
    const filterButton = screen.getByRole('button', {
      name: 'Filter your results',
    });
    fireEvent.click(filterButton);

    const aboutTheSchoolCheckBox = screen.getByRole('checkbox', {
      name: 'On-the-job training and apprenticeships',
    });
    fireEvent.click(aboutTheSchoolCheckBox);

    await waitFor(() => {
      expect(aboutTheSchoolCheckBox).to.have.property('checked', false);
    });
  });
  it('should render', () => {
    global.window.buildType = true;
    const screen = renderWithStoreAndRouter(<FilterYourResults />, {
      initialState: {
        constants: mockConstants(),
      },
    });
    fireEvent.click(
      screen.getByRole('button', { name: 'Filter your results' }),
    );
    expect(
      screen.queryByRole('label', {
        name: 'Native American-serving institutions',
      }),
    ).to.not.exist;
  });
});
