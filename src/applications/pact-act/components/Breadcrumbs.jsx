import React from 'react';
import PropTypes from 'prop-types';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';
import { QUESTION_MAP } from '../constants/question-data-map';

const Breadcrumbs = ({ currentPage }) => {
  return (
    <VaBreadcrumbs
      class="pact-act-breadcrumbs"
      label="Breadcrumbs"
      uswds
      breadcrumbList={[
        {
          href: '/',
          label: 'Home',
        },
        {
          href: '/pact-act-eligibility',
          label: QUESTION_MAP?.[currentPage] || 'PACT Act',
        },
      ]}
    />
  );
};

Breadcrumbs.propTypes = {
  currentPage: PropTypes.string.isRequired,
};

export default Breadcrumbs;
