/**
 * Accepts any YouTube link format (or a bare 11-char video ID) and returns the video ID.
 * Handles: youtube.com/watch?v=…, youtu.be/…, /shorts/…, /embed/…, /live/…, m./music. subdomains.
 */
export function extractYoutubeId(input: string | undefined | null): string | null {
  if (!input) return null;
  const value = input.trim();
  if (/^[\w-]{11}$/.test(value)) return value;
  let url: URL;
  try {
    url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^(www\.|m\.|music\.)/, '');
  let id: string | null = null;
  if (host === 'youtu.be') {
    id = url.pathname.split('/')[1] ?? null;
  } else if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
    id = url.searchParams.get('v');
    if (!id) {
      const m = url.pathname.match(/^\/(?:shorts|embed|live|v)\/([\w-]{11})/);
      id = m ? m[1] : null;
    }
  }
  return id && /^[\w-]{11}$/.test(id) ? id : null;
}

export const youtubeEmbedUrl = (id: string) => `https://www.youtube-nocookie.com/embed/${id}?rel=0`;
export const youtubeWatchUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`;
