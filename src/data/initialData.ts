import { EventItem, ForumPost, UserProfile, AiSubagent, PlatformMetrics, EntrepreneurAd } from '../types';

export const INITIAL_EVENTS: EventItem[] = [
  {
    id: 'ev-vn-01',
    title: 'Festival del Chuchito y Sabor Villanovano',
    category: 'Gastronómico',
    date: '2026-10-18',
    time: '09:00 AM - 05:00 PM',
    locationName: 'Plaza Mayor y Parque Central de Villa Nueva',
    zona: 'Zona 1 - Centro Histórico',
    coordinates: { lat: 14.5262, lng: -90.5878 },
    description: 'Encuentro gastronómico tradicional con más de 30 cocineras tradicionales villanovanas. Degustación de chuchitos estilo Villa Nueva, atol de elote, garnachas, música de marimba orquesta y juegos de feria para niñas y niños.',
    shortSummary: 'Gran feria gastronómica con música en vivo, marimba y actividades familiares.',
    organizer: {
      name: 'Comisión de Cultura y Tradiciones VN',
      role: 'Gestor Comunitario',
      verified: true,
      type: 'Alcaldía Villa Nueva'
    },
    sourceType: 'municipal',
    targetAudience: 'Toda la familia · Niños y Abuelitos',
    cost: 'Entrada Gratis',
    capacity: 2500,
    rsvpCount: 840,
    isFeatured: true,
    status: 'Destacado',
    tags: ['Gastronomía', 'Tradición', 'Marimba', 'Familiar'],
    amenities: ['Parqueo Municipal Guiado', 'Seguridad PMT', 'Área Techada', 'Puntos Limpios'],
    gradientTheme: 'from-blue-600 via-indigo-700 to-red-600',
    accentColor: '#dc2626',
    iconName: 'UtensilsCrossed',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1509315811345-672d83ef2fbc?auto=format&fit=crop&w=800&q=80'
    ],
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=14.5262,-90.5878',
    wazeUrl: 'https://waze.com/ul?ll=14.5262,-90.5878&navigate=yes',
    howToGetThere: 'Desde CA-9 Sur ingresa por la 3a calle hacia el Parque Central de Villa Nueva. Habrá parqueo señalizado por PMT frente al edificio municipal.'
  },
  {
    id: 'ev-vn-02',
    title: 'Ciclovía Nocturna y Roller Fest El Frutal',
    category: 'Deportivo',
    date: '2026-10-21',
    time: '06:30 PM - 10:00 PM',
    locationName: 'Bulevar El Frutal, frente a Plaza El Frutal',
    zona: 'Zona 5 - El Frutal',
    coordinates: { lat: 14.5098, lng: -90.5694 },
    description: 'Circuito cerrado y seguro de 4.5 km para bicicletas, patines y caminata nocturna. Estaciones de hidratación, zumba familiar en tarima, luces led neón y préstamo gratuito de bicicletas para infantes.',
    shortSummary: 'Ruta recreativa nocturna para patines y bicis con zumba y música en vivo.',
    organizer: {
      name: 'Colectivo Bici-Vecinos Villa Nueva',
      role: 'Coordinador Deportivo',
      verified: true,
      type: 'Club Deportivo'
    },
    targetAudience: 'Jóvenes, Familias y Mascotas',
    cost: 'Gratis',
    capacity: 1200,
    rsvpCount: 620,
    isFeatured: true,
    status: 'Aprobado',
    tags: ['Bicicleta', 'Deporte Nocturno', 'Pet Friendly', 'Zumba'],
    amenities: ['Carril Exclusivo Seguro', 'Taller Mecánico de Emergencia', 'Hidratación', 'Ambulancia Preventiva'],
    gradientTheme: 'from-blue-700 via-sky-600 to-red-600',
    accentColor: '#2563eb',
    iconName: 'Bike',
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?auto=format&fit=crop&w=800&q=80'
    ],
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=14.5098,-90.5694',
    wazeUrl: 'https://waze.com/ul?ll=14.5098,-90.5694&navigate=yes',
    howToGetThere: 'Bulevar El Frutal Zona 5. Acceso directo desde San Miguel Petapa o Calzada Concepción. Carril cerrado con señalización reflectiva.'
  },
  {
    id: 'ev-vn-03',
    title: 'Noche de Cine Bajo las Estrellas & Pícnic',
    category: 'Familiar',
    date: '2026-10-24',
    time: '05:30 PM - 09:30 PM',
    locationName: 'Parque Nacional Naciones Unidas, Mirador hacia el Lago',
    zona: 'Bárcena & Naciones Unidas',
    coordinates: { lat: 14.4842, lng: -90.5985 },
    description: 'Proyección en pantalla inflable gigante de película animada infantil de aventuras, zona de fogatas controladas con bombones, zona pet friendly y mirador panorámico. Trae tu petate o silla plegable.',
    shortSummary: 'Cine al aire libre en el bosque con fogatas y vista hacia el Lago de Amatitlán.',
    organizer: {
      name: 'Comité de Vecinos Unidos Bárcena',
      role: 'Organización Comunitaria',
      verified: true,
      type: 'Comité Comunitario'
    },
    targetAudience: 'Familias con niños y Jóvenes',
    cost: 'Q10 (Mantenimiento del Parque)',
    capacity: 800,
    rsvpCount: 512,
    isFeatured: true,
    status: 'Destacado',
    tags: ['Cine al Aire Libre', 'Naturaleza', 'Fogata', 'Familiar'],
    amenities: ['Área de Fogata', 'Vigilancia Guardabosques', 'Food Trucks Locales', 'Baterías de Baños'],
    gradientTheme: 'from-blue-900 via-indigo-900 to-red-700',
    accentColor: '#dc2626',
    iconName: 'Film',
    imageUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1478147427282-58a87a120781?auto=format&fit=crop&w=800&q=80'
    ],
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=14.4842,-90.5985',
    wazeUrl: 'https://waze.com/ul?ll=14.4842,-90.5985&navigate=yes',
    howToGetThere: 'Kilómetro 21.5 Carretera al Pacífico (CA-9 Sur). Ingresar por garita principal del Parque Nacional Naciones Unidas hacia el Mirador.'
  },
  {
    id: 'ev-vn-04',
    title: 'Batalla de Hip-Hop & Arte Mural en Santa Clara',
    category: 'Juventud y Arte',
    date: '2026-10-25',
    time: '02:00 PM - 07:00 PM',
    locationName: 'Polideportivo Santa Clara, Canchas Techadas',
    zona: 'Zona 4 - Santa Clara',
    coordinates: { lat: 14.5360, lng: -90.5750 },
    description: 'Encuentro juvenil urbano villanovano con exhibición de muralismo en paneles efímeros, torneo de freestyle con temática de paz comunitaria, talleres de breakdance para principiantes y feria de emprendimientos de ropa local.',
    shortSummary: 'Torneo de freestyle, muralismo en vivo y feria de diseñadores emergentes.',
    organizer: {
      name: 'Colectivo Arte Callejero VN',
      role: 'Gestor Cultural Juvenil',
      verified: true,
      type: 'Colectivo Vecinal'
    },
    targetAudience: 'Jóvenes de 12 a 29 años y familias',
    cost: 'Gratis',
    capacity: 900,
    rsvpCount: 388,
    isFeatured: false,
    status: 'Aprobado',
    tags: ['Arte Urbano', 'Música', 'Freestyle', 'Juventud'],
    amenities: ['Canchas Techadas', 'Sonido Profesional', 'Seguridad PMT', 'Área de Emprendedores'],
    gradientTheme: 'from-blue-600 via-indigo-600 to-red-600',
    accentColor: '#2563eb',
    iconName: 'Sparkles',
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80'
    ],
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=14.5360,-90.5750',
    wazeUrl: 'https://waze.com/ul?ll=14.5360,-90.5750&navigate=yes',
    howToGetThere: 'Polideportivo Santa Clara Zona 4. A 300 metros de Centro Comercial Santa Clara. Estacionamiento disponible en canchas.'
  },
  {
    id: 'ev-vn-05',
    title: 'Reforestación Comunitaria y Senderismo Verde',
    category: 'Ecológico',
    date: '2026-10-31',
    time: '07:30 AM - 12:30 PM',
    locationName: 'Reserva Forestal Cerro Alux / Límite San José',
    zona: 'Zona 12 - San José Villa Nueva',
    coordinates: { lat: 14.4990, lng: -90.6120 },
    description: 'Jornada participativa para plantar 1,200 árboles de especies nativas (ciprés, pino y matilisguate). Incluye charla ecológica didáctica para infantes, entrega de kit de jardinería y refrigerio donado por empresas locales.',
    shortSummary: 'Siembra de árboles nativos y caminata interpretativa en familia.',
    organizer: {
      name: 'Red Ecológica de San José VN',
      role: 'Voluntariado Ambiental',
      verified: true,
      type: 'Colectivo Vecinal'
    },
    targetAudience: 'Todas las edades',
    cost: 'Gratis con Registro',
    capacity: 400,
    rsvpCount: 295,
    isFeatured: false,
    status: 'Aprobado',
    tags: ['Medio Ambiente', 'Voluntariado', 'Senderismo', 'Naturaleza'],
    amenities: ['Herramientas Provistas', 'Guías Ambientales', 'Refrigerio', 'Primeros Auxilios'],
    gradientTheme: 'from-blue-700 via-teal-600 to-red-600',
    accentColor: '#16a34a',
    iconName: 'Trees',
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=800&q=80'
    ],
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=14.4990,-90.6120',
    wazeUrl: 'https://waze.com/ul?ll=14.4990,-90.6120&navigate=yes',
    howToGetThere: 'Punto de encuentro: Escuela Oficial Urbana de San José Villa Nueva. Salida en caravana guiada a las 07:15 AM.'
  },
  {
    id: 'ev-vn-06',
    title: 'Feria del Libro y Cuentacuentos en Linda Vista',
    category: 'Cultural',
    date: '2026-11-01',
    time: '10:00 AM - 04:00 PM',
    locationName: 'Salón Comunal Linda Vista, Parque Infantil',
    zona: 'Zona 2 - Linda Vista',
    coordinates: { lat: 14.5420, lng: -90.5810 },
    description: 'Intercambio libre de libros, narración de leyendas guatemaltecas (El Sombrerón y La Llorona para niños) con títeres gigantes, taller de dibujo creativo y café artesanal para los padres.',
    shortSummary: 'Lecturas animadas, títeres, trueque de libros y café de especialidad.',
    organizer: {
      name: 'Biblioteca Móvil Villanovana',
      role: 'Promotora de Lectura',
      verified: true,
      type: 'Alcaldía Villa Nueva'
    },
    targetAudience: 'Bebés, Niños de 3 a 12 años y Padres',
    cost: 'Gratis',
    capacity: 350,
    rsvpCount: 180,
    isFeatured: false,
    status: 'Aprobado',
    tags: ['Cultura', 'Lectura Infantil', 'Títeres', 'Café'],
    amenities: ['Área Infantil Acolchada', 'Cafetería Vecinal', 'Mesas de Trabajo'],
    gradientTheme: 'from-blue-600 via-sky-600 to-red-500',
    accentColor: '#dc2626',
    iconName: 'BookOpen',
    imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1513475382585-d06e58bcb0d0?auto=format&fit=crop&w=800&q=80'
    ],
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=14.5420,-90.5810',
    wazeUrl: 'https://waze.com/ul?ll=14.5420,-90.5810&navigate=yes',
    howToGetThere: 'Salón Comunal Linda Vista Zona 2, frente a la Iglesia Católica. Accesible en transporte colectivo o vehículo particular.'
  },
  {
    id: 'ev-vn-07',
    title: 'Torneo Relámpago de Baloncesto 3x3 Ciudad Real',
    category: 'Deportivo',
    date: '2026-11-07',
    time: '08:00 AM - 03:00 PM',
    locationName: 'Canchas Municipales Ciudad Real II',
    zona: 'Zona 10 - Ciudad Real',
    coordinates: { lat: 14.5610, lng: -90.5615 },
    description: 'Torneo comunitario en categorías Infantil, Juvenil y Libre Mixto. Premios para los primeros tres lugares, hidratación garantizada, arbitraje federado y animación con DJ comunitario.',
    shortSummary: 'Competencia rápida de baloncesto en equipos de 3 con música y trofeos.',
    organizer: {
      name: 'Liga Barrial Ciudad Real',
      role: 'Director de Torneo',
      verified: true,
      type: 'Club Deportivo'
    },
    targetAudience: 'Deportistas y familias espectadoras',
    cost: 'Gratis inscripción',
    capacity: 600,
    rsvpCount: 310,
    isFeatured: false,
    status: 'Aprobado',
    tags: ['Deporte', 'Baloncesto', 'Juventud', 'Competencia'],
    amenities: ['Graderíos', 'Árbitros Certificados', 'Paramédicos', 'Música en Vivo'],
    gradientTheme: 'from-blue-700 via-indigo-600 to-red-600',
    accentColor: '#2563eb',
    iconName: 'Trophy',
    imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519766304817-4f37bda74a29?auto=format&fit=crop&w=800&q=80'
    ],
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=14.5610,-90.5615',
    wazeUrl: 'https://waze.com/ul?ll=14.5610,-90.5615&navigate=yes',
    howToGetThere: 'Canchas Municipales Ciudad Real II Zona 10. Ingreso por Avenida Petapa hacia Ciudad Real. Vigilancia PMT en la entrada.'
  },
  {
    id: 'ev-radar-01',
    title: 'Radar Fest Villa Nueva: Feria Gastronómica & Food Trucks',
    category: 'Gastronómico',
    date: '2026-10-28',
    time: '11:00 AM - 09:00 PM',
    locationName: 'Explanada El Frutal & Centro Comercial Metrocentro VN',
    zona: 'Zona 5 - El Frutal',
    coordinates: { lat: 14.5120, lng: -90.5720 },
    description: 'Evento privado y exclusivo producido por la plataforma Radar Villa Nueva. Más de 18 food trucks y stands de emprendedores locales, música acústica en vivo, área de degustación de café de especialidad, zona infantil con inflables y rifas de pases VIP para la comunidad de Radar.',
    shortSummary: 'Feria gastronómica y bazar de emprendedores organizado por Radar Villa Nueva con food trucks y música.',
    organizer: {
      name: 'Radar Villa Nueva (Producción)',
      role: 'Organizador Oficial Radar',
      verified: true,
      type: 'Radar Villa Nueva (Exclusivo)'
    },
    sourceType: 'radar',
    targetAudience: 'Familias, Jóvenes y Amantes del Buen Comer',
    cost: 'Entrada Libre',
    capacity: 3000,
    rsvpCount: 1420,
    isFeatured: true,
    status: 'Destacado',
    tags: ['Radar Exclusivo', 'Food Trucks', 'Emprendedores', 'Música en Vivo', 'Gastronomía'],
    amenities: ['Área de Food Trucks', 'Stands Emprendedores', 'Tarima Musical', 'Seguridad Privada & PMT', 'Baños Móviles'],
    gradientTheme: 'from-blue-900 via-red-600 to-amber-500',
    accentColor: '#dc2626',
    iconName: 'Sparkles',
    imageUrl: 'https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?auto=format&fit=crop&w=1200&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80'
    ],
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=14.5120,-90.5720',
    wazeUrl: 'https://waze.com/ul?ll=14.5120,-90.5720&navigate=yes',
    howToGetThere: 'Bulevar El Frutal Zona 5, frente a Metrocentro Villa Nueva. Acceso fluido con parqueo privado vigilado.'
  },
  {
    id: 'ev-radar-02',
    title: 'Noche de Rock Acústico & Bazar Nocturno Radar',
    category: 'Cultural',
    date: '2026-11-06',
    time: '06:00 PM - 11:00 PM',
    locationName: 'Terraza y Jardines de Santa Clara',
    zona: 'Zona 4 - Santa Clara',
    coordinates: { lat: 14.5380, lng: -90.5725 },
    description: 'Evento nocturno privado de Radar Villa Nueva. Bandas tributo de rock en español acústico, bazar de diseño villanovano independiente, cervecería artesanal nacional y zona lounge con café de Bárcena.',
    shortSummary: 'Bazar nocturno con música en vivo y marcas villanovanas exclusivas organizado por Radar.',
    organizer: {
      name: 'Radar Villa Nueva Entretenimiento',
      role: 'Producción Privada Radar',
      verified: true,
      type: 'Radar Villa Nueva (Exclusivo)'
    },
    sourceType: 'radar',
    targetAudience: 'Jóvenes y Adultos',
    cost: 'Q25 (Incluye Bebida)',
    capacity: 850,
    rsvpCount: 460,
    isFeatured: true,
    status: 'Destacado',
    tags: ['Radar Exclusivo', 'Rock Acústico', 'Bazar Nocturno', 'Café & Cerveza Artesanal'],
    amenities: ['Zona Lounge Techada', 'Seguridad Privada', 'Stands de Emprendedores', 'Parqueo Iluminado'],
    gradientTheme: 'from-blue-950 via-indigo-900 to-red-700',
    accentColor: '#2563eb',
    iconName: 'Radio',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80'
    ],
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=14.5380,-90.5725',
    wazeUrl: 'https://waze.com/ul?ll=14.5380,-90.5725&navigate=yes',
    howToGetThere: 'Centro Comercial Santa Clara Zona 4. Ingreso directo por Calzada Raúl Aguilar Batres / CA-9 Sur.'
  }
];

export const INITIAL_FORUM_POSTS: ForumPost[] = [
  {
    id: 'post-vn-101',
    title: '¿Alguien sabe si el Festival del Chuchito tiene rampa para cochecitos de bebé?',
    authorName: 'Claudia Morales',
    authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
    authorRole: 'Vecino',
    zona: 'Zona 1 - Centro Histórico',
    timestamp: 'Hace 45 minutos',
    content: '¡Hola vecinos! Queremos ir este sábado con mis dos nenas pequeñas y abuelita. ¿Saben si el parque central tiene acceso con rampas habilitadas y dónde recomiendan estacionar para no caminar tanto con la carriola?',
    eventId: 'ev-vn-01',
    eventTitle: 'Festival del Chuchito y Sabor Villanovano',
    upvotes: 18,
    upvotedBy: ['usr-01', 'usr-03'],
    tags: ['Accesibilidad', 'Familia', 'Parqueo'],
    replies: [
      {
        id: 'rep-01',
        authorName: 'Carlos Mendizábal (PMT Villa Nueva)',
        authorRole: 'Admin Municipal',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
        timestamp: 'Hace 28 minutos',
        content: '¡Hola doña Claudia! Sí, las 4 esquinas del parque central cuentan con rampas recién niveladas. Habilitamos parqueo preferencial para familias con bebés y adultos mayores a un costado del edificio municipal sobre la 3a calle.'
      },
      {
        id: 'rep-02',
        authorName: 'Subagente Moderador IA',
        authorRole: 'Moderador IA',
        authorAvatar: '',
        isAiAgent: true,
        timestamp: 'Hace 25 minutos',
        content: '🤖 [Subagente Asistente Vecinal]: Verificado. El evento cuenta con el sello "100% Accesible para Familias". Si llegas entre 9:30 AM y 11:00 AM encontrarás sombra óptima y menor congestión vehicular.'
      }
    ],
    aiModeration: {
      status: 'safe',
      familyScore: 99,
      analysisNotes: 'Consulta comunitaria cordial, respetuosa y orientada al bienestar familiar y accesibilidad.',
      checkedByAgent: 'Agente Guardián de la Comunidad VN',
      checkedAt: '2026-10-14 17:15'
    }
  },
  {
    id: 'post-vn-102',
    title: '¡Felicitaciones a los organizadores de la Ciclovía en El Frutal! Nos vemos en patines',
    authorName: 'Marcos Rivas',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
    authorRole: 'Líder Comunitario',
    zona: 'Zona 5 - El Frutal',
    timestamp: 'Hace 2 horas',
    content: 'La semana pasada estuvo increíble el ambiente con los chicos. Este miércoles llevamos grupo de 15 patinadores con chalecos reflectivos. Les sugiero a todos llevar casco y agua para los pequeños.',
    eventId: 'ev-vn-02',
    eventTitle: 'Ciclovía Nocturna y Roller Fest El Frutal',
    upvotes: 34,
    upvotedBy: ['usr-01'],
    tags: ['Deporte', 'Patines', 'Comunidad'],
    replies: [
      {
        id: 'rep-03',
        authorName: 'Fernanda Ortiz',
        authorRole: 'Vecino',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
        timestamp: 'Hace 1 hora',
        content: '¡Allí estaremos! Mis sobrinos van a estrenar sus patines con luces neón. ¡Qué alegría ver eventos así en Villa Nueva!'
      }
    ],
    aiModeration: {
      status: 'safe',
      familyScore: 98,
      analysisNotes: 'Fomenta el deporte saludable, seguridad vial comunitaria y convivencia.',
      checkedByAgent: 'Agente Guardián de la Comunidad VN',
      checkedAt: '2026-10-14 16:05'
    }
  },
  {
    id: 'post-vn-103',
    title: 'Propuesta: ¿Podemos organizar una clase de yoga y meditación en Naciones Unidas?',
    authorName: 'Elena De León',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    authorRole: 'Vecino',
    zona: 'Bárcena & Naciones Unidas',
    timestamp: 'Hace 4 horas',
    content: 'Aprovechando el aire fresco del mirador hacia el lago, varias mamás de Bárcena quisiéramos reunirnos un domingo por la mañana para yoga suave familiar. ¿A quién podemos solicitar el espacio en la administración del parque?',
    upvotes: 27,
    upvotedBy: [],
    tags: ['Propuesta', 'Salud', 'Bienestar'],
    replies: [
      {
        id: 'rep-04',
        authorName: 'Subagente Curador & Gestor IA',
        authorRole: 'Moderador IA',
        authorAvatar: '',
        isAiAgent: true,
        timestamp: 'Hace 3 horas',
        content: '🤖 [Subagente Gestor]: ¡Excelente iniciativa! Puedes registrar tu propuesta directamente desde el botón "Proponer Evento" en esta plataforma. Se envía al panel municipal y te asignan horario y permisos en menos de 24 horas.'
      }
    ],
    aiModeration: {
      status: 'safe',
      familyScore: 100,
      analysisNotes: 'Propuesta constructiva de bienestar y vida saludable.',
      checkedByAgent: 'Agente Guardián de la Comunidad VN',
      checkedAt: '2026-10-14 14:30'
    }
  }
];

export const INITIAL_SUBAGENTS: AiSubagent[] = [
  {
    id: 'agent-guardian',
    name: 'Guardián Comunitario',
    role: 'Moderación y Seguridad en Tiempo Real',
    title: 'Subagente de Convivencia Familiar',
    avatar: 'ShieldCheck',
    status: 'active',
    lastAction: 'Post #101 analizado: 99% Convivencia Familiar (Aprobado automáticamente)',
    processedCount: 142,
    model: 'gemini-3.8-flash',
    description: 'Inspecciona foros y comentarios de forma ininterrumpida. Detecta lenguaje inapropiado, protege el ambiente familiar y califica la cordialidad vecinal.',
    specialty: 'Filtro de seguridad, detección de toxicidad y fomento de diálogo constructivo.',
    badges: ['Mod en Vivo', 'Filtro Familiar', 'Cero Odio']
  },
  {
    id: 'agent-curator',
    name: 'Curador de Experiencias VN',
    role: 'Enriquecimiento y Optimización de Eventos',
    title: 'Subagente Editorial & Logístico',
    avatar: 'Sparkles',
    status: 'active',
    lastAction: 'Optimizó logística y accesibilidad para "Festival del Chuchito"',
    processedCount: 89,
    model: 'gemini-3.8-flash',
    description: 'Asiste a vecinos y organizadores en la redacción atractiva de convocatorias, recomienda amenidades faltantes (parqueo, sombra, hidratación) y categoriza zonas.',
    specialty: 'Copywriting urbano maximalista, SEO local de eventos y validación logística.',
    badges: ['Copywriting Creativo', 'Logística VN', 'Tags Automáticos']
  },
  {
    id: 'agent-analyst',
    name: 'Vigia de Afluencia & Datos',
    role: 'Estadísticas y Notificaciones Predictivas',
    title: 'Subagente Predictivo & Georadar',
    avatar: 'Activity',
    status: 'active',
    lastAction: 'Calculó afluencia pico para el fin de semana: +2,150 vecinos esperados',
    processedCount: 230,
    model: 'gemini-3.8-flash',
    description: 'Monitorea métricas en tiempo real, calcula el radio de impacto geográfico para alertas push y predice asistencia según zona y horarios de tráfico.',
    specialty: 'Cálculo de densidad vecinal, geocercas y pronósticos de participación comunitaria.',
    badges: ['Predictor de Afluencia', 'Push Geo-Targeting', 'Métricas Vivas']
  }
];

export const INITIAL_USER: UserProfile = {
  id: 'usr-01',
  name: 'Brayan Martínez',
  email: 'brajanmartinez0490@gmail.com',
  role: 'admin', // defaulted to admin so the user can immediately experience the full admin panel & subagents!
  zona: 'Zona 1 - Centro Histórico',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
  savedEvents: ['ev-vn-01', 'ev-vn-02'],
  rsvps: [
    {
      eventId: 'ev-vn-01',
      ticketCode: 'VN-2026-CHUCHITO-894',
      numPeople: 3,
      qrSimulated: 'QR_VN_CHUCHITO_01',
      registeredAt: '2026-10-14 10:20'
    }
  ],
  notificationsEnabled: true,
  notificationRadiusKm: 5
};

export const INITIAL_METRICS: PlatformMetrics = {
  totalEventsActive: 7,
  totalRsvps: 3145,
  activeNeighbors: 4890,
  familyFriendlinessIndex: 98.4,
  topZonas: [
    { zona: 'Zona 1 - Centro Histórico', count: 1240, percentage: 39 },
    { zona: 'Zona 5 - El Frutal', count: 780, percentage: 25 },
    { zona: 'Bárcena & Naciones Unidas', count: 620, percentage: 20 },
    { zona: 'Zona 4 - Santa Clara', count: 505, percentage: 16 }
  ],
  categoryBreakdown: [
    { category: 'Familiar', count: 980, color: '#10b981' },
    { category: 'Gastronómico', count: 840, color: '#f97316' },
    { category: 'Deportivo', count: 930, color: '#06b6d4' },
    { category: 'Juventud y Arte', count: 395, color: '#d946ef' }
  ],
  weeklyAttendanceForecast: [
    { day: 'Mié', predictedAttendance: 620 },
    { day: 'Jue', predictedAttendance: 340 },
    { day: 'Vie', predictedAttendance: 890 },
    { day: 'Sáb', predictedAttendance: 2450 },
    { day: 'Dom', predictedAttendance: 1980 }
  ],
  moderationStats: {
    reviewedPosts: 142,
    autoApproved: 139,
    flagged: 3,
    responseTimeMs: 310
  }
};

// Geolocation center for Villa Nueva
export const VILLA_NUEVA_CENTER = {
  lat: 14.5262,
  lng: -90.5878,
  cityName: 'Villa Nueva, Guatemala',
  department: 'Guatemala'
};

export const INITIAL_ADS: EntrepreneurAd[] = [
  {
    id: 'ad-vn-01',
    businessName: 'El Chuchito Gourmet & Ahumados Villa Nueva',
    ownerName: 'Doña Elena Batres',
    category: 'Gastronomía & Food Trucks',
    phone: '+502 5412-8890',
    email: 'contacto@chuchitovillanovano.gt',
    instagramUrl: 'https://instagram.com/chuchito_villanovano',
    facebookUrl: 'https://facebook.com/chuchitovillanovano',
    spaceType: 'Espacio Food Truck / Remolque',
    targetEventId: 'ev-radar-01',
    targetEventTitle: 'Radar Fest Villa Nueva: Feria Gastronómica',
    zona: 'Zona 1 - Centro Histórico',
    productDescription: 'Chuchitos tradicionales de cerdo ahumado, pollo en salsa de chile pasa criollo y masa de maíz amarillo nixtamalizado en fogón de leña. Más de 15 años deleitando a Villa Nueva.',
    imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'
    ],
    specialOffer: '10% de descuento y atol de elote gratis en compras mayores a Q50 para usuarios de Radar',
    status: 'destacado',
    createdAt: '2026-10-12',
    budget: 'Q400 por espacio',
    verifiedBadge: true
  },
  {
    id: 'ad-vn-02',
    businessName: 'Café Mirador Bárcena & Repostería',
    ownerName: 'Ing. Carlos Monterroso',
    category: 'Café, Repostería & Postres',
    phone: '+502 4190-3321',
    email: 'info@cafebarcena.gt',
    instagramUrl: 'https://instagram.com/cafebarcena_gt',
    spaceType: 'Stand Comercial en Feria / Bazar',
    targetEventId: 'ev-vn-03',
    targetEventTitle: 'Noche de Cine Bajo las Estrellas & Pícnic',
    zona: 'Bárcena & Naciones Unidas',
    productDescription: 'Café de especialidad cosechado en las faldas de Bárcena a 1,600 msnm. Variedades Bourbon y Caturra tostadas artesanalmente con perfiles achocolatados y repostería casera.',
    imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80'
    ],
    specialOffer: 'Muestra gratis de espresso y 2x1 en capuchinos de 4oz con tu ticket de Radar',
    status: 'destacado',
    createdAt: '2026-10-13',
    budget: 'Q350 por stand',
    verifiedBadge: true
  },
  {
    id: 'ad-vn-03',
    businessName: 'Cueros & Textiles Linda Vista',
    ownerName: 'Marta Lidia Gómez',
    category: 'Moda, Ropa & Calzado',
    phone: '+502 5901-7744',
    email: 'contacto@cueroslindavista.gt',
    instagramUrl: 'https://instagram.com/cueros_lindavista',
    spaceType: 'Stand Comercial en Feria / Bazar',
    targetEventId: 'ev-radar-02',
    targetEventTitle: 'Noche de Rock Acústico & Bazar Nocturno Radar',
    zona: 'Zona 2 - Linda Vista',
    productDescription: 'Billeteras, bolsos de cuero legítimo con detalles de tejidos típicos guatemaltecos y fajas bordadas con motivos mayas hechas a mano por artesanas de Linda Vista.',
    imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80'
    ],
    specialOffer: 'Personalizado con grabado láser de iniciales gratis en cada compra',
    status: 'aprobado',
    createdAt: '2026-10-14',
    budget: 'Q300 por stand',
    verifiedBadge: true
  },
  {
    id: 'ad-vn-04',
    businessName: 'Heladería Natural & Paletas El Frutal',
    ownerName: 'Javier Castillo',
    category: 'Gastronomía & Food Trucks',
    phone: '+502 4733-1199',
    email: 'paletasfrutal@gmail.com',
    instagramUrl: 'https://instagram.com/paletas_frutal',
    spaceType: 'Espacio Food Truck / Remolque',
    targetEventId: 'ev-vn-02',
    targetEventTitle: 'Ciclovía Nocturna y Roller Fest El Frutal',
    zona: 'Zona 5 - El Frutal',
    productDescription: 'Paletas artesanales con frutas 100% naturales (maracuyá con leche condensada, mango con tajín, coco tostado y fresas con crema) servidas desde un remolque vintage.',
    imageUrl: 'https://images.unsplash.com/photo-1505394033641-40c6ad1178d7?auto=format&fit=crop&w=800&q=80',
    specialOffer: 'Paleta infantil a Q5 al mostrar tu pase de registro familiar de Radar',
    status: 'aprobado',
    createdAt: '2026-10-14',
    budget: 'Q300 por espacio',
    verifiedBadge: true
  },
  {
    id: 'ad-vn-05',
    businessName: 'Audio Pro & Tarimas Villanovanas',
    ownerName: 'Marco Antonio Rodas',
    category: 'Patrocinador Oficial de Evento',
    phone: '+502 5200-9988',
    email: 'gerencia@audioprovn.com',
    websiteUrl: 'https://audioprovillanueva.gt',
    spaceType: 'Patrocinio Oficial de Evento (Lonas & Escenario)',
    targetEventId: 'ev-radar-01',
    targetEventTitle: 'Radar Fest Villa Nueva: Feria Gastronómica',
    zona: 'Zona 4 - Santa Clara',
    productDescription: 'Empresa villanovana proveedora de sonido line-array profesional, luces robóticas, microfonía y pantallas LED para festivales y ferias patronales.',
    imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
    specialOffer: 'Descuento del 20% en renta de audio a organizadores registrados en Radar',
    status: 'destacado',
    createdAt: '2026-10-10',
    budget: 'Patrocinador Técnico Oficial',
    verifiedBadge: true
  },
  {
    id: 'ad-vn-06',
    businessName: 'Vivero Botánico & Suculentas Santa Clara',
    ownerName: 'Sonia Marroquín',
    category: 'Artesanías & Hecho a Mano',
    phone: '+502 4321-0088',
    email: 'suculentas.santaclara@gmail.com',
    spaceType: 'Stand Comercial en Feria / Bazar',
    targetEventId: 'ev-vn-05',
    targetEventTitle: 'Reforestación Comunitaria y Senderismo Verde',
    zona: 'Zona 4 - Santa Clara',
    productDescription: 'Cactus, suculentas y plantas medicinales en macetas artesanales de barro pintadas a mano con motivos folclóricos villanovanos.',
    imageUrl: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80',
    specialOffer: 'Mini suculenta de cortesía por compras mayores a Q40',
    status: 'en_revision',
    createdAt: '2026-10-14',
    budget: 'Q250 por stand',
    verifiedBadge: false
  }
];
