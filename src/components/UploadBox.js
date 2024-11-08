// UploadBox.js
'use client'
import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Typography } from '@mui/material';

const UploadBox = ({ setOriginalImage }) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setOriginalImage(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    },
  });

  return (
    <Box
      {...getRootProps()}
      sx={{
        border: '2px dashed #ccc',
        padding: '32px',
        textAlign: 'center',
        backgroundColor: '#f9f9f9',
        width: '100%',
        maxWidth: '600px',
        margin: '0 auto',
        boxShadow: 2,
      }}
    >
      <input {...getInputProps()} />
      <Typography variant="h6" className='flex-center'>Drag and drop an image here, or click to select</Typography>
    </Box>
  );
};

export default UploadBox;