// we need to wrap it inside string to avoid any errors, as sometimes it may happen
// that a string is treated as number if there is a gap in numbers and chars
// eg- 66566 ee5656 db

export const conf = {
    appwriteUrl: String(import.meta.env.VITE_APPWRITE_URL),
    appwriteProjectId: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
    appwriteDatabaseId: String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
    appwriteCollectionId: String(import.meta.env.VITE_APPWRITE_COLLECTION),
    appwriteBucketId: String(import.meta.env.VITE_APPWRITE_BUCKET_ID),
    tinymceKey: String(import.meta.env.VITE_TINYMCE_KEY),
};
