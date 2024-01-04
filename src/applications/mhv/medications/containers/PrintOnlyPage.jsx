/* eslint-disable @department-of-veterans-affairs/prefer-table-component */
import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { dateFormat } from '../util/helpers';

const PrintOnlyPage = props => {
  const user = useSelector(state => state.user.profile);
  const { first, last, middle, suffix } = user.userFullName;
  const name = user.first
    ? `${last}, ${first} ${middle}, ${suffix}`
    : 'Doe, John R., Jr.';
  const dob = user.dob || 'March 15, 1982';
  const { children, title, preface, subtitle } = props;
  return (
    <div className="print-only landing-page">
      <table>
        <thead>
          <tr>
            <th>
              <div className="vads-u-display--flex vads-u-justify-content--space-between vads-u-padding-bottom--2 vads-u-width--full">
                <span>Medications | Veterans Affairs</span>
                <span data-testid="name-date-of-birth">
                  {name}
                  &nbsp;&nbsp;&nbsp;&nbsp;Date of birth:{' '}
                  {dateFormat(new Date(dob))}
                </span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <div className="vads-u-padding--1 vads-u-border--1px vads-u-border-color--black print-only-crisis-line-header vads-u-margin-top--1">
                If you’re ever in crisis and need to talk to someone right away,
                call the Veterans Crisis line at <strong>988</strong>. Then
                select 1.
              </div>
              <h1
                className="vads-u-margin-top--neg3"
                data-testid="list-page-title-print-only"
              >
                {title}
              </h1>
              <div className="print-only vads-u-margin-top--neg1 vads-l-col--12 medium-screen:vads-l-col--6">
                <p>{preface}</p>
              </div>
              {subtitle && (
                <h2 className="print-only vads-u-margin-top--neg0p5 ">
                  {subtitle}
                </h2>
              )}
              {children}
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td className="print-footer">
              <div className="vads-u-border-bottom--1px vads-u-border-color--black vads-u-margin-bottom--1p5 vads-u-margin-top--0p5" />
              <div className="print-only vads-u-display--flex vads-u-justify-content--space-between vads-u-padding-bottom--0">
                <span>{window.location.href}</span>
                <span>{dateFormat(Date.now())}</span>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

PrintOnlyPage.propTypes = {
  children: PropTypes.object.isRequired,
  preface: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
};

export default PrintOnlyPage;
