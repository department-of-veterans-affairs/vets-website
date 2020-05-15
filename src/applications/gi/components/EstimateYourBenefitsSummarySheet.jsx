import React from 'react';
import classNames from 'classnames';

const CalculatorSheetResultRow = ({
  id,
  label,
  value,
  header,
  visible,
  bold,
  boldLabel,
  plainTextValue,
}) =>
  visible ? (
    <div
      id={`calculator-result-row-${id == null ? label : id}`}
      className={classNames('row', 'calculator-result', { bold })}
    >
      <div className="small-8 columns">
        {header ? (
          <h5 className="vads-u-margin-y--0">{label}:</h5>
        ) : (
          <div
            className={classNames('vads-u-margin-y--0 ', {
              'vads-u-font-weight--bold': boldLabel,
            })}
          >
            {label}:
          </div>
        )}
      </div>
      <div className="small-4 columns vads-u-text-align--right">
        {header && !plainTextValue ? (
          <h5 className="vads-u-margin-y--0">{value}</h5>
        ) : (
          <div className="vads-u-margin-y--0">{value}</div>
        )}
      </div>
    </div>
  ) : null;

export const EstimateYourBenefitsSummarySheet = props => (
  <div className="vads-u-padding-bottom--1p5 vads-u-border-top--1px vads-u-border-color--gray-light">
    <button
      aria-expanded={props.expandEybSheet ? 'true' : 'false'}
      className="eyb-button usa-accordion-button vads-u-padding-bottom--0"
      onClick={() => props.toggleEybExpansion()}
    >
      {props.expandEybSheet ? (
        <h4>Your estimated benefits</h4>
      ) : (
        <h5>Your estimated benefits</h5>
      )}
    </button>
    <div className="vads-u-margin-x--2p5">
      {props.expandEybSheet ? (
        <div>
          <div className="out-of-pocket-tuition">
            <div className="vads-u-margin-y--1p5">
              <CalculatorSheetResultRow
                label="GI Bill pays to school"
                value={props.outputs.giBillPaysToSchool.value}
                header
                visible={props.outputs.giBillPaysToSchool.visible}
              />
            </div>
            <div className="vads-u-margin-y--0p5">
              <CalculatorSheetResultRow
                label="Tuition and fees charged"
                value={props.outputs.tuitionAndFeesCharged.value}
                visible={props.outputs.tuitionAndFeesCharged.visible}
              />
            </div>
            <div className="vads-u-margin-top--1 vads-u-margin-bottom--0">
              <CalculatorSheetResultRow
                label="Your scholarships"
                value={props.outputs.yourScholarships.value}
                visible={props.outputs.yourScholarships.visible}
              />
            </div>
            <div className="vads-u-margin-top--1 vads-u-margin-bottom--1p5">
              <CalculatorSheetResultRow
                label="Out of pocket tuition"
                value={props.outputs.outOfPocketTuition.value}
                bold
                visible={props.outputs.outOfPocketTuition.visible}
              />
            </div>
          </div>
          <div className="vads-u-margin-top--1 vads-u-margin-bottom--2">
            <CalculatorSheetResultRow
              label="Housing allowance"
              value={props.outputs.housingAllowance.value}
              header
              visible={props.outputs.housingAllowance.visible}
            />
          </div>
          <div className="vads-u-margin-top--1p5 vads-u-margin-bottom--1p5">
            <CalculatorSheetResultRow
              label="Book stipend"
              value={props.outputs.bookStipend.value}
              header
              visible={props.outputs.bookStipend.visible}
            />
          </div>
          <div className="vads-u-margin-y--1p5">
            <CalculatorSheetResultRow
              label="Yellow Ribbon"
              bold
              value={
                props.outputs.perTerm.yellowRibbon.terms.find(
                  item => item.label === 'Total per year',
                ).value
              }
              visible={props.yellowRibbon}
            />
          </div>
          <div className="vads-u-margin-y--1">
            <CalculatorSheetResultRow
              label="Total paid to you"
              value={props.outputs.totalPaidToYou.value}
              bold
              visible={props.outputs.totalPaidToYou.visible}
            />
          </div>
          {props.type === 'OJT' && (
            <div>
              <hr className="vads-u-margin-y--2" />
              <h4 className="vads-u-margin-y--0">
                Estimated benefits per month
              </h4>
              <h5 className="vads-u-margin-y--1p5p5">Housing Allowance</h5>
              {props.outputs.perTerm.housingAllowance.visible &&
                props.outputs.perTerm.housingAllowance.terms.map(term => (
                  <CalculatorSheetResultRow
                    key={`${term.label}`}
                    label={term.label}
                    value={term.value}
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
            plainTextValue
            visible={props.outputs.giBillPaysToSchool.visible}
            className="vads-u-margin-y--4"
          />
          <CalculatorSheetResultRow
            label="Housing allowance"
            value={props.outputs.housingAllowance.value}
            boldLabel
            plainTextValue
            visible={props.outputs.housingAllowance.visible}
          />
          <CalculatorSheetResultRow
            label="Book stipend"
            value={props.outputs.bookStipend.value}
            boldLabel
            plainTextValue
            visible={props.outputs.bookStipend.visible}
          />
        </div>
      )}
    </div>
  </div>
);

export default EstimateYourBenefitsSummarySheet;
