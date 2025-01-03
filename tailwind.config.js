export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      poppins: ['Poppins', 'sans-serif'],
      primary: ['IBM Plex Sans', 'sans-serif'],
    },
    extend: {
        colors:{
            white: "#FFFFFF",
            white_gray:"#E1E8ED",
            blue_twitter: "#1DA1F2",
            blue_marine:"#275ba4",
            blue_marine2:"#B9DDF4",
            blue_gray:"#9ABFD8",
            black: "#14171A",
            orange_inter:"#D36A50",
            yellow_inter:"#F5EE65",
            green_inter: "#9BBFA4",
            celestial:"#8CACAE"
        },
        animation: {
          'fade-in': 'fadeIn ease-in-out',
          'fade-out': 'fadeOut ease-in-out',
        },
        keyframes: {
          fadeIn: {
            '0%': { opacity: '0' },
            '100%': { opacity: '50' },
          },
          fadeOut: {
            '0%': { opacity: '50' },
            '100%': { opacity: '0' },
          },
        },
    },
  },
  plugins: [],
};