import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setBreadcrumbs } from '../actions/breadcrumbs';

const HealthHistory = () => {
  const dispatch = useDispatch();

  useEffect(
    () => {
      dispatch(
        setBreadcrumbs(
          [{ url: '/my-health/medical-records/', label: 'Dashboard' }],
          {
            url: '/my-health/medical-records/health-history',
            label: 'Health history',
          },
        ),
      );
    },
    [dispatch],
  );

  return (
    <div className="health-history vads-u-padding-bottom--5">
      <h1 className="vads-u-margin-bottom--0">Health history</h1>
      <section className="set-width-486">
        <p className="vads-u-margin-top--0 va-introtext">
          Review, print, and download your personal health history.
        </p>
        <ul className="unstyled-list">
          <li>
            <h2 className="vads-u-margin-bottom--1 vads-u-margin-top--4">
              Care summaries and notes
            </h2>
            <va-link
              className="section-link"
              active
              href="/my-health/medical-records/health-history/care-summaries-and-notes"
              text="Review your care summaries and notes"
              data-testid="section-link"
            />
            <p className="vads-u-margin-top--1">
              VA Notes from January 1, 2013 forward are available thirty-six
              (36) hours after they have been completed (except C&P Notes) and
              signed by all required members of your VA health care team.
            </p>
          </li>

          <li>
            <h2 className="vads-u-margin-bottom--1 vads-u-margin-top--4">
              Vaccines
            </h2>
            <va-link
              className="section-link"
              active
              href="/my-health/medical-records/health-history/vaccines"
              text="Review your vaccines"
              data-testid="section-link"
            />
            <p className="vads-u-margin-top--1">
              Your VA immunizations/vaccinations list may not be complete. If
              you have questions about your vaccinations, contact your VA health
              care team.
            </p>
          </li>

          <li>
            <h2 className="vads-u-margin-top--4 vads-u-margin-bottom--1">
              Allergies
            </h2>
            <va-link
              className="section-link"
              active
              href="/my-health/medical-records/health-history/allergies"
              text="Review your allergies"
              data-testid="section-link"
            />
            <p className="vads-u-margin-top--1">[description of section]</p>
          </li>

          <li>
            <h2 className="vads-u-margin-bottom--1 vads-u-margin-top--4">
              Health conditions
            </h2>
            <va-link
              className="section-link"
              active
              href="/my-health/medical-records/health-history/health-conditions"
              text="Review your health conditions"
              data-testid="section-link"
            />
            <p className="vads-u-margin-top--1">[description of section]</p>
          </li>

          <li>
            <h2 className="vads-u-margin-bottom--1 vads-u-margin-top--4">
              Vitals
            </h2>
            <va-link
              className="section-link"
              active
              href="/my-health/medical-records/health-history/vitals"
              text="Review your vitals"
              data-testid="section-link"
            />
            <p className="vads-u-margin-top--1">[description of section]</p>
          </li>
        </ul>
      </section>
    </div>
  );
};

export default HealthHistory;
