import AppwriteDBService from "../appwrite/dbService";
import { Link } from "react-router-dom";

// appwrite take document_Id which starts with $id
function PostCard({ $id, title, featuredImage }) {
    // in Link whatever page we are currently in, it will add the url to it, ex home/profile/post/${$id}
    // it will add to home/profile
    return (
        <Link to={`/post/${$id}`}>
            <div className="w-full bg-gray-100 rounded-xl p-4">
                <div className="w-full justify-center mb-4">
                    <img
                        src={AppwriteDBService.getFilePreview(featuredImage)}
                        alt={title}
                        className="rounded-xl"
                    />
                </div>
                <h2 className="text-xl font-bold">{title}</h2>
            </div>
        </Link>
    );
}

export default PostCard;
