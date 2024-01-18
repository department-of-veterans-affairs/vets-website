import React from 'react';
import PropTypes from 'prop-types';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';
import { QUESTION_MAP } from '../constants/question-data-map';

const Breadcrumbs = () => {
  return (
    <VaBreadcrumbs
      class="pact-act-breadcrumbs vads-u-margin-left--1p5"
      label="Breadcrumbs"
      uswds
      breadcrumbList={[
        {
          href: '/',
          label: 'Home',
        },
        {
          href: '/pact-act-eligibility',
          label: QUESTION_MAP.HOME,
        },
      ]}
    />
  );
};

Breadcrumbs.propTypes = {
  currentPage: PropTypes.string.isRequired,
};

export default Breadcrumbs;
