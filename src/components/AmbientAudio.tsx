interface AmbientAudioProps {
}

export function AmbientAudio({}: AmbientAudioProps) {
  // Ambient audio disabled - synthetic oscillators cause buzzing/unpleasant sounds
  // Only UI sound effects (click, select, hover) are used for interaction feedback
  // Future: Can be replaced with actual audio files for ambient background music
  return null;
}
