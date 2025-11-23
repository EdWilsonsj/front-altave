import { useAuth } from '../contexts/AuthContext';
import QuestionarioDISC from '../components/QuestionarioDISC';
import { useNavigate } from 'react-router-dom';

export default function PaginaQuestionarioDISC() {
  const { usuario } = useAuth();
  const navigate = useNavigate();

  if (!usuario) {
    navigate('/login');
    return null;
  }

  const handleComplete = () => {
    // Callback quando o questionário for completado
    console.log('Questionário DISC completado');
  };

  return (
    <QuestionarioDISC 
      usuarioId={usuario.id} 
      onComplete={handleComplete}
    />
  );
}
