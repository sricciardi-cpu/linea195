# Línea 195 · Metropol

PWA con horarios del colectivo **195** (La Nueva Metropol) entre **Capital Federal y La Plata**.

🚀 **Live:** https://linea195.vercel.app

## Features

- 🚌 **3 ramales oficiales** (B, C, D) extraídos del GTFS oficial de la Ciudad de Buenos Aires
- 📍 **Selector de paradas** origen y destino con 63 paradas únicas
- 🎯 **Geolocalización** — encontrá la parada más cercana a vos
- ⏱️ **Hero countdown** estilo Cuando Subo con cambio de color por urgencia
- 📅 **Ventana de 24 horas** — incluye los primeros servicios de mañana
- 🗺️ **Paradas en el camino** — colapsable, con la hora estimada en cada parada intermedia
- 📤 **Compartir viaje** con un toque (usa Web Share API en celulares)
- ⇅ **Swap inteligente** — invertí origen/destino y cambia automáticamente el sentido
- 🔄 **Auto-refresh** cada 20 segundos
- 💾 **Persistencia** — recuerda tu selección entre sesiones (localStorage)
- 📱 **PWA installable** — agregala a la pantalla de inicio del celular
- 🌙 **Modo offline** — funciona sin conexión gracias al Service Worker

## Datos

Horarios obtenidos del [GTFS oficial de Buenos Aires Data](https://data.buenosaires.gob.ar/dataset/colectivos-gtfs).

Son los horarios **programados**. Para info en tiempo real (GPS de las unidades), usá [Cuando Subo](https://cuandosubo.sube.gob.ar).

## Stack

- HTML / CSS / Vanilla JS (sin frameworks)
- Service Worker para offline + caché
- Web Manifest para PWA
- ~50KB total (10KB de datos + 30KB de código + 15KB de iconos)

## Desarrollo

Servir la carpeta con cualquier static server:

```bash
python3 -m http.server 8000
# o
npx serve
```

Abrir http://localhost:8000.

## Deploy

Auto-deploy a Vercel en cada push a `main`.

```bash
git push origin main
```

## Regenerar horarios desde GTFS

```bash
# Bajar GTFS de BA Data
curl -L -o /tmp/gtfs.zip "https://data.buenosaires.gob.ar/dataset/colectivos-gtfs/resource/juqdkmgo-571-resource/download"
unzip /tmp/gtfs.zip -d /tmp/gtfs

# Procesar (necesita el script de extracción, ver historia de commits)
```
