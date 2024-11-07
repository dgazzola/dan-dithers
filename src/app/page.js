'use client'
import { useState, useRef } from 'react';
import ImagePreview from '@/components/ImagePreview';
import UploadBox from '@/components/UploadBox';
import DitherDropdown from '@/components/DitherDropdown';
import styles from './page.module.css';
import { Box, Button } from '@mui/material';

export default function Home() {
  const [originalImage, setOriginalImage] = useState(null);
  const [ditheredImage, setDitheredImage] = useState(null);
  const originalCanvasRef = useRef(null);
  const ditheredCanvasRef = useRef(null);
  const handleReset = () => {
    setDitheredImage(null);
    setOriginalImage(null);
  }

  return (
    <div className={styles.page}>
      <h1>Dan Dithers</h1>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mb: 2 }}>
        {originalImage && (
          <ImagePreview src={originalImage} ref={originalCanvasRef} label="Original Image" />
        )}
        {ditheredImage && (
          <ImagePreview src={ditheredImage} ref={ditheredCanvasRef} label="Dithered Image" />
        )}
        {ditheredImage && (
          <Box> 

            <Button onClick={handleReset}>Reset</Button>
          </Box>
        )}
      </Box>
      <Box sx={{ mt: -50 , width:'50%'}}>
        {originalImage && (
          <DitherDropdown
            originalImage={originalImage}
            setDitheredImage={setDitheredImage}
            originalCanvasRef={originalCanvasRef}
          />
        )}
        {!ditheredImage &&
        <UploadBox
          setOriginalImage={setOriginalImage}
          setDitheredImage={setDitheredImage}
          originalCanvasRef={originalCanvasRef}
          ditheredCanvasRef={ditheredCanvasRef}
          originalImage={originalImage}
        />}
      </Box>
    </div>
  );
}
