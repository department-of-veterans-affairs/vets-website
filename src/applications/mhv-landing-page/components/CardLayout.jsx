/* eslint-disable no-nested-ternary */
import React from 'react';
import { useSelector } from 'react-redux';
import classnames from 'classnames';

import {
  mhvAccountStatusUserError,
  mhvAccountStatusErrorsSorted,
} from '../selectors';

import NavCard from './NavCard';
import ErrorNavCard from './ErrorNavCard';
import { MHV_ACCOUNT_CARDS } from '../constants';

const layoutData = data => {
  const offset = 2;
  const rows = [];
  for (let i = 0; i < data.length; i += offset) {
    rows.push(data.slice(i, i + offset));
  }
  return rows;
};

const CardLayout = ({ data }) => {
  const mhvAccountStatusUserErrors = useSelector(mhvAccountStatusUserError);
  const mhvAccountStatusSortedErrors = useSelector(
    mhvAccountStatusErrorsSorted,
  );

  const rowCols = layoutData(data);
  return rowCols.map((row, x) => {
    return (
      <div
        className={classnames(
          'vads-l-row',
          'vads-u-justify-content--space-between',
          'vads-u-margin-bottom--0',
          'medium-screen:vads-u-margin-bottom--2',
        )}
        key={`row-${x}`}
      >
        {row.map((col, y) => {
          return (
            <div
              className={classnames(
                'vads-l-col--12',
                'medium-screen:vads-l-col',
                'mhv-u-grid-gap',
                'vads-u-margin-bottom--2',
                'medium-screen:vads-u-margin-bottom--0',
              )}
              data-testid={`mhv-link-group-card-${x * rowCols.length + y}`}
              key={`col-${y}`}
            >
              {mhvAccountStatusSortedErrors.length > 0 &&
              MHV_ACCOUNT_CARDS.includes(col.title) ? (
                <ErrorNavCard
                  title={col.title}
                  code={mhvAccountStatusSortedErrors[0].code}
                  userActionable={mhvAccountStatusUserErrors.length > 0}
                />
              ) : (
                <NavCard {...col} />
              )}
            </div>
          );
        })}
      </div>
    );
  });
};

export default CardLayout;
