# ⚡ RADAR · Villa Nueva Conecta
## Plataforma Urbana Inteligente de Eventos, Comercio Local y Convivencia Comunitaria

> **Ubicación del Proyecto:** `c:\Proyectos\Radar`  
> **URL Local:** [http://localhost:3000](http://localhost:3000)  
> **Estilo Visual:** Retro 90s Pop / Neo-Brutalisimo con temática Dragon Radar y Alta Energía  

---

## 📋 1. Ficha Técnica General

| Parámetro | Detalle |
| :--- | :--- |
| **Nombre Oficial** | Radar (Villa Nueva Conecta - Portal de Eventos Comunitarios) |
| **Municipio Objetivo** | Villa Nueva, Departamento de Guatemala |
| **Zonas Cobertura** | 12 Zonas Municipales (Zona 1 a Zona 12) |
| **Tecnología Frontend** | React 19, TypeScript, Tailwind CSS v4, Motion (Framer Motion v12), Lucide React |
| **Tecnología Backend** | Node.js con Express 4 en TypeScript ejecutado con TSX |
| **Entorno de Compilación** | Vite 8.3 integrado como Express Middleware |
| **Motor de IA** | SDK oficial `@google/genai` (Google GenAI) |
| **Modelos de IA** | `gemini-3.8-flash` (Moderación, Curaduría, Concierge) y `gemini-nano-banana-2.1` (Generación Visual) |
| **Puerto Predeterminado** | `3000` (configurable mediante variable `PORT`) |

---

## 🎯 2. Propósito y Visión

**Radar** nace con la misión de transformar la convivencia vecinal y dinamizar la economía local de Villa Nueva, Guatemala. Integra en una única experiencia interactiva:
1. **La agenda pública y cultural más completa** de ferias, actividades deportivas, ciclovías, marimbas, bazares y talleres vecinales.
2. **Impulso comercial y emprendedor**, permitiendo que negocios de barrio promocionen sus servicios mediante **cupones con códigos QR** canjeables en persona.
3. **Seguridad y armonía ciudadana**, con agentes de moderación en tiempo real para mantener un ambiente estrictamente familiar y positivo.

---

## ⚡ 3. Funcionalidades Principales

### 3.1. Geolocalización en 12 Zonas Municipales
- Mapeo y segmentación detallada de las 12 zonas de Villa Nueva:
  - **Zona 1**: Centro Histórico y Plaza Mayor
  - **Zona 2**: Bárcena
  - **Zona 3**: San José
  - **Zona 4**: Planes de Bárcenas
  - **Zona 5**: El Frutal
  - **Zona 6**: Concepción
  - **Zona 7**: Santa Isabel
  - **Zona 8**: Ciudad Peronia
  - **Zona 9**: Las Castañas
  - **Zona 10**: Ciudad Real
  - **Zona 11**: Santa Clara / Enriqueta
  - **Zona 12**: Alioto / El Mezquital
- Coordenadas geográficas precisas para cada evento, enlaces directos a navegación con **Google Maps** y **Waze**, y recomendaciones de acceso vial de la Policía Municipal de Tránsito (PMT).

### 3.2. Cupones de Descuento con Códigos QR Interactivos
- Los negocios locales ofrecen promociones con descuentos exclusivos (10% a 25%).
- Generación de código QR dinámico en pantalla con temporizador de validez de 15 a 30 minutos.
- Botón de canje instantáneo con contador decreciente de cupones disponibles para crear urgencia comercial legítima.

### 3.3. Directorio Comercial y Emprendimientos Barriales
- Sección dedicada a cafeterías tradicionales, vulcanizadoras, librerías, academias deportivas y restaurantes villanovanos.
- Fichas comerciales con botón de contacto directo por WhatsApp, ubicación barrial y horario de apertura.

### 3.4. Ecosistema de Subagentes con IA Google Gemini
El backend (`server.ts`) expone 4 endpoints dedicados impulsados por la API oficial `@google/genai`:

1. **🛡️ Guardián Comunitario (`/api/subagents/moderate`)**:
   - Modelo: `gemini-3.8-flash`.
   - Modera propuestas vecinales y comentarios en tiempo real.
   - Calcula el *Family Score* (0 a 100), detecta lenguaje tóxico o engañoso y otorga el sello de *Convivencia Familiar Segura*.
2. **🎨 Curador de Experiencias VN (`/api/subagents/curate`)**:
   - Modelo: `gemini-3.8-flash`.
   - Transforma borradores de eventos vecinales en anuncios llamativos con títulos urbanos atractivos, amenidades sugeridas (Toldos, Parqueo PMT, Hidratación) y estimación de asistencia.
3. **🤝 Concierge Ciudadano (`/api/subagents/concierge`)**:
   - Modelo: `gemini-3.8-flash`.
   - Asistente de chat comunitario que resuelve dudas sobre cómo llegar, parqueos disponibles y recomendaciones de actividades según la zona.
4. **📸 Fotógrafo Digital Comunitario (`/api/generate-image`)**:
   - Modelo: `gemini-nano-banana-2.1`.
   - Generación de arte promocional y fotografías urbanas realistas en relación de aspecto 16:9 y resolución 1K.

> **Modo Fallback Resiliente:** Si el usuario no ha configurado una clave `GEMINI_API_KEY`, el servidor cuenta con un motor heurístico y determinista completo que garantiza el 100% de la funcionalidad de la plataforma sin caídas ni errores.

---

## 🏗️ 4. Arquitectura de Software

```
Radar/
├── Abrir_Radar.bat           # Lanzador inteligente de Windows (Instala + Inicia + Abre)
├── Detalles_del_Proyecto.html # Ficha técnica visual interactiva (Retro 90s Pop)
├── Ver_Detalles.bat          # Abre el visor interactivo en el navegador
├── Radar.url                 # Acceso directo de Windows a http://localhost:3000
├── DETALLES.md               # Este documento técnico
├── package.json              # Dependencias y scripts de Node.js
├── server.ts                 # Servidor Express + Vite Middleware + Subagentes Gemini
├── vite.config.ts            # Configuración de empaquetado Vite
├── tsconfig.json             # Configuración de TypeScript
└── src/
    ├── main.tsx              # Entrada principal de React 19
    ├── App.tsx               # Componente raíz con orquestación de vistas y estado
    ├── index.css             # Estilos globales y utilidades de diseño
    ├── components/
    │   ├── DragonRadarLogo.tsx       # Logo interactivo estilo Dragon Radar con animación
    │   ├── HeroSection.tsx           # Sección principal con buscador y métricas clave
    │   ├── EventCard.tsx             # Tarjeta visual de evento con badges y accesos
    │   ├── EventModal.tsx            # Vista detallada de evento con mapa y galería
    │   ├── InteractiveCalendar.tsx   # Calendario interactivo con filtros por fecha
    │   ├── EntrepreneurAdsSection.tsx# Vitrina comercial y cupones QR
    │   ├── SubagentsHub.tsx          # Panel de interacción con los agentes IA
    │   ├── ProposeEventModal.tsx     # Formulario para que vecinos propongan actividades
    │   ├── AdminPanel.tsx            # Panel administrativo de moderación y aprobación
    │   ├── PlatformStats.tsx         # Estadísticas en tiempo real de la plataforma
    │   ├── SocialPromotionHub.tsx    # Centro de difusión para redes sociales
    │   ├── SocialShareModal.tsx      # Modal de compartición rápida
    │   ├── HowItWorksSection.tsx     # Guía explicativa para nuevos usuarios
    │   ├── Navbar.tsx                # Barra de navegación con filtro de zona
    │   └── UserAuthModal.tsx         # Modal de autenticación y perfil de vecino
    ├── data/
    │   └── initialData.ts            # Base de datos inicial de eventos, comercios y agentes
    └── types/
        └── index.ts                  # Definiciones de tipos TypeScript del sistema
```

---

## 🚀 5. Instrucciones de Ejecución

### Opción A: Inicio Rápido con 1 Clic (Recomendado)
Haz doble clic sobre el archivo:
```
Abrir_Radar.bat
```
Este script realiza automáticamente:
1. Verificación de la carpeta `node_modules`. Si no existe, ejecuta `npm install`.
2. Verificación y copia del archivo de entorno `.env` si es necesario.
3. Comprobación del puerto 3000. Si no está en ejecución, inicia el servidor en segundo plano (`npm run dev`).
4. Abre automáticamente el navegador en [http://localhost:3000](http://localhost:3000).
5. Despliega un menú interactivo en consola para gestionar el servidor o consultar detalles.

---

### Opción B: Comandos Manuales de Terminal

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar API Key de Gemini (Opcional):**
   Copia el archivo de ejemplo y agrega tu clave de [Google AI Studio](https://aistudio.google.com/):
   ```bash
   copy .env.example .env
   ```
   *(La aplicación funciona perfectamente en modo simulado incluso sin clave).*

3. **Iniciar servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   El servidor estará disponible de inmediato en [http://localhost:3000](http://localhost:3000).

4. **Compilar para producción:**
   ```bash
   npm run build
   ```

---

## 🖥️ 6. Accesos Directos Creados

| Archivo | Función |
| :--- | :--- |
| **`Radar.url`** | Acceso directo estándar de Windows para ir a `http://localhost:3000`. |
| **`Abrir_Radar.bat`** | Script por lotes inteligente que prepara el entorno, arranca el servidor y abre la web. |
| **`Ver_Detalles.bat`** | Abre el archivo `Detalles_del_Proyecto.html` con la ficha visual en tu navegador. |
| **`Detalles_del_Proyecto.html`** | Página interactiva retro 90s pop con Dragon Radar animado y monitor en vivo del servidor. |

---

*Desarrollado para la comunidad de Villa Nueva, Guatemala · 2026*
