# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

"proxy": "http://localhost:8080"

server: {
proxy: {
"/auth": {
target: "http://localhost:8080",
changeOrigin: true,
secure: false,
},
"/api": {
target: "http://localhost:8080",
changeOrigin: true,
secure: false,
},
},
},

szuka wylogowanego uzytkownika w local storage
resetuje storage wychodzac z modala

preflight nie przechodzi
zrobić projekt strone do wyłowania do hard coded login na back i testowac
zrobic zeby authorrization przeszedl przez header "cookie"
