import React from 'react';
import { useSelector } from 'react-redux';

const YellowRibbonProgramDescription = () => {
  const institutionDetails = useSelector(
    state => state.form?.data?.institutionDetails,
  );
  const { isUsaSchool } = institutionDetails || {};
  const uiList = (
    <div className="yellow-program-list">
      {isUsaSchool && (
        <p className="vads-u-margin-bottom--3">
          You’ll enter information about the Yellow Ribbon Program contributions
          your school is offering for that academic year.
        </p>
      )}
      <p>
        {isUsaSchool
          ? 'You’ll be asked to provide:'
          : 'In this step, you’ll be asked to enter the following information for each Yellow Ribbon Program contribution your school is offering:'}
      </p>
      <ul className="vads-u-width--full">
        {isUsaSchool ? (
          <>
            <li
              className="vads-u-margin-bottom--1 vads-u-margin-left--1 vads-u-padding-left--2p5"
              data-testid="us-school-text"
            >
              The maximum number or unlimited number of students your school
              will support
            </li>
            <li className="vads-u-margin-bottom--1 vads-u-margin-left--1 vads-u-padding-left--2p5">
              The degree level
            </li>
            <li className="vads-u-margin-bottom--1 vads-u-margin-left--1 vads-u-padding-left--2p5">
              The name of the college or professional school, if applicable
            </li>
            <li className="vads-u-margin-bottom--1 vads-u-margin-left--1 vads-u-padding-left--2p5">
              The maximum annual contribution amount per student, or pay
              remaining mandatory tuition and fees not covered by Post-9/11 GI
              Bill (unlimited). Enter the total amount your school plans to
              contribute each year, not by term or credit hour. If the amount
              entered is equal to or greater than $99,999, the system will treat
              it as an unlimited contribution.
            </li>
          </>
        ) : (
          <>
            <li
              className="vads-u-margin-bottom--1 vads-u-margin-left--1 vads-u-padding-left--2p5"
              data-testid="foreign-school-text"
            >
              The maximum number of students your school will support. If your
              school plans to support an unlimited number of qualifying
              students, you can enter “unlimited.”
            </li>
            <li className="vads-u-margin-bottom--1 vads-u-margin-left--1 vads-u-padding-left--2p5">
              The degree level
            </li>
            <li className="vads-u-margin-bottom--1 vads-u-margin-left--1 vads-u-padding-left--2p5">
              The currency your school uses for billing
            </li>
            <li className="vads-u-margin-bottom--1 vads-u-margin-left--1 vads-u-padding-left--2p5">
              The maximum annual contribution amount per student, or pay
              remaining mandatory tuition and fees not covered by Post-9/11 GI
              Bill (unlimited). Enter the total amount your school plans to
              contribute each year in your institution’s official billing
              currency, not by term or credit hour. If the amount entered is
              equal to or greater than $99,999 USD, the system will treat it as
              an unlimited contribution.
            </li>
          </>
        )}
      </ul>
    </div>
  );
  return (
    <div className="yellow-ribbon-program-description">
      {uiList}
      {isUsaSchool ? (
        <p>
          You can add more entries if your school offers different contributions
          based on degree level, college, or other factors.
        </p>
      ) : (
        <p>
          You may add more entries if your school offers different contributions
          based on degree level or other factors.
        </p>
      )}
      {!isUsaSchool && (
        <p data-testid="foreign-school-text">
          Before continuing, please confirm that your school agrees to provide
          Yellow Ribbon contributions as described.
        </p>
      )}
    </div>
  );
};

export default YellowRibbonProgramDescription;
