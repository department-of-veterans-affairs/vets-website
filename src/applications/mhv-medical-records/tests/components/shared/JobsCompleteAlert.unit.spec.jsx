import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { fireEvent } from '@testing-library/react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import reducer from '../../../reducers';
import * as helpers from '../../../util/helpers';
import JobsCompleteAlert from '../../../components/shared/JobsCompleteAlert';

describe('<JobsCompleteAlert />', () => {
  let formatStub;
  let dataDogStub;
  let utils;

  beforeEach(() => {
    // stub the formatter
    formatStub = sinon
      .stub(helpers, 'formatDateAndTimeWithGenericZone')
      .returns({ date: '2025-06-22', time: '11:30 AM', timeZone: 'EST' });
    // stub DataDog sender
    dataDogStub = sinon.stub(helpers, 'sendDataDogAction');
  });

  afterEach(() => {
    formatStub.restore();
    dataDogStub.restore();
  });

  it('renders the single-record message and link correctly', () => {
    const records = [{ id: 'r1', name: 'Test Study', imageCount: 5 }];
    const studyJobs = [{ endDate: 0 }];

    utils = renderWithStoreAndRouter(
      <JobsCompleteAlert records={records} studyJobs={studyJobs} />,
      { initialState: {}, reducers: reducer, path: '/' },
    );
    const { getByText, getByTestId } = utils;

    // paragraph with stubbed date/time
    expect(
      getByText(
        /You have until 2025-06-22 at 11:30 AM EST to view and download your images/i,
      ),
    ).to.exist;

    // link and its strong text
    const link = getByTestId('radiology-view-all-images');
    expect(link.querySelector('strong').textContent).to.equal(
      'View all 5 images',
    );

    // click and assert DataDog was called once with the correct arg
    fireEvent.click(link);
    expect(dataDogStub.callCount).to.equal(1);
    expect(dataDogStub.getCall(0).args[0]).to.equal('View all images');

    // ensure we invoked the formatter once
    expect(formatStub.callCount).to.equal(1);
  });

  it('renders a list for multiple records and pluralizes correctly', () => {
    const records = [
      { id: 'r1', name: 'Alpha', imageCount: 1 },
      { id: 'r2', name: 'Beta', imageCount: 2 },
    ];
    const studyJobs = [{ endDate: 0 }];

    utils = renderWithStoreAndRouter(
      <JobsCompleteAlert records={records} studyJobs={studyJobs} />,
      { initialState: {}, reducers: reducer, path: '/' },
    );
    const { getByText, getAllByTestId } = utils;

    expect(getByText(/Images are available here for 3 days/i)).to.exist;

    const links = getAllByTestId('radiology-view-all-images');
    expect(links).to.have.lengthOf(2);
    expect(links[0].textContent).to.contain('Alpha (1 image)');
    expect(links[1].textContent).to.contain('Beta (2 images)');

    fireEvent.click(links[1]);
    expect(dataDogStub.callCount).to.equal(1);
    expect(dataDogStub.getCall(0).args[0]).to.equal('View all images');
  });
});
