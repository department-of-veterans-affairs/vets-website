import React from 'react';

export const AboutThisTool = () => {
  return (
    <div>
      <a
        className="vads-u-margin-right--2"
        href="https://www.benefits.va.gov/gibill/comparison_tool/about_this_tool.asp"
        target="_blank"
        rel="noopener noreferrer"
        id="about-this-tool"
      >
        About this tool
      </a>
      <va-link
        id="download-all-data"
        download
        filetype="XLS"
        href="https://www.benefits.va.gov/GIBILL/docs/job_aids/ComparisonToolData.xlsx"
        text="Download data on all schools"
      />
      <a
        href="https://www.va.gov/gids/508_gi_bill_comparison_tool_user_guide.pdf"
        id="gi-bill-comparison-tool-user-guide"
        className="vads-u-margin-left--2"
      >
        GI Bill Comparison Tool User Guide (PDF)
      </a>
    </div>
  );
};
