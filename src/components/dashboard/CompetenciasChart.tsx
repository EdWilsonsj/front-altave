import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Mock data - substituir com dados reais
const data = [
  { name: 'React', value: 10 },
  { name: 'Java', value: 8 },
  { name: 'Spring Boot', value: 7 },
  { name: 'SQL', value: 9 },
  { name: 'Docker', value: 6 },
  { name: 'Kubernetes', value: 5 },
  { name: 'GCP', value: 4 },
  { name: 'Terraform', value: 3 },
  { name: 'Ansible', value: 2 },
  { name: 'Python', value: 1 },
];

export default function CompetenciasChart() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const check = () =>
      setIsDark(document.documentElement.classList.contains('dark'));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  // cores ajustadas
  const gridStroke = isDark ? '#ffffff' : '#e5e7eb';        // pontilhado branco no dark
  const axisTick   = isDark ? '#ffffff' : '#374151';        // texto branco no dark
  const axisLine   = isDark ? '#ffffff' : '#9ca3af';        // eixos brancos no dark
  const legendCol  = isDark ? '#ffffff' : '#111827';        // legenda branca no dark
  const tipBg      = isDark ? '#111827' : '#ffffff';        // tooltip escuro no dark
  const tipBorder  = isDark ? '#374151' : '#e5e7eb';
  const tipText    = isDark ? '#ffffff' : '#111827';
  const cursorFill = isDark ? 'rgba(101, 65, 192, 0.53)' : 'rgba(141, 143, 150, 0.6)'; // hover vermelho no dark

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data} key={isDark ? 'dark' : 'light'}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
        <XAxis
          dataKey="name"
          tick={{ fill: axisTick }}
          stroke={axisLine}
        />
        <YAxis
          tick={{ fill: axisTick }}
          stroke={axisLine}
        />
        <Tooltip
          cursor={{ fill: cursorFill }}
          contentStyle={{ backgroundColor: tipBg, borderColor: tipBorder, color: tipText }}
          itemStyle={{ color: tipText }}
          labelStyle={{ color: tipText }}
          wrapperStyle={{ outline: 'none' }}
        />
        <Legend
          wrapperStyle={{ color: legendCol }}
          formatter={(value) => <span style={{ color: legendCol }}>{value}</span>}
        />
        <Bar
          dataKey="value"
          fill="#8b5cf6"
          name="Número de Colaboradores"
          isAnimationActive={false}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
