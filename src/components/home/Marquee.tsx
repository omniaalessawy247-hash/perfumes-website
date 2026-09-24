import './marquee.css'

const words = ['Blood orange', 'Damask rose', 'Amber', 'Oud', 'Sambac jasmine', 'White musk', 'Vanilla', 'Pink pepper']

export default function Marquee() {
  const row = words.map((word) => (
    <span key={word} className="marquee-item serif">
      {word}
      <i aria-hidden="true" />
    </span>
  ))

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {row}
        {row}
      </div>
    </div>
  )
}
