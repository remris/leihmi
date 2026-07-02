"use server";
import { put } from "@vercel/blob";

/**
 * Upload image to Vercel Blob Storage
 * @param file File to upload
 * @param itemName Name of the item (for filename)
 * @returns URL of uploaded image
 */
export async function uploadImage(file: File, itemName: string): Promise<string> {
  const filename = `items/${Date.now()}-${itemName.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${file.name}`;

  const blob = await put(filename, file, {
    access: 'public',
    addRandomSuffix: true,
  });

  return blob.url;
}

/**
 * Upload multiple images to Vercel Blob Storage
 * @param files Array of files to upload
 * @param itemName Name of the item (for filenames)
 * @returns Array of URLs of uploaded images
 */
export async function uploadImages(files: File[], itemName: string): Promise<string[]> {
  const uploadPromises = files.map(file => uploadImage(file, itemName));
  return Promise.all(uploadPromises);
}

