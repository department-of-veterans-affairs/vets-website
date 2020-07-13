import React from 'react';
import classNames from 'classnames';
import { createId } from '../../utils/helpers';

const month = (
  <React.Fragment key="months">
    <span className="sr-only">per month</span>
    <span aria-hidden="true">/mo</span>
  </React.Fragment>
);

const year = (
  <React.Fragment key="years">
    <span className="sr-only">per year</span>
    <span aria-hidden="true">/yr</span>
  </React.Fragment>
);
const fragment = (key, sr, label) => {
  return (
    <React.Fragment key={key}>
      <span className="sr-only">{sr}</span>
      <span aria-hidden="true">{label}</span>
    </React.Fragment>
  );
};
const termLabel = label => {
  switch (label) {
    case 'Months 1-6':
      return fragment('m16', 'Months 1 through 6', label);
    case 'Months 7-12':
      return fragment('m712', 'Months 7 through 12', label);
    case 'Months 13-18':
      return fragment('m16', 'Months 13 through 18', label);
    default:
      return fragment('m1924', 'Months 19 through 24', label);
  }
};

const CalculatorResultRow = ({
  id,
  label,
  value,
  header,
  bold,
  visible,
  screenReaderSpan,
}) =>
  visible ? (
    <div
      id={`calculator-result-row-${createId(id == null ? label : id)}`}
      className={classNames('row', 'calculator-result', {
        'vads-u-font-weight--bold': bold,
      })}
    >
      <div className="small-6 columns">
        {header ? <h4>{label}:</h4> : <div>{label}:</div>}
      </div>
      <div className="small-6 columns vads-u-text-align--right">
        {header ? (
          <div>
            <p
              className="vads-u-font-size--h5 vads-u-font-family--serif
              vads-u-font-weight--bold eyb-value-header"
              aria-label={value}
            >
              {value}
              {screenReaderSpan}
            </p>
          </div>
        ) : (
          <div>
            {value}
            {screenReaderSpan}
          </div>
        )}
      </div>
    </div>
  ) : null;

const perTermSections = (outputs, calculator) => {
  const { perTerm } = outputs;

  const sections = Object.keys(perTerm).map(section => {
    const { visible, title, learnMoreAriaLabel, terms } = outputs.perTerm[
      section
    ];
    if (!visible) return null;

    const learnMoreLink = `http://www.benefits.va.gov/gibill/comparison_tool/about_this_tool.asp#${section.toLowerCase()}`;

    return (
      <div key={section} className="per-term-section">
        <div className="link-header">
          <h4>{title}</h4>
          &nbsp;(
          <a
            href={learnMoreLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={learnMoreAriaLabel || ''}
          >
            Learn more
          </a>
          )
        </div>

        {terms.map(term => (
          <CalculatorResultRow
            key={`${section}${term.label}`}
            id={`${section}${term.label}`}
            label={
              calculator.type === 'OJT' ? termLabel(term.label) : term.label
            }
            value={term.value}
            bold={term.label === 'Total per year'}
            screenReaderSpan={calculator.type === 'OJT' ? month : ''}
            visible={term.visible}
          />
        ))}
      </div>
    );
  });

  return (
    <div>
      <h3>
        Estimated benefits per {calculator.type === 'OJT' ? 'month' : 'term'}
      </h3>
      {sections}
    </div>
  );
};

export const EstimatedBenefits = ({ profile, outputs, calculator }) => (
  <div className="medium-6 columns your-estimated-benefits">
    <h3 id="estimated-benefits" tabIndex="-1">
      Your estimated benefits
    </h3>
    <div aria-live="polite" role="status" className="out-of-pocket-tuition">
      <CalculatorResultRow
        label="GI Bill pays to school"
        value={outputs.giBillPaysToSchool.value}
        visible={outputs.giBillPaysToSchool.visible}
        screenReaderSpan={year}
        header
      />
      <CalculatorResultRow
        label="Tuition and fees charged"
        value={outputs.tuitionAndFeesCharged.value}
        visible={outputs.tuitionAndFeesCharged.visible}
      />
      <CalculatorResultRow
        label="Your scholarships"
        value={outputs.yourScholarships.value}
        visible={outputs.yourScholarships.visible}
      />
      <CalculatorResultRow
        label="Out of pocket tuition"
        value={outputs.outOfPocketTuition.value}
        bold
        visible={outputs.outOfPocketTuition.visible}
      />
    </div>
    <div className="total-paid-to-you">
      <CalculatorResultRow
        label="Housing allowance"
        value={outputs.housingAllowance.value}
        visible={outputs.housingAllowance.visible}
        screenReaderSpan={month}
        header
      />
      <CalculatorResultRow
        label="Book stipend"
        value={outputs.bookStipend.value}
        visible={outputs.bookStipend.visible}
        screenReaderSpan={profile.attributes.type === 'ojt' ? month : year}
        header
      />
      <CalculatorResultRow
        label="Total paid to you"
        value={outputs.totalPaidToYou.value}
        bold
        visible={outputs.totalPaidToYou.visible}
      />
    </div>
    <hr aria-hidden="true" />
    {perTermSections(outputs, calculator)}
  </div>
);

export default EstimatedBenefits;
