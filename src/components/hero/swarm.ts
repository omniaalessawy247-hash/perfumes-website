export interface Particle {
  id: string
  x: number
  y: number
  scale: number
  rotate: number
  z: number
  blur: number
  width: number
}

// Ingredients of all four perfumes, placed on a tight ellipse around the bottle.
// x / y are offsets from the bottle centre in vw / vh; z > 4 sits in front of it.

export const swarm: Particle[] = [
  { id: '05', x: -16, y: -22, scale: 1, rotate: -24, z: 3, blur: 0, width: 157 },
  { id: '05', x: 17, y: 20, scale: 1.1, rotate: 40, z: 3, blur: 0, width: 166 },
  { id: '05', x: -13, y: 32, scale: 0.7, rotate: 110, z: 3, blur: 0, width: 134 },
  { id: '05', x: 21, y: -2, scale: 0.6, rotate: -70, z: 3, blur: 0, width: 127 },
  { id: '06', x: 16, y: -30, scale: 1, rotate: 30, z: 3, blur: 0, width: 138 },
  { id: '06', x: -21, y: 8, scale: 1.1, rotate: -35, z: 3, blur: 0, width: 143 },
  { id: '06', x: 9, y: -40, scale: 0.6, rotate: 80, z: 3, blur: 0, width: 106 },
  { id: '06', x: -10, y: 40, scale: 0.7, rotate: -120, z: 3, blur: 0, width: 112 },
  { id: '07', x: -23, y: -6, scale: 0.8, rotate: 55, z: 3, blur: 0, width: 118 },
  { id: '07', x: 14, y: 37, scale: 0.7, rotate: -40, z: 3, blur: 0, width: 112 },
  { id: '07', x: 23, y: 14, scale: 0.9, rotate: 20, z: 3, blur: 0, width: 125 },
  { id: '07', x: -8, y: -40, scale: 0.55, rotate: 140, z: 3, blur: 0, width: 100 },
]
