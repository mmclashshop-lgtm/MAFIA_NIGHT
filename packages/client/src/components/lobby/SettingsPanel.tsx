import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { GameSettings } from '@mafia/shared';
import { Settings, Clock, Users, Shield, Eye, Mic, MessageCircle } from 'lucide-react';

interface SettingsPanelProps {
  settings: GameSettings;
  onUpdate: (settings: Partial<GameSettings>) => Promise<void>;
}

export function SettingsPanel({ settings, onUpdate }: SettingsPanelProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleChange = async (key: keyof GameSettings, value: unknown) => {
    setSaving(true);
    try {
      await onUpdate({ [key]: value });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <button onClick={() => setOpen(!open)} className="btn-secondary flex items-center gap-2 text-sm">
        <Settings className="w-4 h-4" />
        {t('settingsPanel.button')}
      </button>

      {open && (
        <div className="card p-4 mt-3 space-y-4 animate-fade-in">
          <h3 className="text-sm font-semibold text-gray-300">{t('settingsPanel.title')}</h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-400 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5" /> {t('settingsPanel.night')}
              </label>
              <input
                type="number"
                min={10}
                max={120}
                value={settings.nightDuration}
                onChange={e => handleChange('nightDuration', parseInt(e.target.value) || 30)}
                className="input-field w-20 text-center text-sm"
                disabled={saving}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-400 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5" /> {t('settingsPanel.day')}
              </label>
              <input
                type="number"
                min={15}
                max={300}
                value={settings.dayDuration}
                onChange={e => handleChange('dayDuration', parseInt(e.target.value) || 60)}
                className="input-field w-20 text-center text-sm"
                disabled={saving}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-400 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5" /> {t('settingsPanel.voting')}
              </label>
              <input
                type="number"
                min={10}
                max={120}
                value={settings.votingDuration}
                onChange={e => handleChange('votingDuration', parseInt(e.target.value) || 30)}
                className="input-field w-20 text-center text-sm"
                disabled={saving}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-400 flex items-center gap-2">
                <Shield className="w-3.5 h-3.5" /> {t('settingsPanel.rolePreset')}
              </label>
              <select
                value={settings.rolePreset}
                onChange={e => handleChange('rolePreset', e.target.value)}
                className="input-field w-28 text-sm"
                disabled={saving}
              >
                <option value="classic">{t('settingsPanel.classic')}</option>
                <option value="advanced">{t('settingsPanel.advanced')}</option>
                <option value="chaos">{t('settingsPanel.chaos')}</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-400 flex items-center gap-2">
                <Users className="w-3.5 h-3.5" /> {t('settingsPanel.maxPlayers')}
              </label>
              <input
                type="number"
                min={4}
                max={12}
                value={settings.maxPlayers}
                onChange={e => handleChange('maxPlayers', parseInt(e.target.value) || 12)}
                className="input-field w-20 text-center text-sm"
                disabled={saving}
              />
            </div>

            <div className="border-t border-gray-800 pt-3 space-y-2">
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-400 flex items-center gap-2">
                  <Eye className="w-3.5 h-3.5" /> {t('settingsPanel.spectators')}
                </span>
                <input
                  type="checkbox"
                  checked={settings.allowSpectators}
                  onChange={e => handleChange('allowSpectators', e.target.checked)}
                  className="toggle"
                  disabled={saving}
                />
              </label>

              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-400 flex items-center gap-2">
                  <Mic className="w-3.5 h-3.5" /> {t('settingsPanel.voiceChat')}
                </span>
                <input
                  type="checkbox"
                  checked={settings.enableVoiceChat}
                  onChange={e => handleChange('enableVoiceChat', e.target.checked)}
                  className="toggle"
                  disabled={saving}
                />
              </label>

              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-400 flex items-center gap-2">
                  <MessageCircle className="w-3.5 h-3.5" /> {t('settingsPanel.textChat')}
                </span>
                <input
                  type="checkbox"
                  checked={settings.enableTextChat}
                  onChange={e => handleChange('enableTextChat', e.target.checked)}
                  className="toggle"
                  disabled={saving}
                />
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
