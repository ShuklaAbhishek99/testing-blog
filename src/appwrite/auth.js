import { conf } from "../config/config";
import { Client, Account, ID } from "appwrite";

class AuthService {
    client = new Client();
    account;

    constructor() {
        try {
            this.client
                .setEndpoint(conf.appwriteUrl)
                .setProject(conf.appwriteProjectId);

            this.account = new Account(this.client);
        } catch (error) {
            console.error("Error initializing Appwrite Client: ", error);
            // the below line stop the current execution of the function and propogates the
            // up in the call stack
            throw new Error("Failed to initialize Appwrite Client");
        }
    }

    async createAccount({ email, password, name }) {
        try {
            const userAccount = await this.account.create(
                ID.unique(),
                email,
                password,
                name
            );

            if (userAccount) {
                // login the user when userAccount created
                return this.login({ email, password });
            } else {
                return userAccount;
                // throw new Error("Failed to create Account");
            }
        } catch (error) {
            console.log("Appwrite serive :: createAccount :: error", error);
            throw error;
        }
    }

    async login({ email, password }) {
        try {
            const user = await this.account.createEmailPasswordSession(
                email,
                password
            );
            return user;
        } catch (error) {
            console.log("Appwrite serive :: login :: error", error);
            return false;
        }
    }

    // if user already logged in then
    async getCurrentUser() {
        try {
            // improve this code, if no current user exist then do something else
            return await this.account.get();
        } catch (error) {
            console.log("Appwrite serive :: getCurrentUser :: error", error);
            // return false;
        }

        return null;
    }

    async logout() {
        try {
            // deleteSessions will logout from all browsers and anywhere logged in
            // deleteSession will only logout from current session
            return await this.account.deleteSessions();
        } catch (error) {
            console.log("Appwrite serive :: logout :: error", error);
        }
    }
}

const authService = new AuthService();

export default authService;
