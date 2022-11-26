import { async } from "@firebase/util";
import {
  BookmarkIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  EllipsisHorizontalIcon,
  FaceSmileIcon,
  HeartIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconFilled } from "@heroicons/react/24/solid";
import {
  addDoc,
  collection,
  deleteDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Moment from "react-moment";
import { db } from "../firebase";
import { doc } from "firebase/firestore";

const Post = ({ id, username, userImg, img, caption }) => {
  const { data: session } = useSession();
  const [comment, setComment] = useState();
  const [comments, setComments] = useState();
  const [likes, setLikes] = useState();
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(
    () =>
      setHasLiked(
        likes?.findIndex((like) => like.id === session?.user?.uid) !== -1
      ),
    [likes]
  );

  useEffect(
    () =>
      onSnapshot(collection(db, "posts", id, "likes"), (snapshot) =>
        setLikes(snapshot.docs)
      ),
    [db, id]
  );

  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, "posts", id, "comments"),
          orderBy("timestamp", "desc")
        ),
        (snapshot) => setComments(snapshot.docs)
      ),
    [db, id]
  );

  const likePost = async () => {
    if (hasLiked) {
      await deleteDoc(doc(db, "posts", id, "likes", session.user.uid));
    } else {
      await setDoc(doc(db, "posts", id, "likes", session.user.uid), {
        username: session.user.username,
      });
    }
  };

  const sendComment = async (e) => {
    e.preventDefault();

    const commentToSend = comment;
    setComment("");

    await addDoc(collection(db, "posts", id, "comments"), {
      comment: commentToSend,
      username: session.user.username,
      userImg: session.user.image,
      timestamp: serverTimestamp(),
    });
  };

  return (
    <div className=' bg-white my-7 border rounded-xl'>
      {/*Header*/}
      <div className='flex items-center p-5'>
        <img
          className=' rounded-full h-12 w-12 object-contain border p-1 mr-3'
          src={userImg}
          alt=''
        />
        <p className='flex-1 font-bold'>{username}</p>
        <EllipsisHorizontalIcon className='h-5' />
      </div>

      {/*image*/}
      <img className=' object-cover w-full' src={img} alt='' />

      {/*Button*/}
      {session && (
        <div className='flex justify-between px-4 py-5'>
          <div className='flex space-x-3'>
            {hasLiked ? (
              <HeartIconFilled
                onClick={likePost}
                className='btn text-red-500'
              />
            ) : (
              <HeartIcon onClick={likePost} className='btn' />
            )}
            <ChatBubbleOvalLeftEllipsisIcon className='btn' />
            <PaperAirplaneIcon className='btn -rotate-45' />
          </div>
          <BookmarkIcon className='btn' />
        </div>
      )}

      {/*Caption*/}
      <p className=' px-5 truncate '>
        {likes.length > 0 && (
          <p className=' font-bold mb-1'>{likes.length} likes</p>
        )}
        <span className=' font-bold mr-3'>{username}</span>
        {caption}
      </p>

      {/*Comments*/}
      {comments?.length > 0 && (
        <div className=' ml-10 h-8 overflow-y-scroll scrollbar-thumb-black scrollbar-thin'>
          {comments.map((comment) => (
            <div key={comment.id} className=' flex items-center space-x-2 mb-3'>
              <img
                className=' h-7 rounded-full'
                src={comment.data().userImg}
                alt=''
              />
              <p className=' text-sm flex-1 '>
                <span className=' font-bold mr-2'>
                  {comment.data().username}
                </span>
                {comment.data().comment}
              </p>
              <Moment className='pr-5 text-xs ' fromNow>
                {comment.data().timestamp?.toDate()}
              </Moment>
            </div>
          ))}
        </div>
      )}

      {/*Input field*/}
      {session && (
        <form className='flex items-center space-x-1 px-5 py-4'>
          <FaceSmileIcon className='btn' />
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className='flex-1 border-none focus:ring-0 outline-none'
            placeholder='Write your post here'
            type='text'
          />
          <button
            type='submit'
            disabled={!comment?.trim()}
            onClick={sendComment}
            className=' font-semibold text-blue-400'
          >
            Post
          </button>
        </form>
      )}
    </div>
  );
};

export default Post;
