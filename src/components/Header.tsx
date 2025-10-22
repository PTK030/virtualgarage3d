export function Header() {
  return (
    <header
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(10px)',
        padding: '20px',
        textAlign: 'center',
        width: '100%'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>
            <h1 
              style={{ 
                fontSize: '32px',
                fontWeight: 'bold',
                color: 'white',
                letterSpacing: '-0.5px',
                margin: 0,
                fontFamily: 'Orbitron, sans-serif',
                textShadow: '0 0 20px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.6)'
              }}
            >
              Virtual Garage{' '}
              <span 
                style={{ 
                  background: 'linear-gradient(to right, #60a5fa, #a78bfa, #22d3ee)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textShadow: 'none'
                }}
              >
                3D+
              </span>
            </h1>
            <p 
              style={{ 
                fontSize: '14px',
                color: '#9ca3af',
                letterSpacing: '0.2em',
                fontWeight: '500',
                textAlign: 'center',
                margin: '4px 0 0 0',
                fontFamily: 'Rajdhani, sans-serif',
                textShadow: '0 0 10px rgba(0,0,0,0.8)'
              }}
            >
              NEXT-GEN CAR CONFIGURATOR
            </p>
        </div>
      </div>
    </header>
  );
}
