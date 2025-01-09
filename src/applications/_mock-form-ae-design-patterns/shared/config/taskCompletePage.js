import React from 'react';
import { TaskComplete } from '../components/pages/TaskCompletePage';
import { MOCK_FORM_AE_DESIGN_PATTERNS_ROOT_URL } from '../../utils/constants';

export const createPatternTaskCompletePage = ({ redirect }) => {
  return {
    title: "You're done!",
    path: 'complete',
    CustomPage: props => <TaskComplete {...props} redirect={redirect} />,
    CustomPageReview: null,
    uiSchema: {},
    schema: { type: 'object', properties: {} },
  };
};

export const taskCompletePagePattern1 = createPatternTaskCompletePage({
  redirect: `${MOCK_FORM_AE_DESIGN_PATTERNS_ROOT_URL}/1`,
});

export const taskCompletePagePattern2 = createPatternTaskCompletePage({
  redirect: `${MOCK_FORM_AE_DESIGN_PATTERNS_ROOT_URL}/2`,
});
