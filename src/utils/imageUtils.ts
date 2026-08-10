import { useState, useEffect } from 'react';

const transparentCache = new Map<string, string>();

/**
 * Converts a JPG image with a light/white background into a PNG Data URL
 * with a transparent background and 100% OPAQUE artwork (no translucency).
 */
export function processCutoutImage(src: string, threshold = 220): Promise<string> {
  if (transparentCache.has(src)) {
    return Promise.resolve(transparentCache.get(src)!);
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(src);
          return;
        }

        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // Check if pixel is close to white/light background
          if (r > threshold && g > threshold && b > threshold) {
            data[i + 3] = 0; // Completely transparent background
          } else {
            // Smooth edge feathering for near-threshold pixels
            const avg = (r + g + b) / 3;
            if (avg > threshold - 15) {
              const alpha = Math.max(0, 255 - ((avg - (threshold - 15)) / 15) * 255);
              data[i + 3] = Math.round(alpha);
            } else {
              data[i + 3] = 255; // 100% OPAQUE ship/item
            }
          }
        }

        ctx.putImageData(imgData, 0, 0);
        const dataUrl = canvas.toDataURL('image/png');
        transparentCache.set(src, dataUrl);
        resolve(dataUrl);
      } catch (e) {
        console.error('Cutout processing failed:', e);
        resolve(src);
      }
    };

    img.onerror = () => resolve(src);
    img.src = src;
  });
}

/**
 * Custom React hook to get the processed cutout URL for an image.
 */
export function useCutoutImage(src: string): string {
  const [cutoutUrl, setCutoutUrl] = useState<string>(transparentCache.get(src) || src);

  useEffect(() => {
    let isMounted = true;
    if (transparentCache.has(src)) {
      setCutoutUrl(transparentCache.get(src)!);
    } else {
      processCutoutImage(src).then((url) => {
        if (isMounted) {
          setCutoutUrl(url);
        }
      });
    }
    return () => {
      isMounted = false;
    };
  }, [src]);

  return cutoutUrl;
}

/**
 * Pre-warm cutout processing for a list of image URLs.
 */
export function preloadCutouts(srcs: string[]): void {
  srcs.forEach((src) => {
    if (src && !transparentCache.has(src)) {
      processCutoutImage(src);
    }
  });
}

