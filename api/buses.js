// Vercel serverless function — proxy a la API de Transporte de Buenos Aires.
// Trae las posiciones GPS en vivo y devuelve solo los colectivos de la línea 195.
// Las credenciales viven en variables de entorno (NUNCA en el código ni en git).

const API_BASE = 'https://apitransporte.buenosaires.gob.ar/colectivos';

export default async function handler(req, res) {
  const CID = process.env.BA_CLIENT_ID;
  const CS = process.env.BA_CLIENT_SECRET;

  if (!CID || !CS) {
    res.status(500).json({ error: 'Credenciales no configuradas' });
    return;
  }

  const url = `${API_BASE}/vehiclePositionsSimple?client_id=${CID}&client_secret=${CS}`;

  // La API a veces tira 500 (SSLHandshakeException en su proxy). Reintentamos.
  let data = null;
  let lastErr = '';
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const r = await fetch(url, { signal: AbortSignal.timeout(20000) });
      if (r.ok) {
        const json = await r.json();
        if (Array.isArray(json)) { data = json; break; }
        lastErr = 'respuesta no es lista';
      } else {
        lastErr = `HTTP ${r.status}`;
      }
    } catch (e) {
      lastErr = e.message || 'fetch error';
    }
    // backoff
    await new Promise(r => setTimeout(r, 600 + attempt * 400));
  }

  if (!data) {
    res.status(502).json({ error: 'API de transporte no disponible', detail: lastErr });
    return;
  }

  // Filtrar línea 195, solo ramales por AUTOPISTA (B a I).
  // Se excluye el 195A que va por Av. Mitre / Quilmes (no autopista).
  const RAMAL_RE = /^195[B-I]$/;
  const buses = data
    .filter(v => RAMAL_RE.test(String(v.route_short_name || '').trim().toUpperCase()))
    .map(v => ({
      lat: v.latitude,
      lon: v.longitude,
      ramal: String(v.route_short_name).trim().toUpperCase(),
      dir: v.direction,            // 0 / 1
      speed: Math.round((v.speed || 0) * 3.6), // m/s -> km/h
      id: v.id,
      ts: v.timestamp,
      headsign: v.trip_headsign || '',
    }));

  // Caché de CDN: 15s fresco, 30s stale-while-revalidate
  res.setHeader('Cache-Control', 's-maxage=15, stale-while-revalidate=30');
  res.status(200).json({
    ok: true,
    count: buses.length,
    updated: Math.floor(Date.now() / 1000),
    buses,
  });
}
