'use client';
import { useState, useRef } from 'react';
import ImagePreview from '@/components/ImagePreview';
import UploadBox from '@/components/UploadBox';
import '../styles/styles.css';
import DitherDropdown from '@/components/DitherDropdown';
import { Box, Button, Container, Typography } from '@mui/material';

export default function Home() {
  const [originalImage, setOriginalImage] = useState(null);
  const [ditheredImage, setDitheredImage] = useState(null);
  const [ditherHistory, setDitherHistory] = useState([]);
  const [currentDitherIndex, setCurrentDitherIndex] = useState(-1);
  const originalCanvasRef = useRef(null);
  const ditheredCanvasRef = useRef(null);

  const handleReset = () => {
    setDitheredImage(null);
    setOriginalImage(null);
    setDitherHistory([]);
    setCurrentDitherIndex(-1);
  };

  const handleDownload = () => {
    if (ditheredImage) {
      const link = document.createElement('a');
      link.href = ditheredImage;
      link.download = 'dithered-image.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleBack = () => {
    if (currentDitherIndex > 0) {
      const prevIndex = currentDitherIndex - 1;
      setCurrentDitherIndex(prevIndex);
      setDitheredImage(ditherHistory[prevIndex]);
    }
  };

  const handleForward = () => {
    if (currentDitherIndex < ditherHistory.length - 1) {
      const nextIndex = currentDitherIndex + 1;
      setCurrentDitherIndex(nextIndex);
      setDitheredImage(ditherHistory[nextIndex]);
    }
  };

  return (
    <Container sx={{ maxWidth: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h1" className="centered-item">Dan Dithers</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: '1vw' }}>
        {originalImage && (
          <ImagePreview src={originalImage} ref={originalCanvasRef}/>
        )}
        {ditheredImage && (
            <ImagePreview src={ditheredImage} ref={ditheredCanvasRef}/>

        )}
      </Box>
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', gap:'2rem', justifyContent:'center' }}>
        {originalImage && (
          <>
                <Button
                  variant="contained"
                  onClick={handleReset}
                >
                  Reset
                </Button>
        {ditheredImage && (
          <>
            <Button
              variant="contained"
              onClick={handleBack}
              disabled={currentDitherIndex <= 0}
            >
              Back
            </Button>
            <Button
            variant="contained"
            onClick={handleForward}
            disabled={currentDitherIndex >= ditherHistory.length - 1}
            >
              Forward
            </Button>
          <Button
          variant="contained"
          onClick={handleDownload}
          >
            Download
          </Button>
        </>

)}
        </>
          )}
          </Box>
        {originalImage && (
          <DitherDropdown
            originalImage={originalImage}
            setDitheredImage={(newDither) => {
              const newHistory = [...ditherHistory.slice(0, currentDitherIndex + 1), newDither];
              setDitherHistory(newHistory);
              setCurrentDitherIndex(newHistory.length - 1);
              setDitheredImage(newDither);
            }}
            originalCanvasRef={originalCanvasRef}
          />
        )}
        {!originalImage && (
          <UploadBox
            setOriginalImage={setOriginalImage}
            setDitheredImage={setDitheredImage}
            originalCanvasRef={originalCanvasRef}
            ditheredCanvasRef={ditheredCanvasRef}
            originalImage={originalImage}
          />
        )}
    </Container>
  );
}
