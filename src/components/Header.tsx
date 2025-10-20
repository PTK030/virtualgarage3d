import { motion } from 'framer-motion';

export function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed top-0 left-0 right-0 z-50 pointer-events-none"
    >
      <div className="flex items-center justify-between px-8 py-6">
        <motion.div
          className="flex items-center gap-3"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <div className="relative">
            {/* Logo icon */}
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <div className="w-6 h-6 border-2 border-white rounded transform rotate-45"></div>
            </div>
            {/* Glow effect */}
            <div className="absolute inset-0 w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 blur-xl opacity-50"></div>
          </div>
          
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Virtual Garage{' '}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                3D+
              </span>
            </h1>
            <p className="text-xs text-gray-400 tracking-wide">Next-Gen Car Configurator</p>
          </div>
        </motion.div>
        
        {/* Subtle decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="hidden md:block h-px w-64 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"
        />
      </div>
    </motion.header>
  );
}
