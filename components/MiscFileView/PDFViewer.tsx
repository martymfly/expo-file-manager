import React from 'react';
import PDFReader from 'rn-pdf-reader-js';

type IPDFViewerProps = {
  fileURI: string;
};

export const PDFViewer = ({ fileURI }: IPDFViewerProps) => {
  return (
    <PDFReader
      source={{
        uri: fileURI,
      }}
    />
  );
};
