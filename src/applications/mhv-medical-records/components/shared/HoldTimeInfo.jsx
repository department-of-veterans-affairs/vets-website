import React from 'react';
import PropTypes from 'prop-types';

const HoldTimeInfo = ({ locationPhrase = 'here' }) => {
  const mainInfo = `Your test results are available ${locationPhrase} as soon as they’re
        ready. You may have access to your results before your care team reviews
        them.`;

  return (
    <>
      <p>{mainInfo}</p>
      <va-additional-info
        trigger="What to know before reviewing your results"
        class="no-print vads-u-margin-y--3"
      >
        <p>
          Please give your care team some time to review your results. Test
          results can be complex. Your team can help you understand what the
          results mean for your overall health.
        </p>
        <p>
          If you do review results on your own, remember that many factors can
          affect what they mean for you. If you have concerns, contact your care
          team.
        </p>
      </va-additional-info>
    </>
  );
};

HoldTimeInfo.propTypes = {
  locationPhrase: PropTypes.string,
};

export default HoldTimeInfo;
