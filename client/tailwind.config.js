/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
  			poppins: ['Poppins', 'sans-serif'],
  			playwrite: ['Playwrite SK', 'sans-serif'],
  			pridi: ['Pridi', 'sans-serif'],
  		},
      colors : {
        primary : '#F2F6FF',
        light : '#F5F5F5',
        textLight : '#A7A7A7',
        customBlue: '#01BEFF',
        customGreen: '#00C068',
        customYellow: '#FFBF26',
        customRed: '#FF684D',
      },
      backgroundImage: {
        'custom-gradient': 'linear-gradient(to left,#56CCF2, #2F80ED)',
        'pink-gradient': 'linear-gradient(to left, #f78da7, #c2185b)',
        'green-gradient': 'linear-gradient(to left, #a8e063, #56ab2f)'
      },
    },
  },
  plugins: [],
}

