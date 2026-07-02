import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Phase } from '@mafia/shared';
import { formatTime } from '../../lib/utils';

interface PhaseIndicatorProps {
  phase: Phase;
  day: number;
  endsAt: number;
}

const phaseConfig: Record<Phase, { key: string; color: string }> = {
  lobby: { key: 'lobby', color: 'text-gray-400' },
  night: { key: 'night', color: 'text-indigo-400' },
  day: { key: 'day', color: 'text-yellow-400' },
  voting: { key: 'voting', color: 'text-orange-400' },
  ended: { key: 'gameOver', color: 'text-red-400' },
};

export function PhaseIndicator({ phase, day, endsAt }: PhaseIndicatorProps) {
  const { t } = useTranslation();
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const update = () => {
      const remaining = Math.max(0, Math.floor((endsAt - Date.now()) / 1000));
      setTimeLeft(remaining);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [endsAt]);

  const config = phaseConfig[phase];

  return (
    <div className="card p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{t(`phaseIndicator.${config.key}`).split(' ')[0]}</span>
        <div>
          <p className={`text-lg font-bold ${config.color}`}>{t(`phaseIndicator.${config.key}`)}</p>
          {day > 0 && <p className="text-xs text-gray-500">{t('phaseIndicator.dayLabel', { number: day })}</p>}
        </div>
      </div>

      {phase !== 'lobby' && phase !== 'ended' && (
        <div className="text-left">
          <p className="text-2xl font-mono font-bold tabular-nums">
            {formatTime(timeLeft)}
          </p>
          <p className="text-xs text-gray-500">{t('phaseIndicator.remaining')}</p>
        </div>
      )}
    </div>
  );
}
