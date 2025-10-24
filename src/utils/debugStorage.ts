// Debug utility to check localStorage state
export function debugStorage() {
  const STORAGE_KEY = 'virtualgarage3d_state';
  
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      console.log('🔍 Current localStorage state:');
      console.log('- Cars count:', parsed.cars?.length || 0);
      console.log('- Custom model counter:', parsed.customModelCounter || 0);
      console.log('- Timestamp:', new Date(parsed.timestamp).toLocaleString());
      console.log('- Storage size:', Math.round(saved.length / 1024), 'KB');
      
      // Check each car
      parsed.cars?.forEach((car: any, index: number) => {
        console.log(`  Car ${index + 1}: ${car.name} (${car.isCustom ? 'Custom' : 'Default'})`);
        if (car.isCustom && car.fileData) {
          console.log(`    - File: ${car.fileName}, Size: ${Math.round(car.fileData.length / 1024)}KB`);
        }
      });
      
      return parsed;
    } else {
      console.log('📭 No garage data in localStorage');
      return null;
    }
  } catch (error) {
    console.error('❌ Error reading localStorage:', error);
    return null;
  }
}

export function clearStorageDebug() {
  const STORAGE_KEY = 'virtualgarage3d_state';
  localStorage.removeItem(STORAGE_KEY);
  console.log('🧹 localStorage cleared manually');
}

// Make functions available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).debugStorage = debugStorage;
  (window as any).clearStorageDebug = clearStorageDebug;
}
