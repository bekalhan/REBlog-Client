import React, { useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { PencilAltIcon, TrashIcon } from "@heroicons/react/solid";
import {
  deletePostAction,
  fetchPostDetailsAction,
} from "../../redux/slices/posts/postSlices";
import { useDispatch, useSelector } from "react-redux";
import DateFormatter from "../../utils/DateFormatter";
import LoadingComponent from "../../utils/LoadingComponent";
import AddComment from "../Comments/AddComment";
import CommentsList from "../Comments/CommentsList";
import {Avatar, Box, Typography} from '@mui/material'

const PostDetails = ({
  match: {
    params: { id },
  },
}) => {
  const dispatch = useDispatch();

  //select post details from store
  const post = useSelector(state => state?.post);
  const { postDetails, loading, appErr, serverErr, isDeleted } = post;

  //comment
  const comment = useSelector(state => state.comment);
  const { commentCreated, commentDeleted } = comment;
  useEffect(() => {
    dispatch(fetchPostDetailsAction(id));
  }, [id, dispatch, commentCreated, commentDeleted]);

  //Get login user
  const user = useSelector(state => state.users);
  const { userAuth } = user;
  const isAdmin = userAuth?.isAdmin;
  const isCreatedBy = postDetails?.user?._id === userAuth?._id;

  //redirect
  if (isDeleted) return <Redirect to="/posts" />;
  return (
    <>
      {loading ? (
        <div className="h-screen">
          <LoadingComponent />
        </div>
      ) : appErr || serverErr ? (
        <h1 className="h-screen text-red-400 text-xl">
          {serverErr} {appErr}
        </h1>
      ) : (
        <section className="py-20 2xl:py-40 bg-gray-800 overflow-hidden w-full">
          <div className="container px-4 mx-auto w-full">
            {/* Post Image */}
            <img
              className="mb-24 w-full h-96 object-cover"
              src={postDetails?.image}
              alt=""
            />
            <Box>
              <Typography sx={{textAlign:"center", fontSize:"48px",color:"white"}}>
                {postDetails?.title}
              </Typography>

              {/* User */}
              <Box sx={{display:"flex",justifyContent:"center"}}>
                <Avatar
                sx={{height:"200px",width:"200px",marginTop:"3rem"}}
                  src={postDetails?.user?.profilePhoto}
                  alt=""
                />
                <Box sx={{display:"flex",textAlign:"center",justifyContent:"center",marginTop:"6rem",marginLeft:"3rem"}}>
                  <Box>
                  <h2 className="mb-1 text-2xl font-bold text-gray-50">
                    <span className="text-xl lg:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-yellow-200 to-orange-600">
                      {postDetails?.user?.firstname}{" "}
                      {postDetails?.user?.lastname}{" "}
                    </span>
                  </h2>
                  <p className="text-gray-500">
                    {<DateFormatter date={post?.createdAt} />}
                  </p>
                  </Box>
                </Box>
              </Box>
              {/* Post description */}
              <Box sx={{width: '100%',marginTop:"4rem"}}>
                <p class="mb-6 text-left  text-xl text-gray-200">
                  {postDetails?.description}

                  {/* Show delete and update  if it was created by the user */}
                  {isCreatedBy  || isAdmin ? (
                    <p class="flex">
                      <Link to={`/update-post/${postDetails?._id}`} class="p-3">
                        <PencilAltIcon class="h-8 mt-3 text-yellow-300" />
                      </Link>
                      <button
                        onClick={() =>
                          dispatch(deletePostAction(postDetails?._id))
                        }
                        class="ml-3"
                      >
                        <TrashIcon class="h-8 mt-3 text-red-600" />
                      </button>
                    </p>
                  ) : null}
                </p>
              </Box>
            </Box>
          </div>
          {/* Add comment Form component here */}
          {userAuth ? <AddComment postId={id} /> : null}
          <div className="flex justify-center  items-center">
            {/* <CommentsList comments={post?.comments} postId={post?._id} /> */}
            <CommentsList comments={postDetails?.comments} />
          </div>
        </section>
      )}
    </>
  );
};

export default PostDetails;
