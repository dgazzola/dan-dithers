import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import Image from 'next/image';

const ImagePreview = React.forwardRef(({ src, maxWidth = 800, maxHeight = 600, sx }, ref) => {
  useEffect(() => {
    if (ref.current && src) {
      const img = new window.Image();
      img.src = src;
      img.onload = () => {
        const scaleFactor = Math.min(maxWidth / img.width, maxHeight / img.height, 1);
        const newWidth = img.width * scaleFactor;
        const newHeight = img.height * scaleFactor;

        ref.current.width = newWidth;
        ref.current.height = newHeight;
        const ctx = ref.current.getContext('2d');
        ctx.clearRect(0, 0, newWidth, newHeight);
        ctx.drawImage(img, 0, 0, newWidth, newHeight);
      };
    }
  }, [src, ref, maxWidth, maxHeight]);

  return (
    <Box mt={2} sx={{ maxWidth: '100%', maxHeight: '600px', overflow: 'hidden', ...sx }}>
      <Image
        src={src}
        alt={'Image Preview'}
        layout="responsive"
        width={700}
        height={400}
        style={{ maxWidth: '100%', maxHeight: '600px', objectFit: 'contain' }}
      />
      <canvas ref={ref} style={{ display: 'none' }} />
    </Box>
  );
});

ImagePreview.displayName = 'ImagePreview';

export default ImagePreview;
