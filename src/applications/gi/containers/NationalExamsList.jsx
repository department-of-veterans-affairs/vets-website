import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  VaPagination,
  VaLink,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { fetchNationalExams } from '../actions';
import { formatNationalExamName } from '../utils/helpers';

const NationalExamsList = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const history = useHistory();
  const query = new URLSearchParams(location.search);
  const initialPage = Number(query.get('page')) || 1;
  const [currentPage, setCurrentPage] = useState(initialPage);
  const itemsPerPage = 10;
  const resultsSummaryRef = useRef(null);
  const { loading, error, nationalExams } = useSelector(
    state => state.nationalExams,
  );
  useEffect(
    () => {
      dispatch(fetchNationalExams());
    },
    [dispatch],
  );

  // Calculate total pages and slice programs for pagination
  const totalPages = Math.ceil(nationalExams.length / itemsPerPage);
  const currentExams = nationalExams.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Calculate start and end indices for the displayed programs
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, nationalExams.length);

  const handlePageChange = page => {
    setCurrentPage(page);
    history.replace({
      pathname: location.pathname,
      search: `?page=${page}`,
    });

    window.scrollTo(0, 0);
    setTimeout(() => {
      if (resultsSummaryRef.current) {
        resultsSummaryRef.current.focus();
      }
    }, 0);
  };

  const handleRouteChange = exam => event => {
    event.preventDefault();
    const selectedExamName = formatNationalExamName(exam.name);
    history.push(
      `/national-exams/${exam.enrichedId}?examName=${encodeURIComponent(
        selectedExamName,
      )}`,
    );
  };

  const NationalExamsInfo = () => (
    <>
      <h1
        className="vads-u-margin-bottom--3"
        data-testid="national-exams-header"
      >
        National Exams
      </h1>
      <p
        className="national-exams-description vads-u-margin-bottom--2"
        data-testid="national-exams-description"
      >
        Part of your entitlement can be used to cover the costs of national
        exams (admissions tests required for college or graduate school and
        tests for college credit)—even if you’re already receiving other
        education benefits. We’ll pay you back for the cost to register and any
        administrative fees. We’ll prorate the entitlement charges based on the
        actual amount of the fee charged for the test. The amount covered by VA
        may differ from the actual cost of the exam.
      </p>
      <va-link
        href="https://www.va.gov/education/about-gi-bill-benefits/how-to-use-benefits/national-tests/"
        text="Find out how to get reimbursed for national tests"
        style={{ fontSize: '18px' }}
        data-testid="national-exams-reimbursement-link"
      />
    </>
  );

  if (error) {
    return (
      <div className="national-exams-container row vads-u-padding--1p5 mobile-lg:vads-u-padding--0">
        <div className="usa-width-two-thirds">
          <NationalExamsInfo />
          <va-alert
            style={{ marginTop: '18px', marginBottom: '32px' }}
            status="error"
            data-e2e-id="alert-box"
          >
            <h2 slot="headline">
              We can’t load the national exams list right now
            </h2>
            <p>
              We’re sorry. There’s a problem with our system. Try again later.
            </p>
          </va-alert>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="national-exams-container row vads-u-margin-bottom--8 vads-u-padding--1p5 mobile-lg:vads-u-padding--0">
        <div className="usa-width-two-thirds">
          <NationalExamsInfo />
          <va-loading-indicator
            label="Loading"
            message="Loading your national exams..."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="national-exams-container row vads-u-padding--1p5 mobile-lg:vads-u-padding--0">
      <div className="usa-width-two-thirds">
        <NationalExamsInfo />
        <p
          id="results-summary"
          ref={resultsSummaryRef}
          tabIndex="-1"
          className="vads-u-margin-top--3 vads-u-margin-bottom--2"
        >
          {`Showing ${startIndex}-${endIndex} of ${
            nationalExams.length
          } national exams`}
        </p>
        {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
        <ul className="remove-bullets" role="list">
          {currentExams.map(exam => (
            <li key={exam.enrichedId} className="vads-u-margin-bottom--2p5">
              <va-card background>
                <h3 className="vads-u-margin--0 vads-u-margin-bottom--1">
                  {formatNationalExamName(exam.name)}
                </h3>
                <VaLink
                  href={`/national-exams/${exam.enrichedId}`}
                  text={`View test amount details for ${formatNationalExamName(
                    exam.name,
                  )}`}
                  type="secondary"
                  message-aria-describedby={`View test amount details for ${formatNationalExamName(
                    exam.name,
                  )}`}
                  onClick={handleRouteChange(exam)}
                />
              </va-card>
            </li>
          ))}
        </ul>
        <VaPagination
          page={currentPage}
          pages={totalPages}
          maxPageListLength={5}
          data-testid="currentPage"
          onPageSelect={e => handlePageChange(e.detail.page)}
          className="vads-u-border-top--0 vads-u-margin-top--1 vads-u-padding-bottom--9"
        />
      </div>
    </div>
  );
};

NationalExamsList.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.string,
  nationalExams: PropTypes.arrayOf(
    PropTypes.shape({
      enrichedId: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ),
};

export default NationalExamsList;
