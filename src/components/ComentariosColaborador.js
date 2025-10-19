import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { MessageSquare, User, Calendar, Send, Plus } from 'lucide-react';
const API_BASE_URL = import.meta.env.VITE_API_URL || '';
const ComentariosColaborador = ({ colaboradorId, isAdmin = false, currentUserId }) => {
    const [comentarios, setComentarios] = useState([]);
    const [colaboradores, setColaboradores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [novoComentario, setNovoComentario] = useState('');
    const [sending, setSending] = useState(false);
    useEffect(() => {
        loadComentarios();
        if (isAdmin) {
            loadColaboradores();
        }
    }, [colaboradorId]);
    const loadComentarios = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/comentario/colaborador/${colaboradorId}`);
            if (response.ok) {
                const data = await response.json();
                // Buscar nomes dos colaboradores de origem
                const comentariosComNomes = await Promise.all(data.map(async (comentario) => {
                    try {
                        const colaboradorResponse = await fetch(`${API_BASE_URL}/api/colaborador/${comentario.idColaboradorOrigem}`);
                        if (colaboradorResponse.ok) {
                            const colaboradorOrigem = await colaboradorResponse.json();
                            return { ...comentario, nomeColaboradorOrigem: colaboradorOrigem.nome };
                        }
                    }
                    catch (error) {
                        console.error('Erro ao buscar colaborador:', error);
                    }
                    return { ...comentario, nomeColaboradorOrigem: 'Desconhecido' };
                }));
                setComentarios(comentariosComNomes);
            }
        }
        catch (error) {
            console.error('Erro ao carregar comentários:', error);
        }
        finally {
            setLoading(false);
        }
    };
    const loadColaboradores = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/colaborador`);
            if (response.ok) {
                const data = await response.json();
                setColaboradores(data);
            }
        }
        catch (error) {
            console.error('Erro ao carregar colaboradores:', error);
        }
    };
    const handleSubmitComentario = async (e) => {
        e.preventDefault();
        if (!novoComentario.trim() || !currentUserId)
            return;
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
            }
            else {
                alert('Erro ao adicionar comentário. Tente novamente.');
            }
        }
        catch (error) {
            console.error('Erro ao criar comentário:', error);
            alert('Erro ao adicionar comentário. Verifique sua conexão.');
        }
        finally {
            setSending(false);
        }
    };
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };
    if (loading) {
        return (_jsx(Card, { children: _jsx(CardContent, { className: "p-6", children: _jsxs("div", { className: "flex items-center justify-center", children: [_jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" }), _jsx("span", { className: "ml-2", children: "Carregando coment\u00E1rios..." })] }) }) }));
    }
    return (_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(MessageSquare, { className: "h-5 w-5 text-blue-600 dark:text-blue-400" }), "Coment\u00E1rios de Gestores (", comentarios.length, ")"] }), isAdmin && currentUserId && (_jsxs(Button, { onClick: () => setShowForm(!showForm), variant: "outline", size: "sm", className: "flex items-center gap-1", children: [_jsx(Plus, { className: "h-4 w-4" }), "Adicionar Coment\u00E1rio"] }))] }) }), _jsxs(CardContent, { children: [showForm && isAdmin && (_jsx(Card, { className: "mb-4 border-blue-200 dark:border-blue-800", children: _jsx(CardContent, { className: "p-4", children: _jsxs("form", { onSubmit: handleSubmitComentario, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "comentario", className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Novo Coment\u00E1rio:" }), _jsx("textarea", { id: "comentario", value: novoComentario, onChange: (e) => setNovoComentario(e.target.value), placeholder: "Digite seu coment\u00E1rio sobre este colaborador...", className: "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400", rows: 3, maxLength: 500, required: true }), _jsxs("div", { className: "text-right text-sm text-gray-500 dark:text-gray-400 mt-1", children: [novoComentario.length, "/500"] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsxs(Button, { type: "submit", disabled: sending || !novoComentario.trim(), className: "flex items-center gap-1", children: [_jsx(Send, { className: "h-4 w-4" }), sending ? 'Enviando...' : 'Enviar Comentário'] }), _jsx(Button, { type: "button", variant: "outline", onClick: () => {
                                                    setShowForm(false);
                                                    setNovoComentario('');
                                                }, children: "Cancelar" })] })] }) }) })), comentarios.length === 0 ? (_jsxs("div", { className: "text-center py-8 text-gray-500 dark:text-gray-300", children: [_jsx(MessageSquare, { className: "h-12 w-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" }), _jsx("p", { className: "text-lg font-medium text-gray-700 dark:text-white", children: "Nenhum coment\u00E1rio ainda" }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-300", children: "Este colaborador ainda n\u00E3o recebeu coment\u00E1rios de gestores." })] })) : (_jsx("div", { className: "space-y-4", children: comentarios.map((comentario) => (_jsx(Card, { className: "border-l-4 border-l-blue-500 dark:border-l-blue-400", children: _jsxs(CardContent, { className: "p-4", children: [_jsxs("div", { className: "flex items-start justify-between mb-3", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(User, { className: "h-4 w-4 text-gray-500 dark:text-gray-400" }), _jsx("span", { className: "font-medium text-gray-900 dark:text-white", children: comentario.nomeColaboradorOrigem || 'Gestor' })] }), _jsxs("div", { className: "flex items-center gap-1 text-sm text-gray-500 dark:text-gray-300", children: [_jsx(Calendar, { className: "h-4 w-4" }), formatDate(comentario.dataComentario)] })] }), _jsx("p", { className: "text-gray-700 dark:text-white leading-relaxed", children: comentario.textoComentario })] }) }, comentario.idComentario))) }))] })] }));
};
export default ComentariosColaborador;
