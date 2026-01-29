import React from 'react';
import {
    titleUI,
    currencyUI
} from '~/platform/forms-system/src/js/web-component-patterns';



const uiSchema = {
    ...titleUI('Enter the cost of the prep course including all fees'),
    'ui:description': () => (
        <>
            <p>
                Enter the cost of the prep course you took or plan to take. You can only list one prep course per request,
                inlucding any required fees. (We can only reimburse you for requried test fees.) We have no authority to reimburse you for any optional costs
                related to prep course process.
            </p>
            <p>
                Fees that VA has no authority to reimburse include fees to take pre-tests, fees to receive scores quickly, or other costs or fees for
                optional items that are not required to take an appoved test.
            </p>
        </>
    ),
    prepCourseCost: {
        ...currencyUI({
            title:
                'Prep course cost including fees',
            errorMessages: {
                required: 'Enter prep course cost',
            },
        }),
    },

};

const schema = {
    type: 'object',
    properties: {
        prepCourseCost: {
            type: 'string',
            pattern: '^\\d+(\\.\\d{1,2})?$',
        },
    },
    required: ['prepCourseCost'],
};

export { schema, uiSchema };