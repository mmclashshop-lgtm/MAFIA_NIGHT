import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Player, Role } from '@mafia/shared';
import { Heart, Skull, Search, Swords } from 'lucide-react';

interface NightActionsProps {
  players: Player[];
  role: Role;
  onSubmit: (targetId: string, actionType?: string) => Promise<void>;
}

const roleActionLabels: Record<string, { verbKey: string; icon: React.ReactNode; color: string }> = {
  mafia: { verbKey: 'killVerb', icon: <Swords className="w-4 h-4" />, color: 'bg-red-600 hover:bg-red-700' },
  godfather: { verbKey: 'killVerb', icon: <Swords className="w-4 h-4" />, color: 'bg-red-600 hover:bg-red-700' },
  doctor: { verbKey: 'healVerb', icon: <Heart className="w-4 h-4" />, color: 'bg-green-600 hover:bg-green-700' },
  medic: { verbKey: 'healVerb', icon: <Heart className="w-4 h-4" />, color: 'bg-green-600 hover:bg-green-700' },
  cop: { verbKey: 'investigateVerb', icon: <Search className="w-4 h-4" />, color: 'bg-[#8B0000] hover:bg-[#B22222]' },
  detective: { verbKey: 'investigateVerb', icon: <Search className="w-4 h-4" />, color: 'bg-[#8B0000] hover:bg-[#B22222]' },
  spy: { verbKey: 'spyVerb', icon: <Search className="w-4 h-4" />, color: 'bg-purple-600 hover:bg-purple-700' },
  serial_killer: { verbKey: 'killVerb', icon: <Skull className="w-4 h-4" />, color: 'bg-red-700 hover:bg-red-800' },
  vigilante: { verbKey: 'shootVerb', icon: <Swords className="w-4 h-4" />, color: 'bg-orange-600 hover:bg-orange-700' },
  sniper: { verbKey: 'snipeVerb', icon: <Swords className="w-4 h-4" />, color: 'bg-orange-600 hover:bg-orange-700' },
};

export function NightActions({ players, role, onSubmit }: NightActionsProps) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<string | null>(null);
  const [witchAction, setWitchAction] = useState<'save' | 'kill' | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const actionConfig = roleActionLabels[role.id] ?? { verbKey: 'target', icon: null, color: 'btn-primary' };
  const isWitch = role.id === 'witch';

  const handleSubmit = async () => {
    if (!selected) return;
    setSubmitting(true);
    if (isWitch && witchAction) {
      const actionType = witchAction === 'save' ? 'witch_save' : 'witch_kill';
      await onSubmit(selected, actionType);
    } else {
      await onSubmit(selected);
    }
    setSubmitting(false);
  };

  return (
    <div className="card p-4">
      <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
        {t('nightActions.title', { role: role.name })}
      </h3>

      {isWitch && (
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setWitchAction(witchAction === 'save' ? null : 'save')}
            className={`flex-1 px-3 py-2 rounded-lg text-sm transition-all ${
              witchAction === 'save'
                ? 'bg-green-600 text-white ring-2 ring-green-400'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {t('nightActions.savePotion')}
          </button>
          <button
            onClick={() => setWitchAction(witchAction === 'kill' ? null : 'kill')}
            className={`flex-1 px-3 py-2 rounded-lg text-sm transition-all ${
              witchAction === 'kill'
                ? 'bg-red-600 text-white ring-2 ring-red-400'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {t('nightActions.killPotion')}
          </button>
        </div>
      )}

      <p className="text-sm text-gray-400 mb-3">
        {isWitch
          ? witchAction === 'save'
            ? t('nightActions.chooseSave')
            : witchAction === 'kill'
              ? t('nightActions.chooseKill')
              : t('nightActions.choosePotion')
          : t('nightActions.chooseTarget', { verb: t(`nightActions.${actionConfig.verbKey}`).toLowerCase() })}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {players.map((player) => (
          <button
            key={player.id}
            onClick={() => setSelected(player.id)}
            className={`px-3 py-2 rounded-lg text-sm transition-all ${
              selected === player.id
                ? `${actionConfig.color} text-white`
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {player.name}
          </button>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={!selected || !witchAction && isWitch || submitting}
        className="btn-primary w-full flex items-center justify-center gap-2"
      >
        {actionConfig.icon}
        {submitting
          ? t('nightActions.submitting')
          : isWitch && witchAction
            ? `${witchAction === 'save' ? t('nightActions.save') : t('nightActions.kill')} ${players.find((p) => p.id === selected)?.name ?? ''}`
            : `${t(`nightActions.${actionConfig.verbKey}`)} ${players.find((p) => p.id === selected)?.name ?? ''}`}
      </button>
    </div>
  );
}
