import React, { useEffect, useRef, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { CharacterCount, Placeholder } from '@tiptap/extensions';
import { TextAlign } from '@tiptap/extension-text-align';
import { Color, FontFamily, FontSize, TextStyle } from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import { Table, TableRow } from '@tiptap/extension-table';
import { ResizableImage, CellWithBg, HeaderWithBg, cleanWordHtml } from './richEditorExtensions';
import './RichTextEditor.css';
import { Bold, Italic, Underline, Strikethrough, List, ListOrdered, Quote, Undo2, Redo2, Link as LinkIcon, Image as ImageIcon, Table as TableIcon, Eraser, Minus, AlignLeft, AlignCenter, AlignRight, AlignJustify, Subscript as SubscriptIcon, Superscript as SuperscriptIcon, FileText } from 'lucide-react';

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  className?: string;
};

const fonts = ['Arial', 'Calibri', 'Cambria', 'Courier New', 'Georgia', 'Tahoma', 'Times New Roman', 'Trebuchet MS', 'Verdana'];
const sizes = [10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 64];

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, placeholder = 'Écrivez ici…', minHeight = '260px', className = '' }) => {
  const imageInput = useRef<HTMLInputElement>(null);
  const docxInput = useRef<HTMLInputElement>(null);
  const [urlKind, setUrlKind] = useState<'link' | 'image' | null>(null);
  const [urlValue, setUrlValue] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3, 4] }, link: { openOnClick: false, HTMLAttributes: { rel: 'noopener noreferrer nofollow', target: '_blank' } } }),
      Placeholder.configure({ placeholder }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }), TextStyle, Color, FontFamily, FontSize,
      Highlight.configure({ multicolor: true }), Subscript, Superscript, ResizableImage.configure({ allowBase64: true }),
      Table.configure({ resizable: true }), TableRow, HeaderWithBg, CellWithBg, CharacterCount,
    ],
    content: value,
    editorProps: {
      transformPastedHTML: cleanWordHtml,
      handlePaste: (_view, event) => {
        const clipboard = event.clipboardData;
        if (!clipboard || clipboard.getData('text/html')) return false;
        const files = [...clipboard.files].filter((file) => file.type.startsWith('image/'));
        if (!files.length) return false;
        event.preventDefault();
        files.forEach((file) => void insertImage(file));
        return true;
      },
      handleDrop: (view, event, _slice, moved) => {
        if (moved) return false;
        const files = [...(event.dataTransfer?.files || [])].filter((file) => file.type.startsWith('image/'));
        if (!files.length) return false;
        event.preventDefault();
        const position = view.posAtCoords({ left: event.clientX, top: event.clientY });
        if (position) editor.commands.setTextSelection(position.pos);
        files.forEach((file) => void insertImage(file));
        return true;
      },
    },
    onUpdate: ({ editor: current }) => onChange(current.isEmpty ? '' : current.getHTML()),
  });

  useEffect(() => {
    if (editor && value !== (editor.isEmpty ? '' : editor.getHTML())) {
      editor.commands.setContent(value || '', { emitUpdate: false });
    }
  }, [editor, value]);

  if (!editor) return null;
  const chain = () => editor.chain().focus();
  const button = (label: string, Icon: React.ElementType, run: () => void, active = false, disabled = false) => (
    <button type="button" title={label} aria-label={label} disabled={disabled} onMouseDown={(event) => event.preventDefault()} onClick={run} className={`rounded p-1.5 transition-colors ${active ? 'bg-zinc-200 text-zinc-950' : 'text-zinc-600 hover:bg-zinc-100'} disabled:opacity-40`}>
      <Icon className="h-4 w-4" />
    </button>
  );
  const normalizeUrl = (url: string) => (/^(https?:|mailto:|tel:|\/|#)/i.test(url) ? url : `https://${url}`);
  async function insertImage(file: File) {
    if (!file.type.startsWith('image/')) return;
    setBusy(true); setNotice('');
    try {
      const src = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => typeof reader.result === 'string' ? resolve(reader.result) : reject(new Error('Image illisible'));
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
      });
      editor.chain().focus().setImage({ src, alt: file.name.replace(/\.[^.]+$/, '') }).run();
    } catch {
      setNotice("Impossible d’insérer cette image.");
    } finally {
      setBusy(false);
    }
  }
  async function importDocx(file?: File) {
    if (!file) return;
    setBusy(true); setNotice('');
    try {
      const mammoth = await import('mammoth/mammoth.browser');
      const result = await mammoth.convertToHtml({ arrayBuffer: await file.arrayBuffer() });
      chain().insertContent(result.value).run();
    } catch {
      setNotice("Impossible d’importer ce fichier Word.");
    } finally {
      setBusy(false);
      if (docxInput.current) docxInput.current.value = '';
    }
  }
  function applyUrl() {
    const url = urlValue.trim();
    if (!url) { setUrlKind(null); return; }
    const href = normalizeUrl(url);
    if (urlKind === 'link') {
      if (editor.state.selection.empty && !editor.isActive('link')) {
        chain().insertContent({ type: 'text', text: href, marks: [{ type: 'link', attrs: { href } }] }).run();
      } else chain().extendMarkRange('link').setLink({ href }).run();
    } else chain().setImage({ src: href }).run();
    setUrlKind(null);
  }

  return (
    <div className={`rich-editor ${className}`}>
      <div className="flex flex-wrap items-center gap-1 border-b border-zinc-200 bg-zinc-50 p-2">
        <select aria-label="Style de texte" className="rounded border border-zinc-200 bg-white px-2 py-1 text-xs" value={[1, 2, 3, 4].find((level) => editor.isActive('heading', { level })) ?? 0} onChange={(event) => Number(event.target.value) ? chain().setHeading({ level: Number(event.target.value) as 1 | 2 | 3 | 4 }).run() : chain().setParagraph().run()}>
          <option value={0}>Paragraphe</option><option value={3}>Titre de section</option><option value={4}>Sous-titre</option>
        </select>
        <select aria-label="Police" className="rounded border border-zinc-200 bg-white px-2 py-1 text-xs" value={editor.getAttributes('textStyle').fontFamily || ''} onChange={(event) => event.target.value ? chain().setFontFamily(event.target.value).run() : chain().unsetFontFamily().run()}>
          <option value="">Police</option>{fonts.map((font) => <option key={font} value={font}>{font}</option>)}
        </select>
        <select aria-label="Taille de police" className="rounded border border-zinc-200 bg-white px-2 py-1 text-xs" value={editor.getAttributes('textStyle').fontSize || ''} onChange={(event) => event.target.value ? chain().setFontSize(event.target.value).run() : chain().unsetFontSize().run()}>
          <option value="">Taille</option>{sizes.map((size) => <option key={size} value={`${size}px`}>{size}</option>)}
        </select>
        <label title="Couleur du texte" className="flex h-8 cursor-pointer items-center gap-1 rounded px-1 hover:bg-zinc-100"><span className="text-xs font-bold">A</span><input aria-label="Couleur du texte" type="color" className="h-5 w-5" value={editor.getAttributes('textStyle').color || '#111827'} onChange={(event) => chain().setColor(event.target.value).run()} /></label>
        <label title="Surligner" className="flex h-8 cursor-pointer items-center gap-1 rounded px-1 hover:bg-zinc-100"><span className="text-xs">Surligner</span><input aria-label="Couleur de surlignage" type="color" className="h-5 w-5" value="#fde047" onChange={(event) => chain().setHighlight({ color: event.target.value }).run()} /></label>
        <span className="mx-1 h-5 border-l border-zinc-300" />
        {button('Annuler', Undo2, () => chain().undo().run(), false, !editor.can().undo())}{button('Rétablir', Redo2, () => chain().redo().run(), false, !editor.can().redo())}
        {button('Gras', Bold, () => chain().toggleBold().run(), editor.isActive('bold'))}{button('Italique', Italic, () => chain().toggleItalic().run(), editor.isActive('italic'))}{button('Souligné', Underline, () => chain().toggleUnderline().run(), editor.isActive('underline'))}{button('Barré', Strikethrough, () => chain().toggleStrike().run(), editor.isActive('strike'))}{button('Indice', SubscriptIcon, () => chain().toggleSubscript().run(), editor.isActive('subscript'))}{button('Exposant', SuperscriptIcon, () => chain().toggleSuperscript().run(), editor.isActive('superscript'))}
        {button('Aligner à gauche', AlignLeft, () => chain().setTextAlign('left').run(), editor.isActive({ textAlign: 'left' }))}{button('Centrer', AlignCenter, () => chain().setTextAlign('center').run(), editor.isActive({ textAlign: 'center' }))}{button('Aligner à droite', AlignRight, () => chain().setTextAlign('right').run(), editor.isActive({ textAlign: 'right' }))}{button('Justifier', AlignJustify, () => chain().setTextAlign('justify').run(), editor.isActive({ textAlign: 'justify' }))}
        {button('Liste à puces', List, () => chain().toggleBulletList().run(), editor.isActive('bulletList'))}{button('Liste numérotée', ListOrdered, () => chain().toggleOrderedList().run(), editor.isActive('orderedList'))}{button('Citation', Quote, () => chain().toggleBlockquote().run(), editor.isActive('blockquote'))}{button('Séparation', Minus, () => chain().setHorizontalRule().run())}
        {button('Lien', LinkIcon, () => { setUrlKind('link'); setUrlValue(editor.getAttributes('link').href || ''); })}{button('Image fichier', ImageIcon, () => imageInput.current?.click())}{button('Image URL', ImageIcon, () => { setUrlKind('image'); setUrlValue(''); })}{button('Tableau', TableIcon, () => chain().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run())}{button('Importer Word', FileText, () => docxInput.current?.click())}{button('Effacer la mise en forme', Eraser, () => chain().clearNodes().unsetAllMarks().run())}
      </div>
      {urlKind && <form className="flex flex-wrap gap-2 border-b border-zinc-200 bg-white p-2" onSubmit={(event) => { event.preventDefault(); applyUrl(); }}><input autoFocus value={urlValue} onChange={(event) => setUrlValue(event.target.value)} placeholder={urlKind === 'link' ? 'https://exemple.com' : 'https://exemple.com/image.jpg'} className="min-w-0 flex-1 rounded border border-zinc-200 px-3 py-1.5 text-sm" /><button className="rounded bg-zinc-900 px-3 py-1.5 text-xs text-white">OK</button><button type="button" onClick={() => setUrlKind(null)} className="rounded border px-3 py-1.5 text-xs">Annuler</button></form>}
      {editor.isActive('table') && <div className="flex flex-wrap gap-1 border-b border-zinc-200 bg-zinc-50 p-2">{[
        ['Col. avant', () => chain().addColumnBefore().run()], ['Col. après', () => chain().addColumnAfter().run()], ['Lig. avant', () => chain().addRowBefore().run()], ['Lig. après', () => chain().addRowAfter().run()], ['Fusionner', () => chain().mergeCells().run()], ['Scinder', () => chain().splitCell().run()], ['En-tête', () => chain().toggleHeaderRow().run()], ['Suppr. col.', () => chain().deleteColumn().run()], ['Suppr. lig.', () => chain().deleteRow().run()], ['Suppr. tableau', () => chain().deleteTable().run()],
      ].map(([label, run]) => <button key={label as string} type="button" onMouseDown={(event) => event.preventDefault()} onClick={run as () => void} className="rounded border border-zinc-200 bg-white px-2 py-1 text-xs hover:bg-zinc-100">{label as string}</button>)}<label className="flex cursor-pointer items-center gap-1 rounded border bg-white px-2 text-xs">Fond<input type="color" aria-label="Fond de cellule" className="h-5 w-5" onChange={(event) => chain().setCellAttribute('backgroundColor', event.target.value).run()} /></label></div>}
      {editor.isActive('image') && <div className="flex flex-wrap items-center gap-1 border-b border-zinc-200 bg-blue-50 p-2">
        <span className="mr-2 text-xs font-semibold uppercase text-blue-800">Image</span>
        {(['none', 'left', 'center', 'right'] as const).map((align) => <button key={align} type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => chain().updateAttributes('image', { align }).run()} className="rounded border border-zinc-200 bg-white px-2 py-1 text-xs">{{ none: 'En ligne', left: 'Gauche', center: 'Centre', right: 'Droite' }[align]}</button>)}
        {['25%', '50%', '75%', '100%'].map((width) => <button key={width} type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => chain().updateAttributes('image', { width }).run()} className="rounded border border-zinc-200 bg-white px-2 py-1 text-xs">{width}</button>)}
        <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => chain().updateAttributes('image', { width: null }).run()} className="rounded border border-zinc-200 bg-white px-2 py-1 text-xs">Auto</button>
        <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => { const alt = window.prompt('Texte alternatif de l’image', editor.getAttributes('image').alt || ''); if (alt !== null) chain().updateAttributes('image', { alt }).run(); }} className="rounded border border-zinc-200 bg-white px-2 py-1 text-xs">Texte alt</button>
        <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => chain().deleteSelection().run()} className="rounded border border-red-200 bg-white px-2 py-1 text-xs text-red-700">Supprimer</button>
      </div>}
      <EditorContent editor={editor} className="rich-editor__content" style={{ minHeight, maxHeight: '60vh', overflowY: 'auto' }} />
      <div className="flex items-center justify-between gap-3 border-t border-zinc-100 px-3 py-2 text-xs text-zinc-500"><span>{editor.storage.characterCount.words()} mots · {editor.storage.characterCount.characters()} caractères</span><span>{busy ? 'Import en cours…' : notice}</span></div>
      <input ref={imageInput} type="file" accept="image/*" multiple hidden onChange={(event) => { [...(event.target.files || [])].forEach((file) => void insertImage(file)); event.target.value = ''; }} />
      <input ref={docxInput} type="file" accept=".docx" hidden onChange={(event) => void importDocx(event.target.files?.[0])} />
    </div>
  );
};
