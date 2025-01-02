import React, { useState } from 'react';

import { Element } from 'platform/utilities/scroll';

import IntroductionPage from '../components/submit-flow/pages/IntroductionPage';
import MileagePage from '../components/submit-flow/pages/MileagePage';
import VehiclePage from '../components/submit-flow/pages/VehiclePage';
import AddressPage from '../components/submit-flow/pages/AddressPage';
import ReviewPage from '../components/submit-flow/pages/ReviewPage';
import ConfirmationPage from '../components/submit-flow/pages/ConfirmationPage';
import BreadCrumbs from '../components/Breadcrumbs';

import CantFilePage from '../components/submit-flow/pages/CantFilePage';
import SubmissionErrorPage from '../components/submit-flow/pages/SubmissionErrorPage';

const SubmitFlowWrapper = () => {
  const [cantFile, setCantFile] = useState(false);

  // This will actually be handled by the redux action, but for now it lives here
  const [isSubmissionError, setIsSubmissionError] = useState(false);

  const [pageIndex, setPageIndex] = useState(0);

  const onSubmit = e => {
    e.preventDefault();
    // Placeholder until actual submit is hooked up

    // Uncomment to simulate successful submission
    // setPageIndex(pageIndex + 1);

    // Uncomment to simulate an error
    setIsSubmissionError(true);
  };

  const pageList = [
    {
      page: 'intro',
      component: (
        <IntroductionPage
          onNext={e => {
            e.preventDefault();
            setPageIndex(pageIndex + 1);
          }}
        />
      ),
    },
    {
      page: 'mileage',
      component: (
        <MileagePage pageIndex={pageIndex} setPageIndex={setPageIndex} />
      ),
    },
    {
      page: 'vehicle',
      component: (
        <VehiclePage pageIndex={pageIndex} setPageIndex={setPageIndex} />
      ),
    },
    {
      page: 'address',
      component: (
        <AddressPage pageIndex={pageIndex} setPageIndex={setPageIndex} />
      ),
    },
    {
      page: 'review',
      component: (
        <ReviewPage
          onSubmit={onSubmit}
          pageIndex={pageIndex}
          setPageIndex={setPageIndex}
        />
      ),
    },
    {
      page: 'confirm',
      component: <ConfirmationPage />,
    },
  ];

  return (
    <Element name="topScrollElement">
      <article className="usa-grid-full vads-u-margin-bottom--3">
        <BreadCrumbs />
        <div className="vads-l-col--12 medium-screen:vads-l-col--8">
          {cantFile && (
            <CantFilePage
              pageIndex={pageIndex}
              setPageIndex={setPageIndex}
              setCantFile={setCantFile}
            />
          )}
          {isSubmissionError && <SubmissionErrorPage />}
          {!cantFile && !isSubmissionError && pageList[pageIndex].component}
        </div>
      </article>
    </Element>
  );
};

export default SubmitFlowWrapper;
