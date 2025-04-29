import React from 'react';

export const AboutThisTool = () => {
  return (
    <div>
      <a
        href="https://www.benefits.va.gov/gibill/comparison_tool/about_this_tool.asp"
        target="_blank"
        className="links"
        rel="noopener noreferrer"
        id="about-this-tool"
      >
        About this tool
      </a>

      <a
        href="https://www.benefits.va.gov/GIBILL/docs/job_aids/ComparisonToolData.xlsx"
        id="download-all-data"
        className="links vads-u-margin-left--2"
      >
        Download data on all schools (XLS)
      </a>
      <a
        href="https://www.va.gov/gids/508_gi_bill_comparison_tool_user_guide.pdf"
        id="gi-bill-comparison-tool-user-guide"
        className="links vads-u-margin-left--2"
      >
        GI Bill Comparison Tool User Guide (PDF)
      </a>
    </div>
  );
};
