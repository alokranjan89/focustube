export default {
  content: ['./src/**/*.{ts,tsx}', './popup.html', './options.html'],
  theme: {
    extend: {
      colors: {
        focus: '#7c3aed',
        glow: '#64d7ff',
        surface: '#111827'
      },
      boxShadow: {
        glow: '0 28px 80px rgba(124, 58, 237, 0.18)'
      }
    }
  },
  plugins: []
}
