import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    return (_jsx(ResponsiveContainer, { width: "100%", height: 400, children: _jsxs(BarChart, { data: data, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "name" }), _jsx(YAxis, {}), _jsx(Tooltip, {}), _jsx(Legend, {}), _jsx(Bar, { dataKey: "value", fill: "#8884d8", name: "N\u00FAmero de Colaboradores" })] }) }));
}
