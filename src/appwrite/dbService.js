import { Client, Databases, Storage, ID, Query } from "appwrite";
import { conf } from "../config/config";

class Service {
    client = new Client();
    databases;
    storage;

    constructor() {
        try {
            this.client
                .setEndpoint(conf.appwriteUrl)
                .setProject(conf.appwriteProjectId);

            this.databases = new Databases(this.client);
            this.storage = new Storage(this.client);
        } catch (error) {
            console.error("Error initializing Appwrite Client: ", error);
            throw new Error("Failed to initialize Appwrite Client");
        }
    }

    // slug is passed as document_Id
    async createPost({ title, slug, content, featuredImage, status, userId }) {
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status,
                    userId,
                }
            );
        } catch (error) {
            console.log("Appwrite serive :: createPost :: error", error);
            return false;
        }
    }

    async getPost(slug) {
        try {
            return this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            );
        } catch (error) {
            console.log("Appwrite serive :: getPost :: error", error);
            return false;
        }
    }

    // the query can be changed and can be taken from the user, here it is hard quoted
    // queries without index in document (inside appwrite console) won't work
    async getPosts(queries = [Query.equal("status", "active")]) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                queries // same above values can be used here
            );
        } catch (error) {
            console.log("Appwrite serive :: getPosts :: error", error);
            return false;
        }
    }

    async updatePost(slug, { title, content, featuredImage, status }) {
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status,
                }
            );
        } catch (error) {
            console.log("Appwrite serive :: updateDocument :: error", error);
            return false;
        }
    }

    async deletePost(slug) {
        try {
            return await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            );
        } catch (error) {
            console.log("Appwrite serive :: deletePost :: error", error);
            return false;
        }
    }

    // file upload service

    async uploadFile(file) {
        try {
            return await this.storage.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file
            );
        } catch (error) {
            console.log("Appwrite serive :: uploadFile :: error", error);
            return false;
        }
    }

    async deleteFile(fileId) {
        try {
            await this.storage.deleteFile(conf.appwriteBucketId, fileId);
            return true;
        } catch (error) {
            console.log("Appwrite serive :: deleteFile :: error", error);
            return false;
        }
    }

    getFilePreview(fileId) {
        return this.storage.getFilePreview(conf.appwriteBucketId, fileId);
    }
}

const dbService = new Service();

export default dbService;
