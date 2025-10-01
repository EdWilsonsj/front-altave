import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock data - substituir com dados da API
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
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#8884d8" name="Número de Colaboradores" />
      </BarChart>
    </ResponsiveContainer>
  );
}
