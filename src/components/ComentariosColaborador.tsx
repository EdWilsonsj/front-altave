import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { MessageSquare, User, Calendar, Send, Plus } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

interface Comentario {
  idComentario: number;
  idColaboradorOrigem: number;
  idColaboradorDestino: number;
  textoComentario: string;
  dataComentario: string;
  nomeColaboradorOrigem?: string;
}

interface ComentariosColaboradorProps {
  colaboradorId: number;
  isAdmin?: boolean;
  currentUserId?: number;
}

const ComentariosColaborador: React.FC<ComentariosColaboradorProps> = ({ 
  colaboradorId, 
  isAdmin = false, 
  currentUserId 
}) => {
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [novoComentario, setNovoComentario] = useState('');
  const [sending, setSending] = useState(false);

  const loadComentarios = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/comentario/colaborador/${colaboradorId}`);
      if (response.ok) {
        const data = await response.json();
        // Buscar nomes dos colaboradores de origem
        const comentariosComNomes = await Promise.all(
          data.map(async (comentario: Comentario) => {
            try {
              const colaboradorResponse = await fetch(`${API_BASE_URL}/api/colaborador/${comentario.idColaboradorOrigem}`);
              if (colaboradorResponse.ok) {
                const colaboradorOrigem = await colaboradorResponse.json();
                return { ...comentario, nomeColaboradorOrigem: colaboradorOrigem.nome };
              }
            } catch (error) {
              console.error('Erro ao buscar colaborador:', error);
            }
            return { ...comentario, nomeColaboradorOrigem: 'Desconhecido' };
          })
        );
        setComentarios(comentariosComNomes);
      }
    } catch (error) {
      console.error('Erro ao carregar comentários:', error);
    } finally {
      setLoading(false);
    }
  }, [colaboradorId]);

  useEffect(() => {
    loadComentarios();
  }, [loadComentarios]);



  const handleSubmitComentario = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoComentario.trim() || !currentUserId) return;

    setSending(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/comentario/criar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idColaboradorOrigem: currentUserId,
          idColaboradorDestino: colaboradorId,
          textoComentario: novoComentario.trim(),
        }),
      });

      if (response.ok) {
        setNovoComentario('');
        setShowForm(false);
        loadComentarios(); // Recarregar comentários
        alert('Comentário adicionado com sucesso!');
      } else {
        alert('Erro ao adicionar comentário. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao criar comentário:', error);
      alert('Erro ao adicionar comentário. Verifique sua conexão.');
    } finally {
      setSending(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Carregando comentários...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Comentários de Gestores ({comentarios.length})
          </CardTitle>
          {isAdmin && currentUserId && (
            <Button
              onClick={() => setShowForm(!showForm)}
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              Adicionar Comentário
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Formulário para novo comentário */}
        {showForm && isAdmin && (
          <Card className="mb-4 border-blue-200 dark:border-blue-800">
            <CardContent className="p-4">
              <form onSubmit={handleSubmitComentario} className="space-y-4">
                <div>
                  <label htmlFor="comentario" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Novo Comentário:
                  </label>
                  <textarea
                    id="comentario"
                    value={novoComentario}
                    onChange={(e) => setNovoComentario(e.target.value)}
                    placeholder="Digite seu comentário sobre este colaborador..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                    rows={3}
                    maxLength={500}
                    required
                  />
                  <div className="text-right text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {novoComentario.length}/500
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={sending || !novoComentario.trim()}
                    className="flex items-center gap-1"
                  >
                    <Send className="h-4 w-4" />
                    {sending ? 'Enviando...' : 'Enviar Comentário'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForm(false);
                      setNovoComentario('');
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Lista de comentários */}
        {comentarios.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-300">
            <MessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
            <p className="text-lg font-medium text-gray-700 dark:text-white">Nenhum comentário ainda</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Este colaborador ainda não recebeu comentários de gestores.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {comentarios.map((comentario) => (
              <Card key={comentario.idComentario} className="border-l-4 border-l-blue-500 dark:border-l-blue-400">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      <span className="font-medium text-gray-900 dark:text-white">
                        {comentario.nomeColaboradorOrigem || 'Gestor'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-300">
                      <Calendar className="h-4 w-4" />
                      {formatDate(comentario.dataComentario)}
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-white leading-relaxed">
                    {comentario.textoComentario}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ComentariosColaborador;
