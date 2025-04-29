import React, { useLayoutEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { format, isValid } from 'date-fns';
import { connect } from 'react-redux';

import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { focusElement } from 'platform/utilities/ui';
import FormFooter from 'platform/forms/components/FormFooter';
import { Toggler } from 'platform/utilities/feature-toggles';

import { ConfirmationView } from 'platform/forms-system/src/js/components/ConfirmationView';
import { DevOnlyTestVariations } from '../components/DevOnlyTestVariations';
import GetFormHelp from '../../shared/components/GetFormHelp';
import {
  hasActiveCompensationITF,
  hasActivePensionITF,
  confirmationPageFormBypassed,
  confirmationPageAlertStatus,
  confirmationPageAlertHeadline,
  confirmationPageAlertHeadlineV2,
  confirmationPageAlertParagraph,
  confirmationPageNextStepsParagraph,
  confirmationPageAlertParagraphV2,
} from '../config/helpers';
import {
  veteranBenefits,
  survivingDependentBenefits,
  submissionApis,
} from '../definitions/constants';

const { COMPENSATION, PENSION } = veteranBenefits;
const { SURVIVOR } = survivingDependentBenefits;

const NextSteps = ({ formData }) => (
  <div>
    <h2>What are my next steps?</h2>
    {confirmationPageNextStepsParagraph(formData) ? (
      <>
        <p>You should complete and file your claims as soon as possible.</p>
        <p>{confirmationPageNextStepsParagraph(formData)}</p>
      </>
    ) : (
      <>
        <p>You should complete and file your claims as soon as possible.</p>
        <p>
          If you complete and file your claim before the intent to file expires
          and we approve your claim, you may be able to get retroactive
          payments. Retroactive payments are payments for the time between when
          we processed your intent to file and when we approved your claim.
        </p>
      </>
    )}
  </div>
);

const ActionLinksToCompleteClaims = ({ formData }) => (
  <>
    {(hasActiveCompensationITF({ formData }) ||
      formData.benefitSelection[COMPENSATION]) && (
      <div>
        <va-link-action
          href="/disability/file-disability-claim-form-21-526ez/introduction"
          text="Complete your disability compensation claim"
          type="secondary"
        />
      </div>
    )}
    {(hasActivePensionITF({ formData }) ||
      formData.benefitSelection[PENSION]) && (
      <div>
        <va-link-action
          href="/pension/file-pension-claim-form-21p-527ez/introduction"
          text="Complete your pension claim"
          type="secondary"
        />
      </div>
    )}
    {formData.benefitSelection[SURVIVOR] && (
      <div>
        <va-link-action
          href="/find-forms/about-form-21p-534ez/"
          text="Complete your pension for survivors claim"
          type="secondary"
        />
      </div>
    )}
  </>
);

const CompensationAction = () => (
  <div>
    <va-link-action
      href="/disability/file-disability-claim-form-21-526ez/introduction"
      text="Complete your disability compensation claim"
      type="secondary"
    />
  </div>
);

const PensionAction = () => (
  <div>
    <va-link-action
      href="/pension/file-pension-claim-form-21p-527ez/introduction"
      text="Complete your pension claim"
      type="secondary"
    />
  </div>
);

const SurvivorAction = () => (
  <div>
    <va-link-action
      href="/find-forms/about-form-21p-534ez/"
      text="Complete your pension for survivors claim"
      type="secondary"
    />
  </div>
);

const PensionExistingAction = ({ formData }) => (
  <div>
    <p>
      Our records show that you already have an intent to file for pension
      claims. Your intent to file for pension claims expires on{' '}
      {format(
        new Date(formData['view:activePensionITF'].expirationDate),
        'MMMM d, yyyy',
      )}
      .
    </p>
    <PensionAction />
  </div>
);

const CompensationExistingAction = ({ formData }) => (
  <div>
    <p>
      Our records show that you already have an intent to file for disability
      compensation. Your intent to file for disability compensation expires on{' '}
      {format(
        new Date(formData['view:activeCompensationITF'].expirationDate),
        'MMMM d, yyyy',
      )}
      .
    </p>
    <CompensationAction />
  </div>
);

const newActionMap = {
  [COMPENSATION]: CompensationAction,
  [PENSION]: PensionAction,
  [SURVIVOR]: SurvivorAction,
};

const existingActionMap = {
  [COMPENSATION]: CompensationExistingAction,
  [PENSION]: PensionExistingAction,
};

/**
 * Returns a data only object of string constants like this:
 * {
 *   actionsNew: ["compensation", "pension"],
 *   actionsExisting: ["compensation", "pension"]
 * }
 *
 * This makes it easier to test the logic in isolation without rendering
 */
export const getNextStepsActionsPlaceholders = formData => {
  const actionsExisting = [];
  const actionsNew = [];

  const isCompensationApplicable =
    hasActiveCompensationITF({ formData }) ||
    formData.benefitSelection?.[COMPENSATION];

  const isPensionApplicable =
    hasActivePensionITF({ formData }) || formData.benefitSelection?.[PENSION];

  const isSurvivorApplicable = formData.benefitSelection?.[SURVIVOR];
  const hasCompensationExisting = hasActiveCompensationITF({ formData });
  const hasPensionExisting = hasActivePensionITF({ formData });

  if (hasCompensationExisting) {
    actionsExisting.push(COMPENSATION);
  } else if (isCompensationApplicable) {
    actionsNew.push(COMPENSATION);
  }

  if (hasPensionExisting) {
    actionsExisting.push(PENSION);
  } else if (isPensionApplicable) {
    actionsNew.push(PENSION);
  }

  if (isSurvivorApplicable) {
    actionsNew.push(SURVIVOR);
  }

  return { actionsNew, actionsExisting };
};

const NextStepsV2Actions = ({ formData }) => {
  let { actionsNew, actionsExisting } = getNextStepsActionsPlaceholders(
    formData,
  );

  // convert arrays of strings to arrays of JSX
  // e.g. ["compensation", "pension"] => [<CompensationAction />, <PensionAction />]
  actionsNew = actionsNew.map(action => {
    const Component = newActionMap[action];
    return <Component key={action} />;
  });
  actionsExisting = actionsExisting.map(action => {
    const Component = existingActionMap[action];
    return <Component key={action} formData={formData} />;
  });

  return (
    <div>
      {actionsNew}
      {actionsExisting}
    </div>
  );
};

const NextStepsV2 = ({ formData }) => {
  return (
    <div>
      <h2>What are my next steps?</h2>
      {confirmationPageNextStepsParagraph(formData) ? (
        <>
          <p>You should complete and file your claims as soon as possible.</p>
          <p>{confirmationPageNextStepsParagraph(formData)}</p>
        </>
      ) : (
        <>
          <p>You should complete and file your claims as soon as possible.</p>
          <p>
            If you complete and file your claim before the intent to file
            expires and we approve your claim, you may be able to get
            retroactive payments. Retroactive payments are payments for the time
            between when we processed your intent to file and when we approved
            your claim.
          </p>
        </>
      )}
      <NextStepsV2Actions formData={formData} />
    </div>
  );
};

const AlreadySubmittedHeader = ({ formData }) => (
  <>
    {!confirmationPageFormBypassed(formData) && (
      <>
        {hasActiveCompensationITF({ formData }) &&
          formData.benefitSelection[PENSION] && (
            <div>
              <h2>
                You’ve already submitted an intent to file for disability
                compensation
              </h2>
              <p>
                Our records show that you already have an intent to file for
                disability compensation. Your intent to file for disability
                compensation expires on{' '}
                {format(
                  new Date(
                    formData['view:activeCompensationITF'].expirationDate,
                  ),
                  'MMMM d, yyyy',
                )}
                .
              </p>
            </div>
          )}
        {hasActivePensionITF({ formData }) &&
          formData.benefitSelection[COMPENSATION] && (
            <div>
              <h2>
                You’ve already submitted an intent to file for pension claims
              </h2>
              <p>
                Our records show that you already have an intent to file for
                pension claims. Your intent to file for pension claims expires
                on{' '}
                {format(
                  new Date(formData['view:activePensionITF'].expirationDate),
                  'MMMM d, yyyy',
                )}
                .
              </p>
            </div>
          )}
      </>
    )}
  </>
);

export const ConfirmationPage = props => {
  useLayoutEffect(() => {
    focusElement('h2', null, 'va-alert');
    scrollToTop('topScrollElement');
  }, []);

  const { form, route } = props;
  const { submission, data } = form;

  const currentFormData = {
    ...data,
    benefitSelection: {
      [COMPENSATION]:
        data.benefitSelection?.[COMPENSATION] ||
        data.benefitSelectionCompensation,
      [PENSION]:
        data.benefitSelection?.[PENSION] || data.benefitSelectionPension,
      [SURVIVOR]: data.benefitSelection?.[SURVIVOR],
    },
  };

  const [formData, setFormData] = useState(currentFormData);
  const [submissionResponse, setSubmissionResponse] = useState(
    submission.response,
  );
  const submissionApi = submissionResponse?.submissionApi;
  const confirmationNumber = submissionResponse?.confirmationNumber;
  const [submitDate, setSubmitDate] = useState(submission.timestamp);
  const { statementOfTruthSignature } = formData;

  return (
    <Toggler toggleName={Toggler.TOGGLE_NAMES.form210966ConfirmationPage}>
      <Toggler.Enabled>
        <ConfirmationView
          submitDate={submitDate}
          confirmationNumber={confirmationNumber}
          formConfig={route?.formConfig}
          pdfUrl={submissionResponse?.pdfUrl}
        >
          <ConfirmationView.SubmissionAlert
            title={confirmationPageAlertHeadlineV2({
              formData,
              submissionApi,
              submitDate,
            })}
            status={confirmationPageAlertStatus(formData)}
            content={confirmationPageAlertParagraphV2({
              formData,
              submissionApi,
              expirationDate: submissionResponse?.expirationDate,
              confirmationNumber,
            })}
            actions={<></>}
          />
          {!confirmationPageFormBypassed(formData) && (
            <>
              <ConfirmationView.SavePdfDownload
                pdfUrl={submissionResponse?.pdfUrl}
              />
              <ConfirmationView.ChapterSectionCollection />
              <ConfirmationView.PrintThisPage />
              {submissionApi === submissionApis.BENEFITS_INTAKE && (
                <ConfirmationView.WhatsNextProcessList
                  item1Header="We’ll confirm that we’ve received your form"
                  item1Content="We will contact you when we have received your submission. This can take up to 30 days."
                  item2Header="Next, we’ll review your form"
                  item2Content={
                    <p>
                      After we review your form, we’ll confirm next steps. Then
                      you’ll have 1 year to file your claim.
                    </p>
                  }
                  item1Actions={<></>}
                />
              )}
            </>
          )}
          <NextStepsV2 formData={formData} />
          <ConfirmationView.HowToContact />
          <ConfirmationView.GoBackLink />
          <ConfirmationView.NeedHelp />
          <DevOnlyTestVariations
            formData={formData}
            setFormData={setFormData}
            submissionResponse={submissionResponse}
            setSubmissionResponse={setSubmissionResponse}
            submitDate={submitDate}
            setSubmitDate={setSubmitDate}
          />
        </ConfirmationView>
      </Toggler.Enabled>
      <Toggler.Disabled>
        <>
          <div className="print-only">
            <img
              src="https://www.va.gov/img/design/logo/logo-black-and-white.png"
              alt="VA logo"
              width="300"
            />
          </div>
          <va-alert
            close-btn-aria-label="Close notification"
            status={confirmationPageAlertStatus(formData)}
            visible
            uswds
          >
            <h2 slot="headline">{confirmationPageAlertHeadline(formData)}</h2>
            <p className="vads-u-margin-bottom--0">
              {confirmationPageAlertParagraph(formData)}
            </p>
          </va-alert>
          {!confirmationPageFormBypassed(formData) && (
            <div className="inset">
              <h3 className="vads-u-margin-top--1" slot="headline">
                Your submission information
              </h3>
              <dl>
                {statementOfTruthSignature && (
                  <>
                    <dt>
                      <h4>Who submitted this form</h4>
                    </dt>
                    <dd>{statementOfTruthSignature}</dd>
                  </>
                )}
                {confirmationNumber && (
                  <>
                    <dt>
                      <h4>Confirmation number</h4>
                    </dt>
                    <dd>{confirmationNumber}</dd>
                  </>
                )}
                {isValid(submitDate) && (
                  <>
                    <dt>
                      <h4>Date submitted</h4>
                    </dt>
                    <dd>{format(submitDate, 'MMMM d, yyyy')}</dd>
                  </>
                )}
                <dt>
                  <h4>Confirmation for your records</h4>
                </dt>
                <dd>You can print this confirmation page for your records</dd>
              </dl>
              <va-button onClick={window.print} text="Print this page" />
            </div>
          )}
          <AlreadySubmittedHeader formData={formData} />
          <NextSteps formData={formData} />
          <ActionLinksToCompleteClaims formData={formData} />
          {!confirmationPageFormBypassed(formData) && (
            <a
              className="vads-c-action-link--green vads-u-margin-y--2"
              href="/"
            >
              Go back to VA.gov
            </a>
          )}
          <div>
            <FormFooter formConfig={{ getHelp: GetFormHelp }} />
          </div>
        </>
      </Toggler.Disabled>
    </Toggler>
  );
};

ConfirmationPage.propTypes = {
  form: PropTypes.shape({
    data: PropTypes.shape({
      statementOfTruthSignature: PropTypes.string,
    }),
    formId: PropTypes.string,
    submission: PropTypes.shape({
      response: PropTypes.shape({
        confirmationNumber: PropTypes.string,
        expirationDate: PropTypes.string,
        compensationIntent: PropTypes.shape(),
        pensionIntent: PropTypes.shape(),
        survivorIntent: PropTypes.shape(),
        submissionApi: PropTypes.string,
      }),
      timestamp: PropTypes.any,
    }),
  }),
  name: PropTypes.string,
  route: PropTypes.shape({
    formConfig: PropTypes.object,
  }),
};

function mapStateToProps(state) {
  return {
    form: state.form,
  };
}

export default connect(mapStateToProps)(ConfirmationPage);
