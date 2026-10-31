/** Format bytes into human-readable string */
export const fmtBytes = (n: number): string => {
  if (n < 1024) return `${n} B`;
  if (n < 1024 ** 2) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 ** 2).toFixed(1)} MB`;
};

/** Strip extension and sanitise a filename */
export const safeName = (s: string): string =>
  s.replace(/\.[^.]+$/, '').replace(/[\\/:*?"<>|]+/g, '-').trim() || 'document';

/** Generate a random 64-char hex owner password */
export const randomOwnerPassword = (): string =>
  Array.from(crypto.getRandomValues(new Uint8Array(32)), (b) =>
    b.toString(16).padStart(2, '0')
  ).join('');

/** Trigger browser download of a Blob */
export const downloadBlob = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30_000);
};
