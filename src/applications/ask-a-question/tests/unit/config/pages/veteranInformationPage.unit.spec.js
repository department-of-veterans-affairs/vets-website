import React from 'react';
import { expect } from 'chai';
import {render} from '@testing-library/react';

import VeteranInformationPage from '../../../../config/pages/veteranInformationPage';
import { veteranStatusUI } from '../../../../config/pages/veteranStatusUI';
import formConfig from '../../../../config/form';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';


describe('Veteran Information Page', () => {

    it('should require veteran status', () => {
        const { getByLabelText } = render(
            <DefinitionTester
                schema={VeteranInformationPage.schema}
                uiSchema={VeteranInformationPage.uiSchema}
                definitions={formConfig.defaultDefinitions}
                data={
                    {
                        veteranStatus: {
                            veteranStatus: null
                        }
                    }
                }
            />
        );

        const veteranStatus = getByLabelText(veteranStatusUI.veteranStatus['ui:title'], {
            exact: false,
        });

        expect(veteranStatus).to.have.property('required');
    });
});
