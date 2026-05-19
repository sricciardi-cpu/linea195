# Línea 195 · Metropol

PWA con los horarios del colectivo 195 (La Nueva Metropol) entre Capital Federal y La Plata.

Muestra próximas salidas y llegadas estimadas para todos los ramales (A a I), con detección automática de día hábil / sábado / domingo.

## Datos

Horarios obtenidos del feed [GTFS oficial de Buenos Aires Data](https://data.buenosaires.gob.ar/dataset/colectivos-gtfs).

Para info en tiempo real: [Cuando Subo](https://cuandosubo.sube.gob.ar).

## Desarrollo

Es una PWA estática — basta servir la carpeta:

```bash
python3 -m http.server 8000
```

Después abrí http://localhost:8000.

## Deploy

Auto-deploy a Vercel en cada push a `main`.
