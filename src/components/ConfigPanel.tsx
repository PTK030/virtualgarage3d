import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { type CarData } from '../hooks/useGarage';

interface ConfigPanelProps {
  cars: CarData[];
  selectedCar: number | null;
  onSelectCar: (id: number) => void;
  onUpdateCar: (id: number, updates: Partial<CarData>) => void;
  onDeleteCar: (id: number) => void;
  onResetPosition: (id: number) => void;
  onUploadClick: () => void;
}

export function ConfigPanel({
  cars,
  selectedCar,
  onSelectCar,
  onUpdateCar,
  onDeleteCar,
  onResetPosition,
  onUploadClick
}: ConfigPanelProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [sceneMode, setSceneMode] = useState<'explore' | 'neon' | 'rain' | 'showroom'>('explore');

  const selectedCarData = cars.find(car => car.id === selectedCar);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: -400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -400, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          style={{
            position: 'fixed',
            left: '20px',
            top: '100px',
            width: '360px',
            maxHeight: 'calc(100vh - 140px)',
            background: 'rgba(17, 17, 17, 0.8)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 1px rgba(255, 255, 255, 0.1) inset',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            padding: '24px',
            zIndex: 900,
            overflowY: 'auto',
            fontFamily: 'Rajdhani, sans-serif',
          }}
        >
          {/* Header */}
          <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: 'white',
              margin: 0,
              letterSpacing: '0.5px',
              fontFamily: 'Orbitron, sans-serif',
            }}>
              CONFIG PANEL
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: 'none',
                borderRadius: '8px',
                width: '32px',
                height: '32px',
                color: '#999',
                cursor: 'pointer',
                fontSize: '20px',
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.color = '#999';
              }}
            >
              ×
            </button>
          </div>

          {/* Vehicle List */}
          <Section title="VEHICLES">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {cars.map((car) => (
                <motion.div
                  key={car.id}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => onSelectCar(car.id)}
                  style={{
                    padding: '12px 16px',
                    background: selectedCar === car.id 
                      ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2))'
                      : 'rgba(255, 255, 255, 0.03)',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    border: selectedCar === car.id 
                      ? '1px solid rgba(102, 126, 234, 0.5)'
                      : '1px solid rgba(255, 255, 255, 0.05)',
                    transition: 'all 0.3s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: car.color,
                    boxShadow: `0 0 12px ${car.color}`,
                  }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ color: 'white', fontSize: '16px', fontWeight: '600' }}>
                      {car.name}
                    </div>
                    {car.isCustom && (
                      <div style={{ color: '#999', fontSize: '12px' }}>Custom Model</div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </Section>

          {/* Edit Selected Car */}
          {selectedCarData && (
            <Section title="EDIT VEHICLE">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Color Picker */}
                <div>
                  <label style={{ color: '#999', fontSize: '12px', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Color
                  </label>
                  <input
                    type="color"
                    value={selectedCarData.color}
                    onChange={(e) => onUpdateCar(selectedCarData.id, { color: e.target.value })}
                    style={{
                      width: '100%',
                      height: '40px',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      background: 'rgba(255, 255, 255, 0.05)',
                    }}
                  />
                </div>

                {/* Position Sliders */}
                <Slider
                  label="Position X"
                  value={selectedCarData.position[0]}
                  onChange={(v) => onUpdateCar(selectedCarData.id, {
                    position: [v, selectedCarData.position[1], selectedCarData.position[2]]
                  })}
                  min={-10}
                  max={10}
                />
                <Slider
                  label="Position Y"
                  value={selectedCarData.position[1]}
                  onChange={(v) => onUpdateCar(selectedCarData.id, {
                    position: [selectedCarData.position[0], v, selectedCarData.position[2]]
                  })}
                  min={-3}
                  max={2}
                />
                <Slider
                  label="Position Z"
                  value={selectedCarData.position[2]}
                  onChange={(v) => onUpdateCar(selectedCarData.id, {
                    position: [selectedCarData.position[0], selectedCarData.position[1], v]
                  })}
                  min={-10}
                  max={10}
                />

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <ActionButton onClick={() => onResetPosition(selectedCarData.id)}>
                    Reset Position
                  </ActionButton>
                  <ActionButton onClick={() => onDeleteCar(selectedCarData.id)} danger>
                    Delete
                  </ActionButton>
                </div>
              </div>
            </Section>
          )}

          {/* Scene Modes */}
          <Section title="SCENE MODE">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {(['explore', 'neon', 'rain', 'showroom'] as const).map((mode) => (
                <motion.button
                  key={mode}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSceneMode(mode)}
                  style={{
                    padding: '12px',
                    background: sceneMode === mode
                      ? 'linear-gradient(135deg, #667eea, #764ba2)'
                      : 'rgba(255, 255, 255, 0.05)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    transition: 'all 0.3s',
                    letterSpacing: '0.5px',
                  }}
                >
                  {mode}
                </motion.button>
              ))}
            </div>
          </Section>

          {/* Upload Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onUploadClick}
            style={{
              width: '100%',
              padding: '16px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
              transition: 'all 0.3s',
              marginTop: '16px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(102, 126, 234, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(102, 126, 234, 0.4)';
            }}
          >
            + Upload New Model
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '24px' }}>
      <h3 style={{
        fontSize: '14px',
        fontWeight: '700',
        color: '#999',
        marginBottom: '12px',
        letterSpacing: '1.5px',
        textTransform: 'uppercase',
      }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

function Slider({ label, value, onChange, min, max }: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
}) {
  return (
    <div>
      <label style={{
        color: '#999',
        fontSize: '12px',
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '8px',
        textTransform: 'uppercase',
        letterSpacing: '1px',
      }}>
        {label}
        <span style={{ color: '#667eea', fontWeight: '600' }}>{value.toFixed(1)}</span>
      </label>
      <input
        type="range"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        min={min}
        max={max}
        step={0.1}
        style={{
          width: '100%',
          height: '4px',
          borderRadius: '2px',
          outline: 'none',
          background: 'rgba(255, 255, 255, 0.1)',
          cursor: 'pointer',
        }}
      />
    </div>
  );
}

function ActionButton({ children, onClick, danger }: {
  children: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      style={{
        flex: 1,
        padding: '10px',
        background: danger ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255, 255, 255, 0.05)',
        border: danger ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '8px',
        color: danger ? '#ef4444' : 'white',
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        transition: 'all 0.3s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = danger ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = danger ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255, 255, 255, 0.05)';
      }}
    >
      {children}
    </motion.button>
  );
}
