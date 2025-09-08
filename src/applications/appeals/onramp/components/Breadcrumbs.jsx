import React from 'react';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';
import { QUESTION_CONTENT } from '../constants/question-data-map';

const Breadcrumbs = () => {
  return (
    <VaBreadcrumbs
      class="vads-u-margin-left--1p5"
      label="Breadcrumbs"
      breadcrumbList={[
        {
          href: '/',
          label: 'Home',
        },
        {
          href: '/decision-reviews',
          label: 'Decision Review tool',
        },
        {
          href: '/onramp-to-dr',
          label: QUESTION_CONTENT.INTRODUCTION.h1,
        },
      ]}
    />
  );
};

export default Breadcrumbs;
