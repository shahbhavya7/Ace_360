"use client";

import React from "react";
import MDEditor from "@uiw/react-md-editor";

const CoverLetterPreview = ({ content }) => { // CoverLetterPreview component to display the content of a cover letter
  // This component receives content as a prop and renders it using MDEditor for Markdown
  return (
    <div className="py-4">
      <MDEditor className="text-cyan-200" value={content} preview="preview" height={700} />
    </div>
  );
};

export default CoverLetterPreview;
