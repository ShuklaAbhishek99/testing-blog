import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, Select, RTE } from "../index";
import appwriteDBService from "../../appwrite/dbService";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function PostForm({ post }) {
    const { register, handleSubmit, watch, setValue, control, getValues } =
        useForm({
            defaultValues: {
                title: post?.title || "",
                slug: post?.$id || "",
                content: post?.content || "",
                status: post?.status || "active",
            },
        });

    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);

    const submit = async (data) => {
        // if the post is already there, means user came to edit the post
        if (post) {
            // uploading new file
            const file = data.image[0]
                ? await appwriteDBService.uploadFile(data.image[0])
                : null;

            // now we have uploaded a new image, but the old image is still there
            // which the user has uploaded previously we need to delete that so the old ones
            // don't take space in storage

            // if new file uploaded, delete old file
            if (file) {
                appwriteDBService.deleteFile(post.featuredImage);
            }

            // updating post with whatever data changed, and update new file in the document
            const dbPost = await appwriteDBService.updatePost(post.$id, {
                ...data,
                featuredImage: file ? file.$id : undefined,
            });

            // when post updated, redirect to this
            if (dbPost) {
                navigate(`/post/${dbPost.$id}`);
            }
        } else {
            const file = await appwriteDBService.uploadFile(data.image[0]);

            if (file) {
                const fileId = file.$id;
                data.featuredImage = fileId;

                // why userData.$id
                // user can only create a post when he is logged in,
                // when user is loggedin userData in store has the data returned from appwrite
                // which has property "$id"
                // and userId will help us identify the author of the post
                const dbPost = await appwriteDBService.createPost({
                    ...data,
                    userId: userData.$id,
                });

                if (dbPost) {
                    navigate(`/post/${dbPost.$id}`);
                }
            }
        }
    };

    // this is the functionality for slug watch
    // slug is generated from titile
    // whenever user give any space in title, in slug we add a hyphen(-) there to generate slug
    const slugTransform = useCallback((value) => {
        if (value && typeof value === "string") {
            // can be done this way or next
            // const slug = value.toLowerCase().replace(/ /g, "-");
            // setValue("slug", slug);
            // return slug;

            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-") //replacing spaces,  with '-'
                .replace(/\s/g, "-"); //

            // first replace does this
            // let str = "Hello, World! 1234.";
            // let result = str.replace(/[^a-zA-Z\d\s]+/g, "-");
            // console.log(result);
            // Output: "Hello- World- 1234-"

            // second with chaining does this
            // let str = "Hello, World! 1234.";
            // let result = str.replace(/[^a-zA-Z\d\s]+/g, "-").replace(/\s/g, "-");
            // console.log(result);
            // Output: "Hello--World--1234-"
        }

        return "";
    }, []);

    // as the value in title changes useEffect will monitor the values(string) and changes in slug
    useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title") {
                setValue("slug", slugTransform(value.title), {
                    shouldValidate: true,
                });
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);

    return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
            <div className="w-2/3 px-2">
                <Input
                    label="Title :"
                    placeholder="Title"
                    className="mb-4"
                    {...register("title", { required: true })}
                />
                <Input
                    label="Slug :"
                    placeholder="Slug"
                    className="mb-4"
                    {...register("slug", { required: true })}
                    // when user inputs a value, constantly transforming value
                    onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value), {
                            shouldValidate: true,
                        });
                    }}
                />
                {/* Used created RTE, control has been passed so it will take the control */}
                <RTE
                    label="Content :"
                    name="content"
                    control={control}
                    defaultValue={getValues("content")}
                />
            </div>
            <div className="w-1/3 px-2">
                {/* this will handle the image so we added the type as file */}
                <Input
                    label="Featured Image :"
                    type="file"
                    className="mb-4"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("image", { required: !post })}
                />
                {post && (
                    <div className="w-full mb-4">
                        <img
                            src={appwriteDBService.getFilePreview(
                                post.featuredImage
                            )}
                            alt={post.title}
                            className="rounded-lg"
                        />
                    </div>
                )}
                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className="mb-4"
                    {...register("status", { required: true })}
                />
                <Button
                    type="submit"
                    bgColor={post ? "bg-green-500" : undefined}
                    className="w-full"
                >
                    {post ? "Update" : "Submit"}
                </Button>
            </div>
        </form>
    );
}

export default PostForm;
