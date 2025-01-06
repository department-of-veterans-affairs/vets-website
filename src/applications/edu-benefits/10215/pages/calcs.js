import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { querySelectorWithShadowRoot } from 'platform/utilities/ui/webComponents';
import { getFTECalcs } from '../helpers';

const Calcs = ({ data }) => {
  const [programData, setProgramData] = useState(null);
  //
  // Form data in redux not updated promptly when inputting data in edit mode hence the following code is necessary at present rather than relying on state.form.data
  //
  async function updateData() {
    const supportedInput = await querySelectorWithShadowRoot(
      'va-text-input[name="root_fte_supported"]',
      document,
    );
    const supportedInputValue = supportedInput?.shadowRoot.querySelector(
      'input',
    ).value;
    const nonSupportedInput = await querySelectorWithShadowRoot(
      'va-text-input[name="root_fte_nonSupported"]',
      document,
    );
    const nonSupportedInputValue = nonSupportedInput?.shadowRoot.querySelector(
      'input',
    ).value;
    const fteData = {
      fte: {
        supported: supportedInputValue,
        nonSupported: nonSupportedInputValue,
      },
    };
    if (fteData !== programData) setProgramData(getFTECalcs(fteData));
  }

  useEffect(() => {
    let supportedInput;
    let nonSupportedInput;

    async function getInputs() {
      supportedInput = await querySelectorWithShadowRoot(
        'va-text-input[name="root_fte_supported"]',
        document,
      );
      supportedInput = supportedInput?.shadowRoot?.querySelector('input');
      nonSupportedInput = await querySelectorWithShadowRoot(
        'va-text-input[name="root_fte_nonSupported"]',
        document,
      );
      nonSupportedInput = nonSupportedInput?.shadowRoot?.querySelector('input');
      supportedInput?.addEventListener('change', updateData);
      nonSupportedInput?.addEventListener('change', updateData);
    }

    if (!programData && data) {
      const programIdx = window.location.href.split('?')[0].slice(-1);
      const program = data.programs?.[programIdx];
      setProgramData(getFTECalcs(program));
    }

    getInputs();

    return function cleanup() {
      supportedInput.removeEventListener('change', updateData);
      nonSupportedInput.removeEventListener('change', updateData);
    };
  }, []);

  return (
    <>
      <div className="vads-u-margin-bottom--1">
        <label className="vads-u-margin-bottom--1" data-testid="num-fte">
          Total Enrolled FTE
        </label>
        <span
          className="vads-u-font-size--h3 vads-u-font-weight--bold"
          data-testid="nonSupported"
        >
          {programData?.supported || programData?.nonSupported
            ? programData?.total
            : '--'}
        </span>
      </div>
      <va-additional-info trigger="How is Total enrolled FTE calculated?">
        <p>
          Number of supported students FTE plus number of non-supported students
          FTE.
        </p>
        <br />
        <p>
          If this number seems inaccurate, please check the numbers you entered
          above.
        </p>
      </va-additional-info>
      <div className="vads-u-margin-bottom--1">
        <label className="vads-u-margin-bottom--1" data-testid="percentage-FTE">
          Supported student percentage FTE
        </label>
        <span
          className="vads-u-font-size--h3 vads-u-font-weight--bold"
          data-testid="supportedFTEPercent"
        >
          {programData?.supportedFTEPercent || '--%'}
        </span>
      </div>
      <va-additional-info trigger="How is Supported student percentage FTE calculated?">
        <p>
          (Number of supported students FTE divided by Total enrollment FTE)
          multiplied by 100 = Supported student percentage FTE.
        </p>
        <br />
        <p>
          If this number seems incorrect, please check the numbers you entered
          above.
        </p>
      </va-additional-info>
    </>
  );
};

Calcs.propTypes = {
  data: PropTypes.object,
};

const mapStateToProps = state => ({
  data: state.form.data,
});

export default connect(mapStateToProps)(Calcs);
