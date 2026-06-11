import { supabase } from "../models/db.js";
import { randomUUID } from "node:crypto";

class UploadService {
  /**
   * Uploads a base64 image string to Supabase Storage and returns the public URL.
   * If the string is not a base64 data URL, returns the string as-is.
   * @param {string} base64Str 
   * @param {string} tenant 
   * @returns {Promise<string>}
   */
  async uploadBase64Image(base64Str, tenant) {
    if (!base64Str || !base64Str.startsWith("data:image/")) {
      return base64Str;
    }

    try {
      const matches = base64Str.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
      if (!matches) {
        console.warn("Invalid base64 image data URL format");
        return base64Str;
      }

      const contentType = matches[1]; // e.g. "image/png"
      const base64Data = matches[2];
      const buffer = Buffer.from(base64Data, "base64");

      const ext = contentType.split("/")[1] || "png";
      const filename = `${tenant}/${randomUUID()}.${ext}`;

      // Try to create avatars bucket if it doesn't exist
      try {
        await supabase.storage.createBucket("avatars", {
          public: true,
          allowedMimeTypes: ["image/png", "image/jpeg", "image/gif", "image/webp"],
        });
      } catch (e) {
        // Ignore error if bucket already exists
      }

      // Upload buffer to Supabase Storage
      const { data, error } = await supabase.storage
        .from("avatars")
        .upload(filename, buffer, {
          contentType,
          upsert: true,
        });

      if (error) {
        console.error("Supabase Storage Upload Error:", error);
        return base64Str; // Fallback to base64 string on upload error
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filename);

      const publicUrl = publicUrlData.publicUrl;

      // Save metadata to `assets` table on Supabase
      try {
        const assetId = `asset-${Date.now()}-${randomUUID().slice(0, 8)}`;
        const { error: dbError } = await supabase.from("assets").insert({
          id: assetId,
          tenant,
          url: publicUrl,
          filename,
        });
        if (dbError) {
          console.error("Failed to insert asset record to Supabase DB:", dbError);
        }
      } catch (dbErr) {
        console.error("Database error while saving asset:", dbErr);
      }

      return publicUrl;
    } catch (error) {
      console.error("Failed to upload base64 image to Supabase Storage:", error);
      return base64Str; // Fallback to base64 string on general error
    }
  }
}

export const uploadService = new UploadService();
