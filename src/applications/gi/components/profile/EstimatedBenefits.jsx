import React from 'react';
import classNames from 'classnames';
import _ from 'lodash';
import { createId } from '../../utils/helpers';
import LearnMoreLabel from '../LearnMoreLabel';

export default function EstimatedBenefits({
  outputs,
  calculator,
  isOJT,
  dispatchShowModal,
  estimatedBenefitsRef,
}) {
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
    eybH4,
  }) =>
    visible ? (
      <li
        id={`calculator-result-row-${createId(id == null ? label : id)}`}
        className={
          eybH4
            ? 'vads-u-margin-bottom--neg0p5 eyb-h4 row calculator-result'
            : classNames('row', 'calculator-result', {
                'vads-u-font-weight--bold': bold,
              })
        }
      >
        {header ? (
          <h4 className="small-6 columns">{label}:</h4>
        ) : (
          <p className="small-6 columns vads-u-text-align--left">{label}:</p>
        )}
        {header ? (
          <p
            className="small-6 columns vads-u-text-align--right vads-u-font-size--h5 vads-u-font-family--serif
              vads-u-font-weight--bold eyb-value-header"
          >
            {value}
            {screenReaderSpan}
          </p>
        ) : (
          <p className="small-6 columns vads-u-text-align--right">
            {value}
            {screenReaderSpan}
          </p>
        )}
      </li>
    ) : null;

  const perTermSections = () => {
    const { perTerm } = outputs;

    const sections = Object.keys(perTerm).map(section => {
      const {
        visible,
        title,
        learnMoreAriaLabel,
        terms,
        modal,
      } = outputs.perTerm[section];
      if (!visible) return null;

      const learnMoreLink = `http://www.benefits.va.gov/gibill/comparison_tool/about_this_tool.asp#${section.toLowerCase()}`;
      const headerId = `${_.snakeCase(title)}_header`;

      return (
        <div key={section} className="per-term-section">
          <LearnMoreLabel
            text={title}
            onClick={() => {
              if (modal) {
                dispatchShowModal(modal);
              } else {
                window.open(learnMoreLink, '_blank');
              }
            }}
            ariaLabel={learnMoreAriaLabel}
            bold
            buttonId={createId(`${title} learn more`)}
          />

          {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
          <ul aria-labelledby={headerId} role="list">
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
          </ul>
        </div>
      );
    });

    return (
      <div>
        <h3 className="small-screen-header">
          Estimated benefits per {calculator.type === 'OJT' ? 'month' : 'term'}
        </h3>
        {sections}
      </div>
    );
  };

  return (
    <div className="medium-6 columns">
      <div className="your-estimated-benefits">
        <h3
          ref={estimatedBenefitsRef}
          id="estimated-benefits small-screen-header"
          tabIndex="-1"
        >
          Your estimated benefits
        </h3>
        <h4 id="estimated-benefits-note small-screen-header">
          Note: We round your estimated benefits to the nearest dollar
        </h4>
        <div aria-atomic="true" aria-live="polite" role="status">
          {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
          <ul
            aria-label="Out-of-pocket tuition"
            className="out-of-pocket-tuition"
            role="list"
          >
            <CalculatorResultRow
              label="GI Bill pays to school"
              value={outputs.giBillPaysToSchool.value}
              visible={outputs.giBillPaysToSchool.visible}
              screenReaderSpan={year}
              bold
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
          </ul>
          {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
          <ul
            aria-label="Total paid to you"
            className="total-paid-to-you"
            role="list"
          >
            <CalculatorResultRow
              label="Housing allowance"
              value={outputs.housingAllowance.value}
              visible={outputs.housingAllowance.visible}
              screenReaderSpan={month}
              bold
            />
            <CalculatorResultRow
              label={
                <LearnMoreLabel
                  text="Book stipend"
                  onClick={() => {
                    dispatchShowModal('bookStipendInfo');
                  }}
                  ariaLabel="Learn more about the book stipend"
                  buttonId="book-stipend-learn-more"
                />
              }
              id="book-stipend"
              value={outputs.bookStipend.value}
              visible={outputs.bookStipend.visible}
              screenReaderSpan={year}
              bold
            />
            <CalculatorResultRow
              label="Total paid to you"
              value={outputs.totalPaidToYou.value}
              visible={outputs.totalPaidToYou.visible}
              bold
            />
          </ul>
        </div>
        <hr aria-hidden="true" />
        {perTermSections()}
      </div>
      {isOJT && (
        <div className="row">
          <div className="columns ">
            <p className="vads-u-padding-x--0p5 vads-u-margin--0">
              <strong>Note:</strong> Housing rate and the amount of entitlement
              used decrease every 6 months as training progresses
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
