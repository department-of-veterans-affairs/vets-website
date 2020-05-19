import React from 'react';
import { createId } from '../utils/helpers';
import classNames from 'classnames';

const CalculatorSheetResultRow = ({
  id,
  label,
  value,
  header,
  bold,
  visible,
  boldLabel,
  boldValue,
  plainTextValue,
}) => {
  const boldAll = !boldLabel && !boldValue && bold;
  const boldClass = boldCheck =>
    boldCheck ? 'vads-u-font-weight--bold' : null;

  return visible ? (
    <div
      id={`summary-sheet-calculator-result-row-${createId(
        id == null ? label : id,
      )}`}
      className={classNames('row', 'calculator-result', boldClass(boldAll))}
    >
      <div className="small-8 columns">
        {header ? (
          <h5 className="vads-u-margin-y--0">{label}:</h5>
        ) : (
          <div
            className={classNames('vads-u-margin-y--0 ', boldClass(boldLabel))}
          >
            {label}:
          </div>
        )}
      </div>
      <div className="small-4 columns vads-u-text-align--right">
        {header && !plainTextValue ? (
          <h5 className="vads-u-margin-y--0">{value}</h5>
        ) : (
          <div
            className={classNames('vads-u-margin-y--0 ', boldClass(boldValue))}
          >
            {value}
          </div>
        )}
      </div>
    </div>
  ) : null;
};

export const EstimateYourBenefitsSummarySheet = props => (
  <div className="vads-u-padding-bottom--1p5 vads-u-border-top--1px vads-u-border-color--gray-light">
    <button
      aria-expanded={props.expandEybSheet ? 'true' : 'false'}
      className="eyb-button usa-accordion-button"
      onClick={() => props.toggleEybExpansion()}
    >
      Your estimated benefits
    </button>
    <div className="vads-u-margin-x--2p5">
      {props.expandEybSheet ? (
        <div>
          <div className="out-of-pocket-tuition">
            <CalculatorSheetResultRow
              label="GI Bill pays to school"
              value={props.outputs.giBillPaysToSchool.value}
              bold
              visible={props.outputs.giBillPaysToSchool.visible}
            />
            <CalculatorSheetResultRow
              label="Tuition and fees charged"
              value={props.outputs.tuitionAndFeesCharged.value}
              visible={props.outputs.tuitionAndFeesCharged.visible}
            />
            <CalculatorSheetResultRow
              label="Your scholarships"
              value={props.outputs.yourScholarships.value}
              visible={props.outputs.yourScholarships.visible}
            />
            <CalculatorSheetResultRow
              label="Out of pocket tuition"
              value={props.outputs.outOfPocketTuition.value}
              bold
              visible={props.outputs.outOfPocketTuition.visible}
            />
          </div>
          <CalculatorSheetResultRow
            label="Housing allowance"
            value={props.outputs.housingAllowance.value}
            bold
            visible={props.outputs.housingAllowance.visible}
          />

          <CalculatorSheetResultRow
            label="Book stipend"
            value={props.outputs.bookStipend.value}
            bold
            visible={props.outputs.bookStipend.visible}
          />
          <CalculatorSheetResultRow
            label="Yellow Ribbon"
            value={
              props.outputs.perTerm.yellowRibbon.terms.find(
                item => item.label === 'Total per year',
              ).value
            }
            bold
            visible={props.yellowRibbon}
          />
          <CalculatorSheetResultRow
            label="Total paid to you"
            value={props.outputs.totalPaidToYou.value}
            bold
            visible={props.outputs.totalPaidToYou.visible}
          />
          {props.type === 'OJT' && (
            <div>
              <hr className="vads-u-margin-y--2" />
              <h4 className="vads-u-margin-y--0">
                Estimated benefits per month
              </h4>
              <h5 className="vads-u-margin-y--1p5">Housing allowance</h5>
              {props.outputs.perTerm.housingAllowance.visible &&
                props.outputs.perTerm.housingAllowance.terms.map(term => (
                  <CalculatorSheetResultRow
                    key={`${term.label}`}
                    label={term.label}
                    value={term.value}
                    bold={term.label === 'Total per year'}
                    visible={term.visible}
                  />
                ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          <CalculatorSheetResultRow
            label="GI Bill pays to school"
            value={props.outputs.giBillPaysToSchool.value}
            boldLabel
            visible={props.outputs.giBillPaysToSchool.visible}
          />
          <CalculatorSheetResultRow
            label="Housing allowance"
            value={props.outputs.housingAllowance.value}
            boldLabel
            visible={props.outputs.housingAllowance.visible}
          />
          <CalculatorSheetResultRow
            label="Book stipend"
            value={props.outputs.bookStipend.value}
            boldLabel
            visible={props.outputs.bookStipend.visible}
          />
        </div>
      )}
    </div>
  </div>
);

export default EstimateYourBenefitsSummarySheet;
