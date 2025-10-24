import React from 'react';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useSelector } from 'react-redux';

const YellowRibbonProgramDescription = () => {
  const institutionDetails = useSelector(
    state => state.form?.data?.institutionDetails,
  );
  const { isUsaSchool } = institutionDetails || {};
  const uiList = (
    <div className="yellow-program-list">
      <p>
        {isUsaSchool
          ? 'You’ll be asked to provide:'
          : 'In this step, you’ll be asked to enter the following information for each Yellow Ribbon Program contribution your school is offering:'}
      </p>
      <ul className="vads-u-width--full">
        {isUsaSchool ? (
          <>
            <li>
              The maximum number of students your school will support. If your
              school plans to support an unlimited number of qualifying
              students, you can enter "unlimited."
            </li>
            <li>The degree level</li>
            <li>
              The name of the college or professional school, if applicable
            </li>
            <li>
              The maximum annual contribution amount per student. Enter the
              total amount your school plans to contribute each year, not by
              term or credit hour. If the amount entered is over $99,999, the
              system will treat it as an unlimited contribution.
            </li>
          </>
        ) : (
          <>
            <li>
              The maximum number of students your school will support. If your
              school plans to support an unlimited number of qualifying
              students, you can enter “unlimited.”
            </li>
            <li>The degree level</li>
            <li>The currency your school uses for billing</li>
            <li>
              The maximum annual contribution amount per student. Enter the
              total amount your school plans to contribute each year in your
              institution’s official billing currency, not by term or credit
              hour. If the amount entered is over $99,999 USD, the system will
              treat it as an unlimited contribution.
            </li>
          </>
        )}
      </ul>
    </div>
  );
  return (
    <div className="yellow-ribbon-program-description">
      <p>
        You’ll first be asked to enter the total number of eligible individuals
        your school agrees to support, along with the academic year for which
        the agreement applies.
      </p>
      <VaAlert status="info" class="vads-u-margin-top--3">
        Note: The number of eligible individuals must match the maximum number
        of students listed in the contributions details section that follows.
      </VaAlert>
      {isUsaSchool && (
        <p data-testid="us-school-text">
          Next, you’ll enter information about the Yellow Ribbon Program
          contributions your school is offering for that academic year.
        </p>
      )}
      {uiList}
      <p>
        You can add more entries if your school offers different contributions
        based on degree level, college, or other factors.
      </p>
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
