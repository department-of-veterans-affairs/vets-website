import { VaCard, VaLink } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { withRouter } from 'react-router';


const BusinessPersonal = ({
    formData,
}) => {
    // const [error] = useState(false);
    // const dispatch = useDispatch();
    const businessPersonalUI = (
        <>
            <div display="flex" flex-direction="row" gap="4">
                <VaCard
                    icon-name="account_circle"
                >
                    <div>
                        <h3 className="vads-u-margin-top--1">
                            Personal Support
                        </h3>
                        <p>
                            Use this option if you're a Veteran, family member, caregiver, or survivor - or if your asking a question for a veteran you know personally.
                        </p>
                        <VaLink className="vads-c-action-link--blue" to="/your-personal-information">
                            Ask a question
                        </VaLink>
                    </div>
                </VaCard>
                <VaCard
                    icon-name="work"
                >
                    <div>
                        <h3 className="vads-u-margin-top--1">
                            Work-related Support
                        </h3>
                        <p>
                            Use this option if you are from an organization contacting VA about a Veteran as a part of your job (for example, a VSO, provider or case manager).
                        </p>
                        <VaLink className="vads-c-action-link--blue" to="/">
                            Ask a question
                        </VaLink>
                    </div>
                </VaCard>
            </div>
        </>
    )
    const formTitle = 'AskVA';
    const subTitle = 'Get answers to your questions about VA benefits and service. You should receive a reply within 7 business days.';
    return (
        <div className="schemaform-intro">
        <div className="schemaform-title vads-u-margin-bottom--2">
             <h1 className="vads-u-margin-bottom--2p5" data-testid="form-title">
             {formTitle}
             </h1>
             {subTitle && (
             <div className="schemaform-subtitle" data-testid="form-subtitle">
                 {subTitle}
             </div>
             )}
        </div>
        <>
        {businessPersonalUI}
        </>
        </div>
    );
}

BusinessPersonal.propTypes = {
    formData: PropTypes.object,
    goBack: PropTypes.func,
    goForward: PropTypes.func,
};

function mapStateToProps(state) {
    return {
        formData: state.form.data,
    };
}

export default connect(mapStateToProps)(withRouter(BusinessPersonal));