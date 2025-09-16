import React from 'react';
import PropTypes from 'prop-types';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';

const IntroductionPage = ({ onNext }) => (
  <article className="schemaform-intro">
    <FormTitle title="Static demo 2: Intro" subTitle="VA static demo" />
    <div className="vads-u-margin-top--4">
      <p>This is the simplified introduction page for the static demo.</p>
      <va-button onClick={onNext} text="Go to review" />
    </div>
  </article>
);

IntroductionPage.propTypes = {
  onNext: PropTypes.func.isRequired,
};

export default IntroductionPage;
