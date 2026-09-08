import React, { useState } from 'react';
import { 
  Search, 
  Trash2, 
  ExternalLink, 
  StickyNote
} from 'lucide-react';
import { useServiceRequests } from '../../hooks/usePortfolio';
import { ServiceRequest, ServiceRequestStatus } from '../../types';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';

export const AdminServiceRequestsPage: React.FC = () => {
  const { 
    data: requests = [], 
    updateServiceRequest, 
    deleteServiceRequest 
  } = useServiceRequests();

  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [notesInput, setNotesInput] = useState('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  const statuses: { label: string; value: ServiceRequestStatus | 'all' }[] = [
    { label: 'Toutes', value: 'all' },
    { label: 'Nouveau', value: 'nouveau' },
    { label: 'En cours', value: 'en-cours' },
    { label: 'Contacté', value: 'contacte' },
    { label: 'Devis envoyé', value: 'devis-envoye' },
    { label: 'Terminé', value: 'termine' },
    { label: 'Refusé', value: 'refuse' },
  ];

  const handleOpenDetail = (request: ServiceRequest) => {
    setSelectedRequest(request);
    setNotesInput(request.admin_notes || '');
    setIsDetailModalOpen(true);
  };

  const handleStatusChange = async (id: string, newStatus: ServiceRequestStatus) => {
    try {
      await updateServiceRequest({ id, updates: { status: newStatus } });
      if (selectedRequest && selectedRequest.id === id) {
        setSelectedRequest({ ...selectedRequest, status: newStatus });
      }
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la mise à jour du statut.');
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedRequest) return;
    setIsSavingNotes(true);
    try {
      await updateServiceRequest({ id: selectedRequest.id, updates: { admin_notes: notesInput } });
      setSelectedRequest({ ...selectedRequest, admin_notes: notesInput });
    } catch (err: any) {
      alert(err.message || 'Erreur lors de l’enregistrement de la note.');
    } finally {
      setIsSavingNotes(false);
    }
  };

  const handleDelete = async (id: string, clientName: string) => {
    if (window.confirm(`Supprimer définitivement la demande de « ${clientName} » ?`)) {
      try {
        await deleteServiceRequest(id);
        setIsDetailModalOpen(false);
      } catch (err: any) {
        alert(err.message || 'Erreur lors de la suppression.');
      }
    }
  };

  const filteredRequests = requests.filter(
    (r) => statusFilter === 'all' || r.status === statusFilter
  );

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
        <div>
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block">
            Prospects & Commandes
          </span>
          <h1 className="text-2xl font-bold text-zinc-950 tracking-tight">
            Demandes de service reçues ({requests.length})
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Consultez les cahiers des charges, budgets, et gérez le suivi de vos échanges clients.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {statuses.map((item) => (
          <button
            key={item.value}
            onClick={() => setStatusFilter(item.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              statusFilter === item.value
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Requests Table */}
      <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-zinc-50/80 border-b border-zinc-200 text-zinc-500 font-mono uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4 font-semibold">Client / Entreprise</th>
                <th className="py-3 px-4 font-semibold">Service demandé</th>
                <th className="py-3 px-4 font-semibold">Budget</th>
                <th className="py-3 px-4 font-semibold">Délai</th>
                <th className="py-3 px-4 font-semibold">Statut</th>
                <th className="py-3 px-4 font-semibold">Date</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-zinc-400 font-mono text-xs">
                    Aucune demande dans cette catégorie.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-zinc-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-bold text-zinc-900 block">{req.client_name}</span>
                      <span className="text-xs text-zinc-400 font-mono">
                        {req.company || req.email}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-medium text-zinc-800">
                      {req.service_title}
                    </td>

                    <td className="py-3 px-4 font-mono text-xs text-zinc-600">
                      {req.budget || 'Non spécifié'}
                    </td>

                    <td className="py-3 px-4 font-mono text-xs text-zinc-600">
                      {req.timeline || '—'}
                    </td>

                    <td className="py-3 px-4">
                      <select
                        value={req.status}
                        onChange={(e) => handleStatusChange(req.id, e.target.value as ServiceRequestStatus)}
                        className={`text-xs font-mono font-medium rounded-md px-2 py-1 border transition-colors cursor-pointer ${
                          req.status === 'nouveau' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                          req.status === 'en-cours' ? 'bg-purple-50 text-purple-800 border-purple-200' :
                          req.status === 'contacte' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                          req.status === 'devis-envoye' ? 'bg-cyan-50 text-cyan-800 border-cyan-200' :
                          req.status === 'termine' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                          'bg-zinc-100 text-zinc-600 border-zinc-200'
                        }`}
                      >
                        <option value="nouveau">Nouveau</option>
                        <option value="en-cours">En cours</option>
                        <option value="contacte">Contacté</option>
                        <option value="devis-envoye">Devis envoyé</option>
                        <option value="termine">Terminé</option>
                        <option value="refuse">Refusé</option>
                      </select>
                    </td>

                    <td className="py-3 px-4 font-mono text-xs text-zinc-400">
                      {new Date(req.created_at).toLocaleDateString('fr-FR')}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleOpenDetail(req)}
                        >
                          Détails
                        </Button>
                        <button
                          onClick={() => handleDelete(req.id, req.client_name)}
                          className="p-1.5 rounded hover:bg-red-50 text-zinc-400 hover:text-red-600"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedRequest && (
        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          title={`Demande de ${selectedRequest.client_name}`}
          description={`Reçue le ${new Date(selectedRequest.created_at).toLocaleString('fr-FR')}`}
          maxWidth="2xl"
        >
          <div className="space-y-6">
            {/* Status changer in modal */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 border border-zinc-200">
              <span className="text-xs font-mono font-medium text-zinc-700 uppercase">Statut actuel :</span>
              <select
                value={selectedRequest.status}
                onChange={(e) => handleStatusChange(selectedRequest.id, e.target.value as ServiceRequestStatus)}
                className="text-xs font-mono font-medium rounded px-2.5 py-1.5 border border-zinc-300 bg-white"
              >
                <option value="nouveau">Nouveau</option>
                <option value="en-cours">En cours</option>
                <option value="contacte">Contacté</option>
                <option value="devis-envoye">Devis envoyé</option>
                <option value="termine">Terminé (Accepté / Livré)</option>
                <option value="refuse">Refusé</option>
              </select>
            </div>

            {/* Contact details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl border border-zinc-200 bg-white text-xs">
              <div>
                <span className="text-zinc-400 font-mono block">CLIENT</span>
                <span className="font-bold text-zinc-900 text-sm">{selectedRequest.client_name}</span>
                {selectedRequest.company && (
                  <span className="block text-zinc-600">Entreprise : {selectedRequest.company}</span>
                )}
              </div>

              <div>
                <span className="text-zinc-400 font-mono block">COORDONNÉES</span>
                <a href={`mailto:${selectedRequest.email}`} className="font-medium text-blue-600 hover:underline block">
                  {selectedRequest.email}
                </a>
                {selectedRequest.phone && (
                  <a href={`tel:${selectedRequest.phone}`} className="text-zinc-700 hover:underline block mt-0.5">
                    {selectedRequest.phone}
                  </a>
                )}
                <span className="text-zinc-400 font-mono block mt-1">
                  Canal préféré : {selectedRequest.preferred_contact_method}
                </span>
              </div>
            </div>

            {/* Service & Budget Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200 text-xs">
                <span className="text-zinc-400 font-mono block">SERVICE</span>
                <span className="font-bold text-zinc-900">{selectedRequest.service_title}</span>
              </div>
              <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200 text-xs">
                <span className="text-zinc-400 font-mono block">BUDGET ESTIMÉ</span>
                <span className="font-bold text-zinc-900">{selectedRequest.budget || 'Non précisé'}</span>
              </div>
              <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200 text-xs">
                <span className="text-zinc-400 font-mono block">ÉCHÉANCE</span>
                <span className="font-bold text-zinc-900">{selectedRequest.timeline || 'Non précisée'}</span>
              </div>
            </div>

            {/* Description du besoin */}
            <div className="space-y-1.5">
              <span className="text-xs font-mono text-zinc-500 uppercase font-semibold">
                Description détaillée du besoin client :
              </span>
              <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 text-xs sm:text-sm text-zinc-800 leading-relaxed whitespace-pre-line">
                {selectedRequest.description}
              </div>
            </div>

            {/* Attachment if present */}
            {selectedRequest.attachment_url && (
              <div className="p-3 rounded-lg border border-zinc-200 bg-white flex items-center justify-between text-xs">
                <span className="font-mono text-zinc-600">Lien cahier des charges :</span>
                <a
                  href={selectedRequest.attachment_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-zinc-900 underline flex items-center gap-1 hover:text-zinc-600"
                >
                  <span>Consulter le document</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}

            {/* Internal Admin Notes */}
            <div className="space-y-2 pt-2 border-t border-zinc-200">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono font-bold text-zinc-900 uppercase flex items-center gap-1.5">
                  <StickyNote className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Notes internes (confidentiel administrateur)</span>
                </label>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleSaveNotes}
                  isLoading={isSavingNotes}
                >
                  Sauvegarder la note
                </Button>
              </div>
              <textarea
                rows={3}
                value={notesInput}
                onChange={(e) => setNotesInput(e.target.value)}
                placeholder="Ajouter des notes internes sur les échanges, la négociation ou le devis envoyé..."
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-zinc-200 flex items-center justify-between">
              <button
                onClick={() => handleDelete(selectedRequest.id, selectedRequest.client_name)}
                className="text-xs font-mono text-red-600 hover:underline flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Supprimer cette demande</span>
              </button>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsDetailModalOpen(false)}>
                  Fermer
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  href={`mailto:${selectedRequest.email}?subject=Suite à votre demande de service sur AlexandreRenard.dev`}
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
