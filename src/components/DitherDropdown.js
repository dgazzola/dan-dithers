'use client'
import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { ditherFunction } from '@/utility/ditherFunction';

const DitherDropdown = ({ originalImage, setDitheredImage, originalCanvasRef }) => {
  const [selectedDither, setSelectedDither] = React.useState('');

  const handleDitherChange = (event) => {
    setSelectedDither(event.target.value);
  
    if (originalImage && originalCanvasRef.current) {
      const canvas = originalCanvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.src = originalImage;
  
      img.onload = () => {
        const maxWidth = 800;
        const maxHeight = 600;
        const scaleFactor = Math.min(maxWidth / img.width, maxHeight / img.height, 1);
  
        const newWidth = img.width * scaleFactor;
        const newHeight = img.height * scaleFactor;
  
        canvas.width = newWidth;
        canvas.height = newHeight;
        ctx.drawImage(img, 0, 0, newWidth, newHeight);
  
        ditherFunction(event.target.value, ctx, newWidth, newHeight);
        const ditheredDataUrl = canvas.toDataURL('image/png');
  
        if (ditheredDataUrl) {
          setDitheredImage(ditheredDataUrl);
        } else {
          console.error('Failed to generate URL from canvas.');
        }
      };
    } else {
      console.error('Original image or canvas reference is missing.');
    }
  };  

  return (
    <FormControl fullWidth sx={{ mb: 2, width:'42vw', margin:2 }}>
      <InputLabel id="dither-select-label">Select Dither Algorithm</InputLabel>
      <Select
        labelId="dither-select-label"
        id="dither-select"
        value={selectedDither}
        label="Select Dither Algorithm"
        onChange={handleDitherChange}
        disabled={!originalImage}
      >
        <MenuItem value="threshold">Threshold Dither</MenuItem>
        <MenuItem value="floyd-steinberg">Floyd–Steinberg Dither</MenuItem>
        <MenuItem value="bayer">Bayer Dither</MenuItem>
        <MenuItem value="atkinson">Atkinson Dither</MenuItem>
        <MenuItem value="jarvis-judice-ninke">Jarvis, Judice, and Ninke Dither</MenuItem>
      </Select>
    </FormControl>
  );
};

export default DitherDropdown;
