import { IMAGE_BUCKET, SUPABASE_URL } from "./supabase/config";

/** Public URL of a file in the images bucket. */
export function imageUrl(path) {
  if (!path) return null;
  if (/^(data:|blob:|https?:)/.test(path)) return path; // already a URL (styleguide samples)
  return `${SUPABASE_URL}/storage/v1/object/public/${IMAGE_BUCKET}/${path}`;
}

export const ACCEPTED_IMAGES = "image/png,image/jpeg,image/webp,image/gif";
const MAX_INPUT_BYTES = 15 * 1024 * 1024;

/** Error whose message can be shown to the user as-is. */
export function userError(message) {
  return Object.assign(new Error(message), { userFacing: true });
}

/**
 * Resizes an image in the browser (keeps uploads small and fast),
 * returns a WebP Blob. GIFs are kept as-is to preserve animation.
 */
export async function prepareImage(file, maxSize) {
  if (!file.type.startsWith("image/")) throw userError("This file is not an image.");
  if (file.size > MAX_INPUT_BYTES) throw userError("Image is too large (max 15 MB).");
  if (file.type === "image/gif") {
    if (file.size > 5 * 1024 * 1024) throw userError("GIF is too large (max 5 MB).");
    return { blob: file, ext: "gif", contentType: "image/gif" };
  }

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d").drawImage(bitmap, 0, 0, width, height);
  bitmap.close?.();

  const blob = await new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(userError("Could not process image."))), "image/webp", 0.85),
  );
  return { blob, ext: "webp", contentType: "image/webp" };
}

/** Max dimension per usage. */
export const IMAGE_SIZES = {
  avatar: 256,
  thumbnail: 256,
  ticket: 1600,
};
