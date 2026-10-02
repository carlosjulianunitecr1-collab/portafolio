# carlosjulianvite.github.io
Portafolio de proyectos de Ingeniería en Sistemas | Robótica · Automatización · IA · IoT · Software · Electrónica · Ciberseguridad · Modelado 3D · Manufactura · Logística

React 19 + Vite + motion + lucide-react, CSS puro, Inter.

## Desarrollo
```bash
npm install
npm run dev        # http://localhost:5173
```

## Producción
```bash
npm run build      # genera dist/ (copia img, videos, modelos3d y docs)
npm run preview
```

## Publicar en GitHub Pages
El workflow `.github/workflows/deploy.yml` compila y publica en cada push a `main`.
Solo activa una vez: Settings → Pages → Source → **GitHub Actions**.

## Dónde editar
- `src/data.js` — textos ES/EN, proyectos, áreas, formación, experiencia, contacto.
- `src/App.jsx` — componentes y animaciones.
- `src/index.css` — estilos.
- Video del hero: constante `HERO_VIDEO` al inicio de `src/App.jsx`.
