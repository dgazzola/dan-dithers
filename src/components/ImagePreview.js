import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import Image from 'next/image'; // Keep this for rendering, but not for `new Image()`

// Use forwardRef to pass the canvas ref from the parent component
const ImagePreview = React.forwardRef(({ src, label }, ref) => {
  useEffect(() => {
    if (ref.current && src) {
      const img = document.createElement('img'); // Use the native image constructor
      img.src = src;
      img.onload = () => {
        const ctx = ref.current.getContext('2d');
        ref.current.width = img.width;
        ref.current.height = img.height;
        ctx.drawImage(img, 0, 0);
      };
    }
  }, [src, ref]);

  return (
    <Box mt={2}>
      <Typography variant="h6">{label || 'Image Preview'}:</Typography>
      {/* Display image with next/image component */}
      <Image src={src} alt={label || 'Preview'} layout="responsive" width={700} height={400} />
      <canvas ref={ref} style={{ display: 'none' }} />
    </Box>
  );
});

ImagePreview.displayName = 'ImagePreview';

export default ImagePreview;
