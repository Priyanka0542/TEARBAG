import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart as BarChartIcon, Flame, BookOpen, Sparkles, Loader2, AlertCircle, X } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { api } from '../lib/api';

const COLORS = ['#FCD34D', '#F472B6', '#60A5FA', '#34D399', '#A78BFA', '#F87171', '#38BDF8'];

export const Analytics = () => {
  const [stats, setStats] = useState<any>(null);
  const [summary, setSummary] = useState<string>('');
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await api.get('/entries/analytics');
        setStats(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load analytics.');
      } finally {
        setLoadingStats(false);
      }
    };
    fetchAnalytics();
  }, []);

  const generateSummary = async () => {
    setLoadingSummary(true);
    setError('');
    try {
      const { data } = await api.post('/entries/analytics/summary');
      setSummary(data.summary);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to generate weekly summary. The AI might be busy — try again in a moment.');
    } finally {
      setLoadingSummary(false);
    }
  };

  if (loadingStats) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        <p className="text-muted-foreground text-sm">Loading your insights...</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", duration: 0.8, bounce: 0.3 }}
      className="max-w-5xl mx-auto py-8 relative"
    >
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-pink-500/10 rounded-full blur-[120px] -z-10 pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] -z-10 pointer-events-none mix-blend-screen" />

      <h1 className="text-4xl md:text-5xl font-heading font-medium flex items-center gap-4 mb-10 anime-title">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
          <BarChartIcon className="w-7 h-7 text-primary" />
        </div>
        Emotional Insights
      </h1>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-6"
          >
            <div className="p-4 rounded-2xl bg-red-500/10 backdrop-blur-md text-red-400 text-sm border border-red-500/20 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              {error}
              <button onClick={() => setError('')} className="ml-auto text-red-400/60 hover:text-red-400 cursor-pointer" aria-label="Dismiss error">
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Streak Card */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="glass holo-card p-8 min-h-[16rem] rounded-3xl flex flex-col items-center text-center justify-center border-emerald-500/20 shadow-[0_0_40px_-15px_rgba(16,185,129,0.15)]"
        >
          <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mb-4">
            <Flame className="w-8 h-8 text-orange-500" />
          </div>
          <p className="text-muted-foreground font-medium mb-1">Current Streak</p>
          <h2 className="text-4xl font-heading font-bold text-foreground">
            {stats?.streak ?? 0} <span className="text-xl text-muted-foreground font-medium">days</span>
          </h2>
        </motion.div>

        {/* Total Entries Card */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="glass holo-card p-8 min-h-[16rem] rounded-3xl flex flex-col items-center text-center justify-center border-blue-500/20 shadow-[0_0_40px_-15px_rgba(59,130,246,0.15)]"
        >
          <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-blue-500" />
          </div>
          <p className="text-muted-foreground font-medium mb-1">Total Memories</p>
          <h2 className="text-4xl font-heading font-bold text-foreground">
            {stats?.totalEntries ?? 0}
          </h2>
        </motion.div>

        {/* AI Generator CTA Card */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="glass holo-card p-8 min-h-[16rem] rounded-3xl flex flex-col items-center text-center justify-center border-primary/20 shadow-[0_0_40px_-15px_rgba(124,58,237,0.15)] relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-50" />
          <Sparkles className="w-8 h-8 text-primary mb-4 relative z-10" />
          <p className="text-muted-foreground font-medium mb-4 relative z-10 text-sm">Analyze your emotional growth over the past week.</p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={generateSummary}
            disabled={loadingSummary}
            className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-medium shadow-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2 relative z-10 cursor-pointer disabled:opacity-60"
          >
            {loadingSummary ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {loadingSummary ? 'Generating...' : 'Generate Summary'}
          </motion.button>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mood Distribution Chart */}
        <div className="glass holo-card p-8 rounded-3xl flex flex-col min-h-[24rem]">
          <h3 className="text-xl font-heading font-semibold mb-6 text-foreground">Mood Distribution</h3>
          {stats?.moodData?.length > 0 ? (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.moodData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {stats.moodData.map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', background: 'rgba(20, 20, 20, 0.9)', color: '#fff', backdropFilter: 'blur(10px)' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[300px] flex flex-col items-center justify-center text-muted-foreground gap-3">
              <BarChartIcon className="w-12 h-12 opacity-20" />
              <p>Not enough mood data yet. Log some memories with moods!</p>
            </div>
          )}
        </div>

        {/* AI Summary Result */}
        <div className="glass holo-card p-8 rounded-3xl flex flex-col bg-primary/5 border-primary/20 min-h-[24rem]">
          <div className="flex items-center gap-3 mb-6 border-b border-primary/10 pb-4">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-xl font-heading font-semibold text-primary">Weekly AI Summary</h3>
          </div>
          
          <div className="flex-1 mt-2">
            {loadingSummary ? (
              <div className="h-full flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <p className="text-muted-foreground text-sm">AI is analyzing your emotional journey...</p>
              </div>
            ) : summary ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-foreground/80 leading-relaxed space-y-4 font-light"
              >
                {summary.split('\n\n').map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground opacity-60">
                <Sparkles className="w-12 h-12 mb-4 opacity-50" />
                <p>Click "Generate Summary" above to have your AI companion analyze your week.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
