import { mergeAttributes } from '@tiptap/core';
import Image from '@tiptap/extension-image';
import { TableCell, TableHeader } from '@tiptap/extension-table';

const normSize = (value: string | null) => value && /^\d+(\.\d+)?$/.test(value) ? `${value}px` : value || null;

function imageStyle({ width, align }: { width?: string | null; align?: string | null }): string {
  let style = 'height:auto;max-width:100%;';
  if (width) style += `width:${width};`;
  if (align === 'left') style += 'float:left;margin:.25rem 1rem .5rem 0;';
  else if (align === 'right') style += 'float:right;margin:.25rem 0 .5rem 1rem;';
  else if (align === 'center') style += 'display:block;margin:.5rem auto;';
  return style;
}

function wrapperStyle(width?: string | null, align?: string | null): string {
  let style = `max-width:100%;width:${width || 'fit-content'};`;
  if (align === 'left') style += 'float:left;margin:.25rem 1rem .5rem 0;';
  else if (align === 'right') style += 'float:right;margin:.25rem 0 .5rem 1rem;';
  else if (align === 'center') style += 'margin:.5rem auto;';
  return style;
}

export const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: { default: null, parseHTML: (element) => normSize(element.style.width || element.getAttribute('width')), renderHTML: () => ({}) },
      align: {
        default: 'none',
        parseHTML: (element) => element.style.float === 'left' ? 'left' : element.style.float === 'right' ? 'right' : element.style.display === 'block' && element.style.marginLeft === 'auto' ? 'center' : 'none',
        renderHTML: () => ({}),
      },
    };
  },
  renderHTML({ node, HTMLAttributes }) {
    return ['img', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, { style: imageStyle(node.attrs) })];
  },
  addNodeView() {
    return ({ node, editor, getPos }) => {
      let current = node;
      const wrapper = document.createElement('div');
      wrapper.className = 'rimg';
      const image = document.createElement('img');
      const handle = document.createElement('span');
      handle.className = 'rimg__handle';
      wrapper.append(image, handle);

      const render = () => {
        const { src, alt, title, width, align } = current.attrs;
        image.src = src;
        image.alt = alt || '';
        if (title) image.title = title;
        else image.removeAttribute('title');
        image.style.cssText = `display:block;height:auto;max-width:100%;width:${width ? '100%' : 'auto'};`;
        wrapper.style.cssText = wrapperStyle(width, align);
        wrapper.classList.toggle('rimg--right', align === 'right');
      };
      render();

      handle.addEventListener('mousedown', (event) => {
        event.preventDefault(); event.stopPropagation();
        const dom = editor.view.dom;
        const computedStyle = getComputedStyle(dom);
        const maxWidth = dom.clientWidth - parseFloat(computedStyle.paddingLeft) - parseFloat(computedStyle.paddingRight);
        const startX = event.clientX;
        const startWidth = wrapper.getBoundingClientRect().width;
        const direction = current.attrs.align === 'right' ? -1 : 1;
        const move = (moveEvent: MouseEvent) => {
          const width = Math.min(maxWidth, Math.max(60, startWidth + direction * (moveEvent.clientX - startX)));
          wrapper.style.width = `${width}px`; image.style.width = '100%';
        };
        const up = () => {
          document.removeEventListener('mousemove', move); document.removeEventListener('mouseup', up);
          const width = Math.min(100, Math.round((wrapper.getBoundingClientRect().width / maxWidth) * 100));
          const position = getPos();
          if (typeof position !== 'number') return;
          editor.view.dispatch(editor.state.tr.setNodeMarkup(position, undefined, { ...current.attrs, width: `${width}%` }));
        };
        document.addEventListener('mousemove', move); document.addEventListener('mouseup', up);
      });

      return {
        dom: wrapper,
        update(updated) { if (updated.type !== current.type) return false; current = updated; render(); return true; },
        selectNode: () => wrapper.classList.add('is-selected'),
        deselectNode: () => wrapper.classList.remove('is-selected'),
        stopEvent: (event) => event.target === handle,
        ignoreMutation: () => true,
      };
    };
  },
});

const cellBackground = {
  backgroundColor: {
    default: null,
    parseHTML: (element: HTMLElement) => element.style.backgroundColor || element.getAttribute('bgcolor') || null,
    renderHTML: (attributes: { backgroundColor?: string | null }) => attributes.backgroundColor ? { style: `background-color:${attributes.backgroundColor}` } : {},
  },
};

export const CellWithBg = TableCell.extend({ addAttributes() { return { ...this.parent?.(), ...cellBackground }; } });
export const HeaderWithBg = TableHeader.extend({ addAttributes() { return { ...this.parent?.(), ...cellBackground }; } });

function convertWordLists(document: Document): void {
  const isItem = (element: Element | null): element is HTMLParagraphElement => element?.nodeName === 'P' && /mso-list:\s*l\d+/i.test(element.getAttribute('style') || '');
  const done = new Set<Element>();
  [...document.body.querySelectorAll('p')].filter(isItem).forEach((start) => {
    if (done.has(start)) return;
    const run: HTMLParagraphElement[] = [];
    for (let element: Element | null = start; isItem(element); element = element.nextElementSibling) { run.push(element); done.add(element); }
    const root = document.createElement('div');
    const stack: { level: number; list: HTMLOListElement | HTMLUListElement }[] = [];
    run.forEach((paragraph) => {
      const level = Number(/level(\d+)/i.exec(paragraph.getAttribute('style') || '')?.[1] || 1);
      const marker = paragraph.querySelector('span[style*="mso-list:Ignore"]');
      const ordered = marker ? /^[\dA-Za-z]+[.)]/.test(marker.textContent?.trim() || '') : false;
      marker?.remove();
      while (stack.length && stack[stack.length - 1].level > level) stack.pop();
      let top = stack[stack.length - 1];
      if (!top || top.level < level) {
        const list = document.createElement(ordered ? 'ol' : 'ul');
        if (top) {
          const parentItem = top.list.lastElementChild || top.list.appendChild(document.createElement('li'));
          parentItem.appendChild(list);
        } else root.appendChild(list);
        top = { level, list }; stack.push(top);
      }
      const item = document.createElement('li'); item.innerHTML = paragraph.innerHTML; top.list.appendChild(item);
    });
    start.replaceWith(...root.childNodes); run.slice(1).forEach((paragraph) => paragraph.remove());
  });
}

export function cleanWordHtml(html: string): string {
  if (!/(class="?Mso|urn:schemas-microsoft-com|<o:p>|mso-)/i.test(html)) return html;
  const document = new DOMParser().parseFromString(html, 'text/html');
  document.querySelectorAll('style, meta, link, xml, script, o\\:p').forEach((element) => element.remove());
  document.querySelectorAll('img').forEach((image) => { if (/^(file:|cid:)/i.test(image.getAttribute('src') || '')) image.remove(); });
  convertWordLists(document);
  document.querySelectorAll('[style]').forEach((element) => {
    const kept = (element.getAttribute('style') || '').split(';').map((style) => style.trim()).filter((style) => style && !/^(mso-|margin|text-indent|line-height|tab-stops|layout-grid|page-break|widows|orphans)/i.test(style));
    if (kept.length) element.setAttribute('style', kept.join(';'));
    else element.removeAttribute('style');
  });
  document.querySelectorAll('[class]').forEach((element) => element.removeAttribute('class'));
  return document.body.innerHTML;
}
