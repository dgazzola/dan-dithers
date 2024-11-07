'use client'
import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { ditherFunction } from '@/utility/DitherFunction';

const DitherDropdown = ({ originalImage, setDitheredImage, originalCanvasRef }) => {
  const [selectedDither, setSelectedDither] = React.useState('');

  const handleDitherChange = (event) => {
    setSelectedDither(event.target.value);

    if (originalImage && originalCanvasRef.current) {
      const canvas = originalCanvasRef.current;
      const ctx = canvas.getContext('2d');

      // Ensure the canvas is drawn with the original image before dithering
      const img = new Image();
      img.src = originalImage;
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        // Apply dithering function
        ditherFunction(event.target.value, ctx, canvas.width, canvas.height);
        const ditheredDataUrl = canvas.toDataURL('image/png');
        console.log('Dithered Image Data URL:', ditheredDataUrl);

        if (ditheredDataUrl) {
          setDitheredImage(ditheredDataUrl);
        } else {
          console.error('Failed to generate data URL from canvas.');
        }
      };
    } else {
      console.error('Original image or canvas reference is missing.');
    }
  };

  return (
    <FormControl fullWidth sx={{ mb: 2 }}>
      <InputLabel id="dither-select-label">Select Dither Algorithm</InputLabel>
      <Select
        labelId="dither-select-label"
        id="dither-select"
        value={selectedDither}
        label="Select Dither Algorithm"
        onChange={handleDitherChange}
        disabled={!originalImage} // Disable if no image is uploaded
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
