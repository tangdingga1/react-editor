const operationKeyCode = [
  'ArrowUp',
  'ArrowRight',
  'ArrowLeft',
  'ArrowDown',
  'Backspace'
];

const moveUnit = 2;

export default function keyboardEventListener(event: KeyboardEvent, { target, onChange, onDelete }) {
  const { key } = event;
  if (operationKeyCode.includes(key)) {
    event.preventDefault();
    const { id, data: { left, top } } = target;
    switch(key) {
      case 'ArrowUp':
        onChange(id, { top: top - moveUnit });
        break;
      case 'ArrowRight':
        onChange(id, { left: left + moveUnit });
        break;
      case 'ArrowLeft':
        onChange(id, { left: left - moveUnit });
        break;
      case 'ArrowDown':
        onChange(id, { top: top + moveUnit });
        break;
      case 'Backspace':
        onDelete(id);
        break;
    }
  }
}
