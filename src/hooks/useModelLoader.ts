import { useMemo } from 'react';
import { type CarData } from './useGarage';

// Hook to convert base64 data back to blob URL for GLTF loading
export function useModelLoader(car: CarData) {
  const modelUrl = useMemo(() => {
    if (car.isCustom && car.fileData) {
      // Convert base64 back to blob URL
      try {
        console.log('🔄 Converting custom model:', car.fileName, 'Base64 size:', Math.round(car.fileData.length / 1024), 'KB');
        
        const binaryString = atob(car.fileData);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        
        // Try GLB first (binary format), then fallback to GLTF (JSON format)
        let blob: Blob;
        let mimeType: string;
        
        try {
          // First attempt: Try as GLB (binary format)
          mimeType = 'model/gltf-binary';
          blob = new Blob([bytes], { type: mimeType });
          console.log('🎯 Trying GLB format first...');
        } catch (glbError) {
          console.warn('⚠️ GLB format failed, trying GLTF:', glbError);
          // Fallback: Try as GLTF (JSON format)
          mimeType = 'model/gltf+json';
          blob = new Blob([bytes], { type: mimeType });
          console.log('🔄 Fallback to GLTF format...');
        }
        
        const url = URL.createObjectURL(blob);
        
        console.log('✅ Blob URL created:', url, 'MIME type:', mimeType, 'Blob size:', Math.round(blob.size / 1024), 'KB');
        return url;
      } catch (error) {
        console.error('❌ Failed to convert base64 to blob:', error);
        return car.modelPath; // fallback
      }
    }
    return car.modelPath; // regular model path
  }, [car.fileData, car.modelPath, car.isCustom, car.fileName]);

  return modelUrl;
}
