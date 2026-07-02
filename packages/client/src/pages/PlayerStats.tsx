import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getPlayerStats, type PlayerStatsData } from '../lib/api';
import { ArrowLeft, Skull, Heart, Target, Award, Calendar } from 'lucide-react';

export function PlayerStats() {
  const { t } = useTranslation();
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const [stats, setStats] = useState<PlayerStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!name) return;
    setLoading(true);
    getPlayerStats(name)
      .then(data => { setStats(data); setError(null); })
      .catch(() => setError(t('playerStats.notFound')))
      .finally(() => setLoading(false));
  }, [name, t]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="card p-8 text-center">
        <p className="text-red-400">{error || t('playerStats.notFound')}</p>
        <button onClick={() => navigate('/leaderboard')} className="btn-secondary mt-4">
          {t('playerStats.backToLeaderboard')}
        </button>
      </div>
    );
  }

  const roleEntries = Object.entries(stats.roleStats);

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{stats.name}</h1>
          <p className="text-gray-400 text-sm mt-1">{t('playerStats.playerStatistics')}</p>
        </div>
        <button onClick={() => navigate('/leaderboard')} className="btn-secondary flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> {t('playerStats.back')}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4 text-center">
          <Award className="w-5 h-5 text-green-400 mx-auto mb-2" />
          <p className="text-2xl font-bold">{stats.winRate}%</p>
          <p className="text-xs text-gray-500">{t('playerStats.winRate', { wins: stats.totalWins, total: stats.totalGames })}</p>
        </div>
        <div className="card p-4 text-center">
          <Target className="w-5 h-5 text-red-400 mx-auto mb-2" />
          <p className="text-2xl font-bold">{stats.totalKills}</p>
          <p className="text-xs text-gray-500">{t('playerStats.totalKills')}</p>
        </div>
        <div className="card p-4 text-center">
          <Heart className="w-5 h-5 text-red-400 mx-auto mb-2" />
          <p className="text-2xl font-bold">{stats.survivalRate}%</p>
          <p className="text-xs text-gray-500">{t('playerStats.survivalRate', { survived: stats.totalSurvived, total: stats.totalGames })}</p>
        </div>
        <div className="card p-4 text-center">
          <Calendar className="w-5 h-5 text-yellow-400 mx-auto mb-2" />
          <p className="text-2xl font-bold">{stats.totalGames}</p>
          <p className="text-xs text-gray-500">{t('playerStats.gamesPlayed')}</p>
        </div>
      </div>

      {roleEntries.length > 0 && (
        <div className="card p-5">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Skull className="w-4 h-4 text-gray-400" />
            {t('playerStats.roleStatistics')}
          </h2>
          <div className="space-y-3">
            {roleEntries.map(([role, roleStat]) => (
              <div key={role} className="flex items-center justify-between">
                <span className="text-sm capitalize">{role.replace('_', ' ')}</span>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-400">{t('playerStats.games', { count: roleStat.games })}</span>
                  <span className="text-green-400">{roleStat.wins}W</span>
                  <span className="text-red-400">{roleStat.games - roleStat.wins}L</span>
                  <div className="w-24 h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${roleStat.games > 0 ? (roleStat.wins / roleStat.games) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {stats.recentGames.length > 0 && (
        <div className="card p-5">
          <h2 className="text-lg font-bold mb-4">{t('playerStats.recentGames')}</h2>
          <div className="space-y-2">
            {stats.recentGames.map((game, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm py-1.5 border-b border-gray-800 last:border-0">
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full ${game.survived ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="capitalize">{game.role.replace('_', ' ')}</span>
                  <span className="text-gray-500">({game.team})</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs ${game.team === game.winner ? 'text-green-400' : 'text-red-400'}`}>
                    {game.team === game.winner ? t('playerStats.won') : t('playerStats.lost')}
                  </span>
                  <span className="text-gray-500">{t('playerStats.day', { count: game.dayCount })}</span>
                  <span className="text-gray-500 text-xs">
                    {new Date(game.startedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
