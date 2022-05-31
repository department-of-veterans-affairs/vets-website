/**
 * FormTitle properties
 *
 * @example
 * ```json
 * {
 *    title: 'My Example Title',
 *    subTitle: 'My Example Sub Title for more information'
 * }
 * ```
 */
export interface FormTitleProps {
  title: string;
  subTitle?: string;
}

export interface ProgressBarProps {
  numberOfSteps: number;
  currentStep: number;
  stepTitle: string;
}
