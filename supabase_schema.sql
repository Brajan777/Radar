-- ==============================================================================
-- RADAR SUR · Esquema de Base de Datos para Emprendedores en Supabase
-- Villa Nueva · San Miguel Petapa · Villa Canales
-- ==============================================================================
-- Instrucciones:
-- 1. Ve a tu proyecto en https://supabase.com
-- 2. Haz clic en "SQL Editor" en el menú lateral izquierdo
-- 3. Pega este contenido completo y haz clic en "RUN"
-- ==============================================================================

-- 1. Crear tabla de emprendedores y solicitudes comerciales
CREATE TABLE IF NOT EXISTS public.entrepreneurs (
    id TEXT PRIMARY KEY,
    business_name TEXT NOT NULL,
    owner_name TEXT NOT NULL,
    category TEXT NOT NULL,
    municipio TEXT NOT NULL DEFAULT 'Villa Nueva',
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    instagram_url TEXT,
    facebook_url TEXT,
    website_url TEXT,
    space_type TEXT NOT NULL DEFAULT 'Stand Comercial en Feria / Bazar',
    target_event_id TEXT,
    target_event_title TEXT,
    zona TEXT NOT NULL,
    product_description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    special_offer TEXT,
    coupon_code TEXT,
    discount_percentage INTEGER DEFAULT 15,
    coupons_left INTEGER DEFAULT 15,
    total_coupons_issued INTEGER DEFAULT 25,
    coupons_redeemed INTEGER DEFAULT 0,
    password TEXT DEFAULT 'negocio123',
    status TEXT NOT NULL DEFAULT 'en_revision' CHECK (status IN ('aprobado', 'en_revision', 'destacado', 'contactado')),
    budget TEXT,
    verified_badge BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Índices para búsqueda rápida por municipio, categoría y estado
CREATE INDEX IF NOT EXISTS idx_entrepreneurs_municipio ON public.entrepreneurs (municipio);
CREATE INDEX IF NOT EXISTS idx_entrepreneurs_category ON public.entrepreneurs (category);
CREATE INDEX IF NOT EXISTS idx_entrepreneurs_status ON public.entrepreneurs (status);
CREATE INDEX IF NOT EXISTS idx_entrepreneurs_created_at ON public.entrepreneurs (created_at DESC);

-- 3. Habilitar Seguridad por Fila (Row Level Security - RLS)
ALTER TABLE public.entrepreneurs ENABLE ROW LEVEL SECURITY;

-- 4. Políticas de Seguridad (RLS)
-- Permitir que cualquier visitante (rol anon) pueda registrar su solicitud de emprendedor
DROP POLICY IF EXISTS "Permitir registro publico de emprendedores" ON public.entrepreneurs;
CREATE POLICY "Permitir registro publico de emprendedores"
ON public.entrepreneurs
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Permitir lectura pública de todos los emprendimientos (o aprobados)
DROP POLICY IF EXISTS "Permitir lectura de emprendedores" ON public.entrepreneurs;
CREATE POLICY "Permitir lectura de emprendedores"
ON public.entrepreneurs
FOR SELECT
TO anon, authenticated
USING (true);

-- Permitir actualización (para aprobar, destacar o editar)
DROP POLICY IF EXISTS "Permitir actualizacion de emprendedores" ON public.entrepreneurs;
CREATE POLICY "Permitir actualizacion de emprendedores"
ON public.entrepreneurs
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- Permitir eliminación desde el panel
DROP POLICY IF EXISTS "Permitir eliminacion de emprendedores" ON public.entrepreneurs;
CREATE POLICY "Permitir eliminacion de emprendedores"
ON public.entrepreneurs
FOR DELETE
TO anon, authenticated
USING (true);

-- 5. Semilla inicial de datos (Emprendedores de Villa Nueva, San Miguel Petapa y Villa Canales)
INSERT INTO public.entrepreneurs (
    id, business_name, owner_name, category, municipio, phone, email, instagram_url, 
    space_type, zona, product_description, image_url, special_offer, coupon_code, 
    discount_percentage, coupons_left, status, budget, verified_badge
) VALUES
(
    'ad-vn-01',
    'Chuchitos & Antojitos Doña Lupe',
    'Guadalupe Morales',
    'Gastronomía & Food Trucks',
    'Villa Nueva',
    '+502 5521-3344',
    'donalupe.chuchitos@gmail.com',
    'https://instagram.com/donalupe_antojitos',
    'Stand Comercial en Feria / Bazar',
    'Zona 1 - Centro Histórico',
    'Chuchitos tradicionales de carne y cerdo con receta villanovana de tres generaciones, tostadas con chicharrón y atol de elote caliente.',
    'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80',
    '15% de descuento en el combo familiar de 6 chuchitos y 2 atoles',
    'RADAR-CHUCHITO15',
    15,
    18,
    'destacado',
    'Q350 por espacio',
    true
),
(
    'ad-smp-01',
    'Café de Altura San Miguel & Postres Artesanales',
    'Héctor Sandoval',
    'Café, Repostería & Postres',
    'San Miguel Petapa',
    '+502 5812-7799',
    'cafesanmiguel.gt@gmail.com',
    'https://instagram.com/cafesanmiguel_gt',
    'Stand Comercial en Feria / Bazar',
    'Petapa - Centro & Parque Central',
    'Café cosechado en fincas locales del sur, filtrado Chemex y V60, quequitos de elote tierno, pays de queso artesanal y bebidas frías de espresso.',
    'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
    'Café americano o latte mediano 2x1 presentando cupón de Radar',
    'RADAR-PETAPACAFE',
    50,
    14,
    'destacado',
    'Q350 por espacio',
    true
),
(
    'ad-vc-01',
    'Dulces & Conservas de Piña Canaleña',
    'Familia Morales Canales',
    'Gastronomía & Food Trucks',
    'Villa Canales',
    '+502 5304-9911',
    'pinascanaleñas@gmail.com',
    'https://instagram.com/pinas_canaleñas',
    'Stand Comercial en Feria / Bazar',
    'Villa Canales - Centro & Plaza',
    'Conservas artesanales de piña cosechada en Villa Canales, mermeladas sin preservantes, piña deshidratada, vinagre de piña y néctares naturales.',
    'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=800&q=80',
    '15% de descuento en la compra del combo tripack de mermeladas',
    'RADAR-PINA15',
    15,
    20,
    'destacado',
    'Q300 por stand',
    true
)
ON CONFLICT (id) DO NOTHING;
