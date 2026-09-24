export interface Theme {
  bg: string
  text: string
  accent: string
  liquid: string
  onAccent: string
  dark: boolean
}

export interface Size {
  ml: number
  price: number
}

export interface Perfume {
  id: string
  name: string
  tagline: string
  story: string
  notes: { top: string; heart: string; base: string }
  theme: Theme
  bottle: string
  liquid: string
  ingredients: string[]
  scene: string
  sizes: Size[]
}

const defaultSizes: Size[] = [
  { ml: 30, price: 1200 },
  { ml: 50, price: 1800 },
  { ml: 100, price: 2900 },
]

export const perfumes: Perfume[] = [
  {
    id: 'ambre',
    name: 'AMBRE',
    tagline: 'A perfume that opens like golden hour.',
    story: 'Blood orange lifts, rose warms, and amber settles into skin like late afternoon light.',
    notes: { top: 'Blood orange', heart: 'Rose', base: 'Amber' },
    theme: { bg: '#F3E7DB', text: '#2E2521', accent: '#D9902F', liquid: '#F0C060', onAccent: '#2E2521', dark: false },
    bottle: '01',
    liquid: '03',
    ingredients: ['05', '06', '07'],
    scene: '18',
    sizes: defaultSizes,
  },
  {
    id: 'ward',
    name: 'WARD',
    tagline: 'Soft petals, warm skin.',
    story: 'Damask rose and pink pepper resting on a bed of white musk. Quiet, close, unforgettable.',
    notes: { top: 'Pink pepper', heart: 'Damask rose', base: 'White musk' },
    theme: { bg: '#F1DDD6', text: '#3A2226', accent: '#C9787C', liquid: '#E8A5A8', onAccent: '#2B1519', dark: false },
    bottle: '09',
    liquid: '15',
    ingredients: ['12', '28'],
    // New rose/pink-pepper campaign photo (public/assets/scenes/26.png).
    scene: '26',
    sizes: defaultSizes,
  },
  {
    id: 'oud-nuit',
    name: 'OUD NUIT',
    tagline: 'Smoke, velvet and midnight.',
    story: 'Dark oud wrapped in amber and vanilla. Made for evenings that do not end early.',
    notes: { top: 'Amber', heart: 'Oud', base: 'Vanilla' },
    theme: { bg: '#1E1416', text: '#F3E7DB', accent: '#C8963E', liquid: '#7A2E2E', onAccent: '#1E1416', dark: true },
    bottle: '10',
    liquid: '16',
    ingredients: ['13', '29'],
    // New oud/amber/velvet campaign photo (public/assets/scenes/25.png).
    scene: '25',
    sizes: defaultSizes,
  },
  {
    id: 'jasmin',
    name: 'JASMIN',
    tagline: 'Fresh petals after the rain.',
    story: 'Sambac jasmine and green leaves over clean musk. Bright, airy and effortless.',
    notes: { top: 'Green leaves', heart: 'Sambac jasmine', base: 'White musk' },
    theme: { bg: '#E9EDDC', text: '#2A3324', accent: '#7F9A62', liquid: '#F4F1D0', onAccent: '#1F2A1A', dark: false },
    bottle: '11',
    liquid: '17',
    ingredients: ['14', '30'],
    // New jasmine/rain/green campaign photo (public/assets/scenes/27.png).
    scene: '27',
    sizes: defaultSizes,
  },
]

export const findPerfume = (id: string | undefined): Perfume | undefined =>
  perfumes.find((p) => p.id === id)
