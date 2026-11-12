// Piko, maskot pizza. Gambar asli buatan sendiri (SVG), dengan tiga suasana hati.
const MOUTH = {
  happy: '<path d="M38 66 Q50 78 62 66" fill="none" stroke="#3b1d12" stroke-width="4" stroke-linecap="round"/>',
  cheer:
    '<path d="M35 63 Q50 88 65 63 Z" fill="#7a1f12" stroke="#3b1d12" stroke-width="3" stroke-linejoin="round"/><path d="M43 74 Q50 80 57 74 Q50 70 43 74Z" fill="#ff8a7a"/>',
  oops: '<path d="M39 73 Q50 62 61 73" fill="none" stroke="#3b1d12" stroke-width="4" stroke-linecap="round"/>',
};

export function mascot(mood = 'happy', size = 96) {
  const brows =
    mood === 'oops'
      ? '<path d="M30 40 L44 44 M70 40 L56 44" stroke="#3b1d12" stroke-width="3.5" stroke-linecap="round"/>'
      : '';
  return `<svg class="mascot mascot-${mood}" viewBox="0 0 100 100" width="${size}" height="${size}" aria-hidden="true" focusable="false">
  <circle cx="50" cy="52" r="44" fill="#c98a3f"/>
  <circle cx="50" cy="52" r="38" fill="#f2c14e"/>
  <circle cx="26" cy="34" r="6.5" fill="#b5301f"/><circle cx="74" cy="32" r="6.5" fill="#b5301f"/>
  <circle cx="22" cy="68" r="5.5" fill="#b5301f"/><circle cx="79" cy="70" r="5.5" fill="#b5301f"/>
  <g class="eyes">
    <ellipse cx="38" cy="51" rx="5" ry="6.2" fill="#3b1d12"/><ellipse cx="62" cy="51" rx="5" ry="6.2" fill="#3b1d12"/>
    <circle cx="40" cy="48.5" r="1.9" fill="#fff"/><circle cx="64" cy="48.5" r="1.9" fill="#fff"/>
  </g>
  ${brows}
  <circle cx="29" cy="62" r="5" fill="#ff8f7d" opacity=".55"/><circle cx="71" cy="62" r="5" fill="#ff8f7d" opacity=".55"/>
  ${MOUTH[mood] || MOUTH.happy}
</svg>`;
}

// Gelembung ucapan Piko. Isi `text` harus berupa teks tepercaya (sudah di-escape bila dari data lain).
export function speech(mood, text) {
  return `<div class="speech"><span class="sp-m">${mascot(mood, 46)}</span><div class="bubble">${text}</div></div>`;
}
