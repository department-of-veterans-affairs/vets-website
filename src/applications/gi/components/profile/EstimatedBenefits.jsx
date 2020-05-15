import React from 'react';
import classNames from 'classnames';
import { createId } from '../../utils/helpers';

export const CalculatorResultRow = ({
  id,
  label,
  value,
  header,
  bold,
  visible,
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
        {header ? <h5>{value}</h5> : <div>{value}</div>}
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
            label={term.label}
            value={term.value}
            bold={term.label === 'Total per year'}
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

export const EstimatedBenefits = ({ outputs, calculator }) => (
  <div className="medium-6 columns your-estimated-benefits vads-u-margin-right--0">
    <h3 id="estimated-benefits" tabIndex="-1">
      Your estimated benefits
    </h3>
    <div className="out-of-pocket-tuition">
      <CalculatorResultRow
        label="GI Bill pays to school"
        value={outputs.giBillPaysToSchool.value}
        visible={outputs.giBillPaysToSchool.visible}
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
        header
      />
      <CalculatorResultRow
        label="Book stipend"
        value={outputs.bookStipend.value}
        visible={outputs.bookStipend.visible}
        header
      />
      <CalculatorResultRow
        label="Total paid to you"
        value={outputs.totalPaidToYou.value}
        bold
        visible={outputs.totalPaidToYou.visible}
      />
    </div>
    <hr />
    {perTermSections(outputs, calculator)}
  </div>
);

export default EstimatedBenefits;
