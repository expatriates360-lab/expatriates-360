import { createAdminClient } from "@/lib/supabase";
import { normalizeCvUrl } from "@/lib/cloudinary";

const CV_BUCKET = "cvs";

/**
 * Upload a CV file to Supabase Storage under the user's folder.
 * Returns the storage path (used to construct download URLs).
 */
export async function uploadCv(
  userId: string,
  file: File
): Promise<{ path: string; publicUrl: string }> {
  const supabase = createAdminClient();

  if (file.type !== "application/pdf") {
    throw new Error("Only PDF files are accepted for CV uploads.");
  }
  if (file.size > 10 * 1024 * 1024) {
    throw new Error("CV file must be under 10MB.");
  }

  const ext = "pdf";
  const path = `${userId}/cv_${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from(CV_BUCKET)
    .upload(path, file, {
      contentType: "application/pdf",
      upsert: true,
    });

  if (error) throw new Error(`CV upload failed: ${error.message}`);

  // Generate a signed URL valid for 1 year (for candidate profiles)
  const { data: signedData, error: signError } = await supabase.storage
    .from(CV_BUCKET)
    .createSignedUrl(path, 60 * 60 * 24 * 365);

  if (signError || !signedData?.signedUrl) {
    throw new Error("Failed to generate CV signed URL.");
  }

  return { path, publicUrl: signedData.signedUrl };
}

/**
 * Delete a CV file from Supabase Storage by its storage path.
 */
export async function deleteCv(storagePath: string): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.storage
    .from(CV_BUCKET)
    .remove([storagePath]);
  if (error) throw new Error(`CV deletion failed: ${error.message}`);
}

/**
 * Generate a fresh signed download URL for an existing CV.
 *
 * If the stored cv_url is a full Cloudinary URL (uploaded via the
 * Cloudinary flow) it is returned directly after normalising the
 * resource-type path segment (/image/ → /raw/).  If it is a Supabase
 * storage path (legacy flow) a 1-hour signed URL is generated instead.
 */
export async function getCvDownloadUrl(storagePath: string): Promise<string> {
  // Cloudinary URL — return directly (normalised)
  if (storagePath.startsWith("https://res.cloudinary.com")) {
    return normalizeCvUrl(storagePath);
  }

  // Supabase storage path — generate a short-lived signed URL
  const supabase = createAdminClient();
  const { data, error } = await supabase.storage
    .from(CV_BUCKET)
    .createSignedUrl(storagePath, 60 * 60); // 1-hour download link
  if (error || !data?.signedUrl) {
    throw new Error("Failed to generate CV download URL.");
  }
  return data.signedUrl;
}
