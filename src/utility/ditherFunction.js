const applyThresholdDither = (ctx, width, height) => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    const value = avg > 128 ? 255 : 0;
    data[i] = data[i + 1] = data[i + 2] = value;
  }

  ctx.putImageData(imageData, 0, 0);
};

const applyFloydSteinbergDither = (ctx, width, height) => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4;
      const oldPixel = data[index];
      const newPixel = oldPixel > 128 ? 255 : 0;
      const error = oldPixel - newPixel;

      data[index] = data[index + 1] = data[index + 2] = newPixel;

      if (x + 1 < width) data[index + 4] += (error * 7) / 16;
      if (y + 1 < height) {
        if (x > 0) data[index + (width - 1) * 4] += (error * 3) / 16;
        data[index + width * 4] += (error * 5) / 16;
        if (x + 1 < width) data[index + (width + 1) * 4] += (error * 1) / 16;
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);
};

const bayerMatrix = [
  [15, 135, 45, 165],
  [195, 75, 225, 105],
  [60, 180, 30, 150],
  [240, 120, 210, 90],
];

const applyBayerDither = (ctx, width, height) => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4;
      const avg = (data[index] + data[index + 1] + data[index + 2]) / 3;
      const threshold = bayerMatrix[y % 4][x % 4];
      const value = avg > threshold ? 255 : 0;
      data[index] = data[index + 1] = data[index + 2] = value;
    }
  }

  ctx.putImageData(imageData, 0, 0);
};

const applyAtkinsonDither = (ctx, width, height) => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4;
      const oldPixel = data[index];
      const newPixel = oldPixel > 128 ? 255 : 0;
      const error = oldPixel - newPixel;

      data[index] = data[index + 1] = data[index + 2] = newPixel;

      const distributeError = (dx, dy, factor) => {
        const newIndex = ((y + dy) * width + (x + dx)) * 4;
        if (x + dx < width && y + dy < height && newIndex < data.length) {
          data[newIndex] += error * factor;
        }
      };

      distributeError(1, 0, 1 / 8);
      distributeError(2, 0, 1 / 8);
      distributeError(-1, 1, 1 / 8);
      distributeError(0, 1, 1 / 8);
      distributeError(1, 1, 1 / 8);
      distributeError(0, 2, 1 / 8);
    }
  }

  ctx.putImageData(imageData, 0, 0);
};

const applyJarvisJudiceNinkeDither = (ctx, width, height) => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4;
      const oldPixel = data[index];
      const newPixel = oldPixel > 128 ? 255 : 0;
      const error = oldPixel - newPixel;

      data[index] = data[index + 1] = data[index + 2] = newPixel;

      const spreadError = (dx, dy, factor) => {
        const newIndex = ((y + dy) * width + (x + dx)) * 4;
        if (x + dx < width && y + dy < height && newIndex < data.length) {
          data[newIndex] += error * factor;
        }
      };

      spreadError(1, 0, 7 / 48);
      spreadError(2, 0, 5 / 48);
      spreadError(-2, 1, 3 / 48);
      spreadError(-1, 1, 5 / 48);
      spreadError(0, 1, 7 / 48);
      spreadError(1, 1, 5 / 48);
      spreadError(2, 1, 3 / 48);
      spreadError(-2, 2, 1 / 48);
      spreadError(-1, 2, 3 / 48);
      spreadError(0, 2, 5 / 48);
      spreadError(1, 2, 3 / 48);
      spreadError(2, 2, 1 / 48);
    }
  }

  ctx.putImageData(imageData, 0, 0);
};

export const ditherFunction = (ditherName, ctx, width, height) => {
  switch (ditherName) {
    case 'threshold':
      applyThresholdDither(ctx, width, height);
      break;
    case 'floyd-steinberg':
      applyFloydSteinbergDither(ctx, width, height);
      break;
    case 'bayer':
      applyBayerDither(ctx, width, height);
      break;
    case 'atkinson':
      applyAtkinsonDither(ctx, width, height);
      break;
    case 'jarvis-judice-ninke':
      applyJarvisJudiceNinkeDither(ctx, width, height);
      break;
    default:
      console.error('Invalid dithering algorithm name');
      break;
  }
};