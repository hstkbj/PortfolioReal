import React, { useState } from 'react';
import { 
  MessageSquare, 
  Trash2, 
  Check, 
  Mail, 
  Clock, 
  MailCheck, 
  MailQuestion, 
  Reply 
} from 'lucide-react';
import { useContactMessages } from '../../hooks/usePortfolio';
import { ContactMessage } from '../../types';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';

export const AdminMessagesPage: React.FC = () => {
  const { 
    data: messages = [], 
    updateContactMessage, 
    deleteContactMessage 
  } = useContactMessages();

  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  const handleOpenMessage = async (msg: ContactMessage) => {
    setSelectedMessage(msg);
    setIsModalOpen(true);
    if (!msg.is_read) {
      await updateContactMessage({ id: msg.id, updates: { is_read: true } });
    }
  };

  const handleToggleRead = async (id: string, currentRead: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    await updateContactMessage({ id, updates: { is_read: !currentRead } });
  };

  const handleDelete = async (id: string, senderName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Supprimer le message de « ${senderName} » ?`)) {
      await deleteContactMessage(id);
      if (selectedMessage?.id === id) {
        setIsModalOpen(false);
      }
    }
  };

  const filteredMessages = messages.filter((m) => {
    if (filter === 'unread') return !m.is_read;
    if (filter === 'read') return m.is_read;
    return true;
  });

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-6xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
        <div>
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block">
            Boîte de réception
          </span>
          <h1 className="text-2xl font-bold text-zinc-950 tracking-tight">
            Messages reçus ({messages.length})
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Tous les messages envoyés depuis le formulaire de contact du site.
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === 'all'
                ? 'bg-zinc-900 text-white'
                : 'bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200'
            }`}
          >
            Tous ({messages.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === 'unread'
                ? 'bg-zinc-900 text-white'
                : 'bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200'
            }`}
          >
            Non lus ({messages.filter(m => !m.is_read).length})
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === 'read'
                ? 'bg-zinc-900 text-white'
                : 'bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200'
            }`}
          >
            Lus
          </button>
        </div>
      </div>

      {/* Messages list */}
      <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-2xs divide-y divide-zinc-100">
        {filteredMessages.length === 0 ? (
          <div className="py-12 text-center text-xs text-zinc-400 font-mono">
            Aucun message à afficher.
          </div>
        ) : (
          filteredMessages.map((msg) => (
            <div
              key={msg.id}
              onClick={() => handleOpenMessage(msg)}
              className={`p-4 sm:p-5 flex items-start justify-between gap-4 cursor-pointer hover:bg-zinc-50/80 transition-colors ${
                !msg.is_read ? 'bg-zinc-50/60 font-semibold' : 'bg-white font-normal'
              }`}
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${!msg.is_read ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-500'}`}>
                  <Mail className="w-4 h-4" />
                </div>
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm text-zinc-900 font-bold">{msg.name}</span>
                    <span className="text-xs font-mono text-zinc-400">({msg.email})</span>
                    {!msg.is_read && (
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-zinc-900 text-white font-bold">
                        Nouveau
                      </span>
                    )}
                  </div>
                  <h3 className="text-xs sm:text-sm text-zinc-800 truncate">
                    {msg.subject}
                  </h3>
                  <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                    {msg.message}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-center">
                <span className="text-[11px] font-mono text-zinc-400 hidden sm:inline-block">
                  {new Date(msg.created_at).toLocaleDateString('fr-FR')}
                </span>
                <button
                  onClick={(e) => handleToggleRead(msg.id, msg.is_read, e)}
                  className="p-1.5 rounded hover:bg-zinc-200/60 text-zinc-500"
                  title={msg.is_read ? 'Marquer comme non lu' : 'Marquer comme lu'}
                >
                  {msg.is_read ? <MailQuestion className="w-4 h-4" /> : <MailCheck className="w-4 h-4" />}
                </button>
                <button
                  onClick={(e) => handleDelete(msg.id, msg.name, e)}
                  className="p-1.5 rounded hover:bg-red-50 text-zinc-400 hover:text-red-600"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Message detail modal */}
      {selectedMessage && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={selectedMessage.subject}
          description={`De ${selectedMessage.name} (${selectedMessage.email}) • ${new Date(selectedMessage.created_at).toLocaleString('fr-FR')}`}
          maxWidth="lg"
        >
          <div className="space-y-6">
            <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/70 space-y-2 text-xs">
              <div className="flex justify-between text-zinc-600">
                <span className="font-mono">Expéditeur :</span>
                <strong className="text-zinc-900">{selectedMessage.name}</strong>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span className="font-mono">Email :</span>
                <a href={`mailto:${selectedMessage.email}`} className="text-blue-600 underline">
                  {selectedMessage.email}
                </a>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span className="font-mono">Date de réception :</span>
                <span>{new Date(selectedMessage.created_at).toLocaleString('fr-FR')}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-mono text-zinc-400 uppercase">Corps du message :</span>
              <div className="p-4 rounded-xl border border-zinc-200 bg-white text-sm text-zinc-800 leading-relaxed whitespace-pre-line">
                {selectedMessage.message}
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
              <button
                onClick={(e) => handleDelete(selectedMessage.id, selectedMessage.name, e)}
                className="text-xs font-mono text-red-600 hover:underline"
              >
                Supprimer ce message
              </button>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                  Fermer
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`}
                  leftIcon={<Reply className="w-4 h-4" />}
                >
                  Répondre par email
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};
