module.exports = {
  theme: {
    screens: {
      // '2xl': {'max': '1535px'},
      // 'xl': {'max': '1279px'},
      'lg': {'max': '1500px'},
      'md': {'max': '1400px'},
      'sm': {'max': '880px'},
    },
    extend: {
      colors: {
        clifford: '#da373d',
      }
    }
  },
  plugins: [],
  content: [
    "./src/**/*.{js,jsx,ts,tsx,html}",
    "./public/index.html",
  ],
};
