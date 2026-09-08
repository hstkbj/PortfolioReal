import React, { useState } from 'react';
import { 
  FileText, 
  Upload, 
  Check, 
  Trash2, 
  ExternalLink, 
  AlertCircle
} from 'lucide-react';
import { useResumes } from '../../hooks/usePortfolio';
import { Button } from '../../components/common/Button';

export const AdminResumePage: React.FC = () => {
  const { 
    resumes = [], 
    createResume, 
    setActiveResume, 
    deleteResume 
  } = useResumes();

  const [title, setTitle] = useState('CV Développeur Fullstack 2025');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== 'application/pdf') {
        setErrorNotice('Seuls les fichiers PDF sont acceptés.');
        setSelectedFile(null);
        return;
      }
      setErrorNotice(null);
      setSelectedFile(file);
      if (!title) {
        setTitle(file.name.replace('.pdf', ''));
      }
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorNotice('Veuillez sélectionner un fichier PDF.');
      return;
    }

    setErrorNotice(null);
    setSuccessNotice(null);
    setIsUploading(true);

    try {
      // Read file to data URL for client storage/preview
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const fileDataUrl = reader.result as string;
          await createResume({
            title: title || selectedFile.name,
            file_name: selectedFile.name,
            file_url: fileDataUrl,
            file_size_kb: Math.round(selectedFile.size / 1024),
            is_active: true,
          });
          setSuccessNotice('Le CV a été téléversé avec succès et activé !');
          setSelectedFile(null);
          setTitle('CV Développeur Fullstack');
        } catch (err: any) {
          setErrorNotice(err.message || 'Erreur lors de l’enregistrement du CV.');
        } finally {
          setIsUploading(false);
        }
      };
      reader.onerror = () => {
        setErrorNotice('Erreur lors de la lecture du fichier PDF.');
        setIsUploading(false);
      };
      reader.readAsDataURL(selectedFile);
    } catch (err: any) {
      setErrorNotice(err.message || 'Erreur lors du téléversement.');
      setIsUploading(false);
    }
  };

  const handleSetActive = async (id: string) => {
    try {
      await setActiveResume(id);
      setSuccessNotice('Version active mise à jour !');
    } catch (err: any) {
      setErrorNotice(err.message || 'Erreur lors de l’activation.');
    }
  };

  const handleDelete = async (id: string, fileName: string) => {
    if (window.confirm(`Supprimer cette version du CV (${fileName}) ?`)) {
      try {
        await deleteResume(id);
      } catch (err: any) {
        setErrorNotice(err.message || 'Erreur lors de la suppression.');
      }
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-5xl">
      
      {/* Header */}
      <div className="pb-6 border-b border-zinc-200">
        <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block">
          Documents
        </span>
        <h1 className="text-2xl font-bold text-zinc-950 tracking-tight">
          Gestion du Curriculum Vitae (PDF)
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 mt-1">
          Téléversez votre CV au format PDF. Le document actif est directement servi sur le bouton « Télécharger mon CV » du site.
        </p>
      </div>

      {successNotice && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successNotice}</span>
        </div>
      )}

      {errorNotice && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorNotice}</span>
        </div>
      )}

      {/* Upload Box */}
      <div className="p-6 sm:p-8 rounded-2xl border border-zinc-200 bg-white shadow-2xs space-y-6">
        <h2 className="text-sm font-bold text-zinc-900 uppercase font-mono border-b border-zinc-100 pb-3 flex items-center gap-2">
          <Upload className="w-4 h-4 text-zinc-700" />
          <span>Téléverser une nouvelle version du CV</span>
        </h2>

        <form onSubmit={handleUpload} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-mono font-medium text-zinc-700 uppercase">
              Titre / Libellé de la version
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ex: CV Alexandre Renard - Lead Developer 2025"
              className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
            />
          </div>

          <div className="border-2 border-dashed border-zinc-200 rounded-xl p-6 text-center hover:border-zinc-400 transition-colors cursor-pointer bg-zinc-50/50">
            <input
              type="file"
              id="cv-upload-input"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            <label htmlFor="cv-upload-input" className="cursor-pointer block space-y-2">
              <FileText className="w-8 h-8 text-zinc-400 mx-auto" />
              <div className="text-xs sm:text-sm font-medium text-zinc-800">
                {selectedFile ? (
                  <span className="text-zinc-950 font-bold">{selectedFile.name} ({(selectedFile.size / 1024).toFixed(0)} Ko)</span>
                ) : (
                  <span>Cliquez pour parcourir ou glissez votre fichier PDF ici</span>
                )}
              </div>
              <p className="text-[11px] text-zinc-400 font-mono">
                Format PDF uniquement (max 10 Mo)
              </p>
            </label>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={!selectedFile}
              isLoading={isUploading}
              leftIcon={<Upload className="w-4 h-4" />}
            >
              Téléverser et activer cette version
            </Button>
          </div>
        </form>
      </div>

      {/* Existing CV Versions */}
      <div className="p-6 rounded-2xl border border-zinc-200 bg-white space-y-4">
        <h2 className="text-sm font-bold text-zinc-900 uppercase font-mono border-b border-zinc-100 pb-3">
          Historique des versions téléversées ({resumes.length})
        </h2>

        {resumes.length === 0 ? (
          <p className="text-xs text-zinc-400 font-mono py-4 text-center">
            Aucun CV n'a encore été téléversé.
          </p>
        ) : (
          <div className="space-y-3">
            {resumes.map((cv) => (
              <div
                key={cv.id}
                className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  cv.is_active
                    ? 'border-emerald-300 bg-emerald-50/30'
                    : 'border-zinc-200 bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-lg shrink-0 ${cv.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-zinc-100 text-zinc-600'}`}>
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-zinc-900">{cv.title}</span>
                      {cv.is_active && (
                        <span className="px-2 py-0.2 rounded-full text-[10px] font-mono font-medium bg-emerald-600 text-white">
                          Actif sur le site
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-500 font-mono mt-0.5">
                      {cv.file_name} • {(cv.file_size_kb || 0)} Ko • {new Date(cv.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    href={cv.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
                  >
                    Voir
                  </Button>

                  {!cv.is_active && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleSetActive(cv.id)}
                    >
                      Définir comme actif
                    </Button>
                  )}

                  <button
                    onClick={() => handleDelete(cv.id, cv.file_name)}
                    className="p-2 rounded-lg border border-zinc-200 hover:bg-red-50 text-zinc-400 hover:text-red-600 transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
