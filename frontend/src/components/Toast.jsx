import { useEffect } from 'react';
import { IconCircleCheck, IconAlertCircle } from '@tabler/icons-react';

export default function Toast({ msg, onClose }) {
  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [msg, onClose]);

  if (!msg) return null;
  const Icon = msg.ok ? IconCircleCheck : IconAlertCircle;
  return (
    <div className={`toast ${msg.ok ? 'toast-success' : 'toast-error'}`}>
      <Icon size={18} stroke={1.9} className="toast-icon" />
      {msg.text}
    </div>
  );
}
