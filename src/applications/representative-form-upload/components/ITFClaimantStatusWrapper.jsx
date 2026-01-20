import React from 'react';
import PropTypes from 'prop-types';
import FormTitle from '~/platform/forms-system/src/js/components/FormTitle';
import { getFormContent } from '../helpers';

const ITFClaimantStatusWrapper = ({ children }) => {
  const { subTitle, formNumber } = getFormContent();
  return (
    <section className="itf-status">
      <FormTitle title={`Submit VA Form ${formNumber}`} subTitle={subTitle} />
      <va-segmented-progress-bar
        current={2}
        header-level={2}
        heading-text="Claimant information"
        total={3}
      />
      {children}
    </section>
  );
};
ITFClaimantStatusWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};
export default ITFClaimantStatusWrapper;
