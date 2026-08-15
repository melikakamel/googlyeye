const eyesSVG = document.querySelector('#eyes');
const eyes = [
  { eye: eyesSVG.querySelector('#eye-left'), pupil: eyesSVG.querySelector('#pupil-left'), offsetX: 0 },
  { eye: eyesSVG.querySelector('#eye-right'), pupil: eyesSVG.querySelector('#pupil-right'), offsetX: 0 }
];

const updateEye = (x, y, { eye, pupil, offsetX }) => {
  const eyeRect = eye.getBoundingClientRect();
  const centerX = eyeRect.left + eyeRect.width / 2;
  const centerY = eyeRect.top + eyeRect.height / 2;

  const dx = x - centerX;
  const dy = y - centerY;

  const pupilRect = pupil.getBoundingClientRect();
  const maxX = pupilRect.width / 2;
  const maxY = pupilRect.height / 2;

  const angle = Math.atan2(dy, dx);
  const newX = offsetX + Math.cos(angle) * maxX;
  const newY = Math.sin(angle) * maxY;

  const svgCTM = eyesSVG.getScreenCTM();
  pupil.setAttribute('transform', `translate(${newX / svgCTM.a}, ${newY / svgCTM.d})`);
};

const calcOffset = () => {
  for (const props of eyes) {
    props.pupil.removeAttribute('transform');
    const eyeRect = props.eye.getBoundingClientRect();
    const pupilRect = props.pupil.getBoundingClientRect();
    props.offsetX = ((eyeRect.right - pupilRect.right) - (pupilRect.left - eyeRect.left)) / 2;
  }
};
calcOffset();
window.addEventListener('resize', calcOffset);

let frame;
window.addEventListener('mousemove', ev => {
  cancelAnimationFrame(frame);
  frame = requestAnimationFrame(() => {
    for (const eyeProps of eyes) updateEye(ev.clientX, ev.clientY, eyeProps);
  });
});

window.addEventListener('touchmove', ev => {
  const touch = ev.touches[0];
  if (!touch) return;
  cancelAnimationFrame(frame);
  frame = requestAnimationFrame(() => {
    for (const eyeProps of eyes) updateEye(touch.clientX, touch.clientY, eyeProps);
  });
}, { passive: true });

const triggerClickEffect = () => {
  eyesSVG.classList.add('clicked');
  setTimeout(() => eyesSVG.classList.remove('clicked'), 150);
};
eyesSVG.addEventListener('mousedown', triggerClickEffect);
eyesSVG.addEventListener('touchstart', triggerClickEffect, { passive: true });

const eyeGroupLeft = document.querySelector('#eye-group-left');
const eyeGroupRight = document.querySelector('#eye-group-right');

const blink = () => {
  eyeGroupLeft.classList.add('blink');
  eyeGroupRight.classList.add('blink');
  setTimeout(() => {
    eyeGroupLeft.classList.remove('blink');
    eyeGroupRight.classList.remove('blink');
  }, 150);
};

const scheduleNextBlink = () => {
  const delay = 2000 + Math.random() * 2000;
  setTimeout(() => {
    blink();
    scheduleNextBlink();
  }, delay);
};
scheduleNextBlink();