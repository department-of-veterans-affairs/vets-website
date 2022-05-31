import React from "react";
import { render } from "@testing-library/react";
import ProgressBar from "../../src/form-layout/ProgressBar";

describe('Progress Bar', () => {

  test('Displays current step name', () => {
    const { container } = render(
      <ProgressBar currentStep={1} numberOfSteps={5} stepTitle={"Dummy Title"}/>
    );

    const titleText = container.querySelector('h2')?.innerHTML;
    expect(titleText).toContain("Step 1 of 5: Dummy Title");
  });
});