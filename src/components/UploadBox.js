'use client'
import React, { useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Button, Typography } from '@mui/material';

const UploadBox = ({ setOriginalImage, setDitheredImage, originalCanvasRef, ditheredCanvasRef, originalImage }) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (originalImage){
            setDitheredImage(e.target.result);
          } else {
            setOriginalImage(e.target.result);
          }
        };
        reader.readAsDataURL(file);
      }
    },
  });

  return (
      <Box {...getRootProps()} sx={{ border: '2px dashed #ccc', padding: '16px', textAlign: 'center' }}>
        <input {...getInputProps()} />
        <Typography>Drag and drop an image here, or click to select</Typography>
      </Box>
  );
};

export default UploadBox;