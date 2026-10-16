# ⚡ RADAR SUR · Villa Nueva, San Miguel Petapa y Villa Canales
## Plataforma Intermunicipal de Actividades, Convivencia Urbana y Comercio Local del Sur Metropolitano

> **Ubicación del Proyecto:** `c:\Proyectos\Radar`  
> **URL Local:** [http://localhost:3000](http://localhost:3000)  
> **Estilo Visual:** Retro 90s Pop / Neo-Brutalismo con temática Dragon Radar, Alta Energía y Bordes Negros de 3px-4px  

---

## 📋 1. Ficha Técnica General

| Parámetro | Detalle |
| :--- | :--- |
| **Nombre Oficial** | RADAR SUR (Alianza Intermunicipal Villa Nueva · San Miguel Petapa · Villa Canales) |
| **Área Metropolitana** | Sur del Departamento de Guatemala (3 municipios limítrofes) |
| **Municipios Integrados** | **Villa Nueva**, **San Miguel Petapa** y **Villa Canales** |
| **Hub Geográfico** | El Frutal / Los Álamos (`lat: 14.5120, lng: -90.5650`), nexo vial y comercial de los 3 municipios |
| **Vías Conectoras** | Carretera CA-9 Sur, Autopista VAS, Bulevar El Frutal, Bulevar Los Reformadores, Boca del Monte |
| **Tecnología Frontend** | React 19, TypeScript, Tailwind CSS v4, Motion (Framer Motion v12), Lucide React |
| **Tecnología Backend** | Node.js con Express 4 en TypeScript ejecutado con TSX |
| **Entorno de Compilación** | Vite 8.3 integrado como Express Middleware |
| **Motor de IA** | SDK oficial `@google/genai` (Google GenAI) |
| **Modelos de IA** | `gemini-3.8-flash` (Moderación, Curaduría, Concierge Flotante) y `gemini-nano-banana-2.1` (Generación Visual) |
| **Puerto Predeterminado** | `3000` (configurable mediante variable `PORT`) |

---

## 🎯 2. Propósito y Nueva Visión Intermunicipal

**RADAR SUR** revoluciona la integración ciudadana y la economía de los tres municipios más dinámicos del sur de Guatemala: **Villa Nueva**, **San Miguel Petapa** y **Villa Canales**. Al integrar a las 3 alcaldías y sus Policías Municipales de Tránsito (PMT), la plataforma logra:

1. **Agenda Cultural y Deportiva Unificada:** Ciclovías y bicitours intermunicipales (como el Bicitour Sur Metropolitano de 16 km conectando los 3 municipios), festivales gastronómicos, ferias del jocote y piña, marimbas y carreras atléticas.
2. **Impulso Económico con Cupones QR en Vivo:** Descuentos exclusivos (15% a 25%) para negocios de Villa Nueva, Petapa y Villa Canales, con contador regresivo de 20 minutos, stock limitado y canje directo vía WhatsApp.
3. **Conserje Inteligente Radar Sur (Floating Concierge):** Widget interactivo de IA flotante que resuelve dudas sobre cómo cruzar de un municipio a otro, parqueos coordinados, estado del tránsito y sugerencias de planes de fin de semana.
4. **Coordinación Vial y Emergencias (3 PMTs + Bomberos):** Enlaces directos a Waze y Google Maps calculados desde el centro neurálgico del sur, y acceso rápido a los números de emergencia:
   - **PMT Villa Nueva:** `1531`
   - **PMT San Miguel Petapa:** `1550`
   - **PMT Villa Canales:** `1545`
   - **Bomberos Voluntarios (Sur):** `122`

---

## ⚡ 3. Funcionalidades Principales

### 3.1. Selector y Filtros Intermunicipales
- **Filtro de Municipio:** Pestañas de acceso rápido: `★ TODO EL SUR`, `VILLA NUEVA`, `SAN MIGUEL PETAPA` y `VILLA CANALES`.
- **Filtro por Zona/Sector Dinámico:** Al seleccionar un municipio, las opciones se actualizan automáticamente:
  - **Villa Nueva:** Zona 1 (Centro Histórico), Zona 2 (Linda Vista), Zona 3 (Ciudad del Sol), Zona 4 (Santa Clara), Zona 5 (El Frutal), Zona 6 (Mártires del Pueblo), Zona 10 (Ciudad Real), Zona 12 (San José), Bárcena & Naciones Unidas.
  - **San Miguel Petapa:** Centro & Plaza Mayor, Villa Hermosa I y II, Los Álamos & El Frutal, Prados de Villa Hermosa, Santa Inés Petapa, Ribera del Lago.
  - **Villa Canales:** Centro & Plaza, Boca del Monte, Santa Elena Barillas, El Jocotillo, Colmenas & Chichimecas.
- **Filtros por Momento:** `Este Finde`, `Gratis`, `Deportes`, `Gastronomía`.
- **Filtro por Fuente:** `★ EXCLUSIVOS RADAR SUR` vs. `🏛️ ALCALDÍAS MUNICIPALES (3)`.

### 3.2. Cupones de Descuento con Códigos QR Interactivos
- Los negocios locales de los 3 municipios ofrecen promociones de alta conversión.
- Modal interactivo con **código QR dinámico**, temporizador en vivo de 20:00 minutos, medidor de stock disponible y botón para abrir WhatsApp con el mensaje preformateado de validación.

### 3.3. Asistente Virtual Flotante (Floating Concierge)
- Burbuja flotante en esquina inferior derecha con temática Dragon Radar (`#00F0FF`, `#FFE600`, `#FF007F`).
- Conectado a la API `/api/subagents/concierge` con Gemini 3.8 Flash y respuestas rápidas como: *"¿Qué hay en Petapa hoy?"*, *"Eventos gratis este finde"*, *"Ruta por la VAS hacia Villa Canales"*.

### 3.4. Ecosistema de Subagentes con IA Google Gemini
El backend (`server.ts`) expone 4 endpoints dedicados con conocimiento profundo de los 3 municipios:
1. **🛡️ Guardián Comunitario (`/api/subagents/moderate`)**:
   - Modelo: `gemini-3.8-flash`.
   - Modera propuestas vecinales y actividades en tiempo real con *Family Score* (0-100).
2. **🎨 Curador de Experiencias Sur (`/api/subagents/curate`)**:
   - Modelo: `gemini-3.8-flash`.
   - Enriquece títulos y descripciones, y sugiere amenidades según el municipio y zona.
3. **🤝 Concierge Ciudadano (`/api/subagents/concierge`)**:
   - Modelo: `gemini-3.8-flash`.
   - Asistente de movilidad, distancias y recomendaciones en el sur metropolitano.
4. **📸 Generador Visual Comunitario (`/api/generate-image`)**:
   - Modelo: `gemini-nano-banana-2.1`.
   - Generación de arte promocional para eventos locales.

---

## 🏗️ 4. Estructura del Código Fuente

```
Radar/
├── server.ts                 # Servidor Express + Vite Middleware + Subagentes Gemini (Sur)
├── index.html                # Título, tipografías y metadatos de Radar Sur
├── vite.config.ts            # Configuración de empaquetado Vite
├── tsconfig.json             # Configuración de TypeScript
└── src/
    ├── main.tsx              # Entrada de React 19
    ├── App.tsx               # Orquestación de vistas, filtros de los 3 municipios y Footer PMTs
    ├── index.css             # Clases utilitarias Neo-Brutalistas y animaciones 90s
    ├── types/
    │   └── index.ts          # MunicipioSur, SurZona, EventItem, EntrepreneurAd
    ├── data/
    │   └── initialData.ts    # Eventos y comercios de Villa Nueva, Petapa y Villa Canales
    ├── utils/
    │   └── geo.ts            # Cálculo de distancias (Haversine) y notificaciones
    └── components/
        ├── DragonRadarLogo.tsx       # Logo animado Radar del Dragón
        ├── HeroSection.tsx           # Hero con selector de 3 municipios, fotos y chips
        ├── EventCard.tsx             # Tarjeta con badge de municipio y accesos Waze/Maps
        ├── EventModal.tsx            # Modal detallado con rutas por CA-9, VAS y El Frutal
        ├── InteractiveCalendar.tsx   # Calendario mensual interactivo
        ├── EntrepreneurAdsSection.tsx# Directorio comercial y modal de cupones QR
        ├── FloatingConcierge.tsx     # Conserje flotante con IA para los 3 municipios
        ├── SubagentsHub.tsx          # Consola de los 3 subagentes de IA
        ├── ProposeEventModal.tsx     # Formulario para proponer actividades en cualquier municipio
        ├── AdminPanel.tsx            # Consola administrativa para eventos y anuncios del sur
        ├── PlatformStats.tsx         # Estadísticas cívicas y afluencia proyectada
        ├── SocialPromotionHub.tsx    # Generador de publicaciones para redes sociales
        ├── SocialShareModal.tsx      # Modal para compartir eventos
        ├── HowItWorksSection.tsx     # Explicación del funcionamiento de Radar Sur
        ├── Navbar.tsx                # Barra de navegación con ticker PMT de los 3 municipios
        └── UserAuthModal.tsx         # Perfil vecinal y favoritos
```

---

## 🗄️ 4. Conexión con Base de Datos Supabase (Recolección de Emprendedores)

La plataforma cuenta con integración oficial con **Supabase** (`@supabase/supabase-js`) para recolectar y almacenar las solicitudes de emprendedores que desean unirse a los bazares y actividades intermunicipales.

### 4.1. Configuración de Credenciales
Puedes configurar Supabase de dos maneras:
1. **En Vercel (Recomendado para producción):**
   - Ve a tu proyecto en Vercel -> *Settings* -> *Environment Variables*.
   - Agrega:
     - `VITE_SUPABASE_URL`: Tu URL de proyecto (ej: `https://xyz.supabase.co`)
     - `VITE_SUPABASE_ANON_KEY`: Tu clave pública `anon`
2. **Desde el Panel de Administración (En vivo sin redesplegar):**
   - Abre el Panel de Administración (`#admin` o atajo `Ctrl + Shift + A`).
   - Ve a la pestaña **Ads de Emprendedores**.
   - Haz clic en **Credenciales**, ingresa tu URL y Anon Key, y haz clic en **Guardar y Conectar**.

### 4.2. Creación de la Tabla en Supabase
El repositorio incluye el archivo [`supabase_schema.sql`](file:///c:/Proyectos/Radar/supabase_schema.sql):
1. Entra a tu proyecto en [https://supabase.com](https://supabase.com).
2. Haz clic en **SQL Editor** en el menú izquierdo.
3. Copia el contenido de [`supabase_schema.sql`](file:///c:/Proyectos/Radar/supabase_schema.sql) (o usa el botón **Copiar SQL** en el Panel Admin).
4. Pégalo en el editor y presiona **RUN**.
5. ¡Listo! La tabla `entrepreneurs` quedará configurada con políticas RLS de lectura y escritura pública.

---

## 🚀 5. Instrucciones de Ejecución

### Inicio Rápido
1. En la raíz del proyecto, ejecuta:
   ```bash
   npm run dev
   ```
2. Abre tu navegador en [http://localhost:3000](http://localhost:3000).

### Compilación y Verificación
```bash
npm run build
```

---

*Radar Sur · Conectando a Villa Nueva, San Miguel Petapa y Villa Canales · 2026*
