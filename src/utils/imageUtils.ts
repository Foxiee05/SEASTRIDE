import { useState, useEffect } from 'react';

const transparentCache = new Map<string, string>();

/**
 * Converts a JPG image with a light/white background into a PNG Data URL
 * with a transparent background and 100% OPAQUE artwork (no translucency).
 */
export function processCutoutImage(
  src: string,
  options: { threshold?: number; mode?: 'white' | 'edge' } = {}
): Promise<string> {
  const threshold = options.threshold ?? 220;
  const mode = options.mode ?? 'white';
  const cacheKey = `${src}_${mode}_${threshold}`;

  if (transparentCache.has(cacheKey)) {
    return Promise.resolve(transparentCache.get(cacheKey)!);
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

        const bgR = data[0];
        const bgG = data[1];
        const bgB = data[2];

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          if (mode === 'edge') {
            const dist = Math.sqrt(Math.pow(r - bgR, 2) + Math.pow(g - bgG, 2) + Math.pow(b - bgB, 2));
            if (dist < 40) {
              data[i + 3] = 0; // transparent
            } else if (dist < 70) {
              // slight feathering
              const alpha = Math.max(0, 255 - ((70 - dist) / 30) * 255);
              data[i + 3] = Math.round(alpha);
            } else {
              data[i + 3] = 255;
            }
          } else {
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
        }

        ctx.putImageData(imgData, 0, 0);
        const dataUrl = canvas.toDataURL('image/png');
        transparentCache.set(cacheKey, dataUrl);
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
export function useCutoutImage(
  src: string,
  options: { threshold?: number; mode?: 'white' | 'edge' } = {}
): string {
  const cacheKey = `${src}_${options.mode || 'white'}_${options.threshold || 220}`;
  const [cutoutUrl, setCutoutUrl] = useState<string>(transparentCache.get(cacheKey) || src);

  useEffect(() => {
    let isMounted = true;
    if (transparentCache.has(cacheKey)) {
      setCutoutUrl(transparentCache.get(cacheKey)!);
    } else {
      processCutoutImage(src, options).then((url) => {
        if (isMounted) {
          setCutoutUrl(url);
        }
      });
    }
    return () => {
      isMounted = false;
    };
  }, [src, options.mode, options.threshold, cacheKey]);

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

