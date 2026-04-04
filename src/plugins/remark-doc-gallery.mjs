const galleryImagePattern = /^!\[(?<alt>.*)\]\((?<src>\S+)\)$/;

const escapeHtml = value =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const parseGalleryItems = value =>
  value
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => {
      const match = line.match(galleryImagePattern);
      if (!match?.groups?.src) return null;
      return {
        src: match.groups.src,
        alt: match.groups.alt ?? '',
      };
    })
    .filter(Boolean);

const buildGalleryHtml = items => {
  if (!items.length) return null;

  const [preview, ...rest] = items;
  const previewImage = `<img src="${escapeHtml(preview.src)}" alt="${escapeHtml(preview.alt)}" />`;
  const links = [preview, ...rest]
    .map(
      item =>
        `<a href="${escapeHtml(item.src)}" data-doc-gallery-item data-alt="${escapeHtml(item.alt)}" hidden></a>`
    )
    .join('');

  return `<figure class="doc-image-gallery">${previewImage}${links}</figure>`;
};

const transformChildren = node => {
  if (!node || !Array.isArray(node.children)) return;

  node.children = node.children.map(child => {
    if (child?.type === 'code' && child.lang === 'gallery') {
      const items = parseGalleryItems(child.value ?? '');
      const html = buildGalleryHtml(items);
      if (html) {
        return {
          type: 'html',
          value: html,
        };
      }
    }

    transformChildren(child);
    return child;
  });
};

export default function remarkDocGallery() {
  return tree => {
    transformChildren(tree);
  };
}
