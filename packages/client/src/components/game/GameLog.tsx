import { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { GameEvent } from '@mafia/shared';
import { ScrollText } from 'lucide-react';

interface GameLogProps {
  events: GameEvent[];
}

export function GameLog({ events }: GameLogProps) {
  const { t } = useTranslation();
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [events]);

  return (
    <div className="card flex flex-col h-[300px]">
      <div className="flex items-center gap-2 p-3 border-b border-gray-800">
        <ScrollText className="w-4 h-4" />
        <span className="text-sm font-medium">{t('gameLog.title')}</span>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {events.length === 0 && (
          <p className="text-sm text-gray-500 text-center mt-4">{t('gameLog.noEvents')}</p>
        )}
        {events.map((event, idx) => (
          <div key={event.id ?? idx} className="text-xs text-gray-400">
            <span className="text-gray-600">
              {new Date(event.timestamp).toLocaleTimeString()}
            </span>{' '}
            {formatEvent(event, t)}
          </div>
        ))}
        <div ref={logEndRef} />
      </div>
    </div>
  );
}

function formatEvent(event: GameEvent, t: (key: string) => string): string {
  switch (event.type) {
    case 'kill':
      return t('gameLog.killed');
    case 'heal':
      return t('gameLog.healed');
    case 'investigate':
      return t('gameLog.investigated');
    case 'vote':
      return t('gameLog.voteCast');
    case 'lynch':
      return t('gameLog.lynched');
    case 'reveal':
      return t('gameLog.roleRevealed');
    case 'phase_change':
      return t('gameLog.phaseChanged');
    default:
      return t('gameLog.unknownEvent');
  }
}
