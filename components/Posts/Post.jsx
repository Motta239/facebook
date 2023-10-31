import {
  ChatAlt2Icon,
  ChatIcon,
  DotsHorizontalIcon,
  HeartIcon,
} from '@heroicons/react/outline'
import {
  ArrowCircleRightIcon,
  HeartIcon as HeartIconFilled,
} from '@heroicons/react/solid'
import MarkChatUnreadTwoToneIcon from '@mui/icons-material/MarkChatUnreadTwoTone'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import ReplySharpIcon from '@mui/icons-material/ReplySharp'
import { signIn, signOut, useSession } from 'next-auth/react'
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import { useEffect, useState, useRef } from 'react'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import SettingsIcon from '@mui/icons-material/Settings'
import { db, storage } from '../../firebase'
import Moment from 'react-moment'
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined'
import BookmarkOutlinedIcon from '@mui/icons-material/BookmarkOutlined'
import { useRecoilState } from 'recoil'
import { contactId } from '../../atoms/contactId'
import InputEmoji from 'react-input-emoji'
import { darkMode } from '../../atoms/darkMode'
import { BiComment, BiCommentAdd, BiMessageEdit } from 'react-icons/bi'
import { MdComment, MdInsertComment } from 'react-icons/md'
function Post({ id, username, userImg, caption, edited, editTime, timestamp }) {
  const { data: session } = useSession()
  const [{ email, name }, setContactId] = useRecoilState(contactId)
  const [dark, setDark] = useRecoilState(darkMode)
  const [images, setImages] = useState([])
  const myRef = useRef()
  const myRefComment = useRef()
  const updateCapRef = useRef()
  const photoRef = useRef()
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState([])
  const [likes, setLikes] = useState([])
  const [com, setCom] = useState(false)
  const [hasLiked, setHasLiked] = useState(false)
  const [open, setOpen] = useState(false)
  const [editPost, setEditPost] = useState(false)
  const [openPhotoModal, setOpenPhotoModal] = useState(false)
  const inputRef = useRef(false)
  const editedInputRef = useRef('')
  const [count, setCount] = useState(1)
  const [updatedCom, setUpdatedCom] = useState('')
  const [sendCommentModal, setSendCommentMoadl] = useState(false)

  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, 'posts', id, 'comments'),
          orderBy('timestamp', 'desc')
        ),
        (snapshot) => {
          setComments(snapshot.docs)
        }
      ),
    [db, id]
  )
  useEffect(
    () =>
      onSnapshot(query(collection(db, 'posts', id, 'likes')), (snapshot) => {
        setLikes(snapshot.docs)
      }),
    [db, id]
  )
  useEffect(
    () =>
      onSnapshot(query(collection(db, 'posts', id, 'images')), (snapshot) => {
        setImages(snapshot.docs)
      }),
    [db, id]
  )
  useEffect(
    () =>
      setHasLiked(
        likes.findIndex((like) => like.id === session?.user?.uid) !== -1
      ),
    [likes]
  )
  useEffect(() => {
    document.addEventListener('mousedown', (e) => {
      if (!myRef.current?.contains(e.target)) {
        setOpen(false)
      }
    })
  })
  useEffect(() => {
    document.addEventListener('mousedown', (e) => {
      if (!myRefComment.current?.contains(e.target)) {
        setSendCommentMoadl(false)
      }
    })
  })
  useEffect(() => {
    document.addEventListener('mousedown', (e) => {
      if (!photoRef.current?.contains(e.target)) {
        setOpenPhotoModal(null)
      }
    })
  })
  useEffect(() => {
    document.addEventListener('mousedown', (e) => {
      if (!updateCapRef.current?.contains(e.target)) {
        setEditPost(false)
      }
    })
  })
  const updatePost = async (e) => {
    e.preventDefault()
    const washingtonRef = doc(db, 'posts', id)
    await updateDoc(washingtonRef, {
      caption: editedInputRef.current?.value,
      edited: 'Edited',
      editTime: serverTimestamp(),
    })
    setEditPost(false)
  }
  const likePost = async () => {
    if (!session) return
    if (hasLiked) {
      await deleteDoc(doc(db, 'posts', id, 'likes', session.user.uid))
    } else {
      await setDoc(doc(db, 'posts', id, 'likes', session.user.uid), {
        username: session.user.name,
      })
    }
  }
  const deletePost = async () => {
    await deleteDoc(doc(db, 'posts', id))
    await deleteDoc(doc(db, 'posts', id, 'likes', session.user.uid))
  }
  const sendComment = async (e) => {
    const commentToSend = comment
    setComment('')
    await addDoc(collection(db, 'posts', id, 'comments'), {
      comment: commentToSend,
      username: session.user.name,
      userImage: session.user.image,
      timestamp: serverTimestamp(),
    })
    setOpen(false)
  }

  return (
    <div
      ref={updateCapRef}
      className={` relative my-7 rounded-xl transition-all duration-300 ease-in ${
        dark ? 'bg-neutral-900 text-white' : 'bg-white text-black '
      }  shadow-2xl `}
    >
      <div className="flex  p-6 ">
        <img
          src={userImg}
          className=" mr-3 h-12 w-12
            rounded-full border object-contain p-1  "
          alt=""
        />
        <div className=" flex-1 flex-col font-semibold">
          <p className="text-md mb-[-6px]"> {username}</p>
          <Moment className=" text-sm text-gray-400" fromNow>
            {new Date(timestamp?.toDate()).toLocaleString()}
          </Moment>
          {edited && (
            <div className="flex">
              <p className="text-xs text-gray-400">{edited}</p>{' '}
              <Moment className=" ml-1 text-xs text-gray-400" fromNow>
                {new Date(editTime?.toDate()).toLocaleString().slice()}
              </Moment>
            </div>
          )}
        </div>

        <DotsHorizontalIcon
          onClick={() => setOpen(!open)}
          className="h-10 rounded-full p-2 hover:bg-gray-200 "
        />

        {open && (
          <div
            ref={myRef}
            className={`flex-end absolute top-16 right-0 z-10  flex h-[156px] w-[140px]  flex-col justify-around rounded-md transition-all duration-300 ${
              dark ? 'bg-neutral-900 text-white' : 'bg-white'
            }  shadow-md `}
          >
            <div
              onClick={() => {
                setEditPost(true)
                setOpen(false)
              }}
              className={` it-c js icon-po ${
                dark ? 'hover:bg-gray-700' : 'hover:bg-blue-100'
              } `}
            >
              <EditIcon className="it-c tb-5 flex" />
              <p className="">Edit Post</p>
            </div>
            <div
              onClick={deletePost}
              className={` it-c js icon-po ${
                dark ? 'hover:bg-gray-700' : 'hover:bg-blue-100'
              } `}
            >
              <DeleteIcon className=" tb-5" />
              <p className="">Delete Post</p>
            </div>
            <div
              onClick={deletePost}
              className={` it-c js icon-po ${
                dark ? 'hover:bg-gray-700' : 'hover:bg-blue-100'
              } `}
            >
              <BookmarkOutlinedIcon className=" tb-5" />
              <p className="">Save Post</p>
            </div>
            <div
              onClick={() =>
                setContactId({ name: username, src: userImg, open: true })
              }
              className={` it-c js icon-po ${
                dark ? 'hover:bg-gray-700' : 'hover:bg-blue-100'
              } `}
            >
              <ChatIcon className=" tb-5 w-[26px]  " />
              <p className="flex  ">Message</p>
            </div>
          </div>
        )}
      </div>
      {editPost ? (
        <div
          ref={updateCapRef}
          className="it-c flex w-full flex-col justify-center space-y-2 p-5"
        >
          <textarea
            ref={editedInputRef}
            onChange={setUpdatedCom}
            className={`min-h-32  max-h-40 ${
              dark && 'bg-neutral-700 text-white'
            } w-full rounded-lg border-none shadow-lg`}
          >
            {caption}
          </textarea>

          <div onClick={updatePost} className="flex">
            <button
              type="submit"
              className="hover:tb-5 h-10 w-20 rounded-full bg-blue-500 text-white hover:bg-white "
            >
              Update
            </button>
          </div>
        </div>
      ) : (
        <p className="py-2 px-4">{caption}</p>
      )}

      {openPhotoModal && (
        <div className="it-c name fixed top-[0px] right-0 left-0 bottom-0 z-50 flex   justify-center bg-neutral-500 bg-opacity-50 ">
          <div
            ref={photoRef}
            className="   flex flex-col rounded-md object-contain shadow-xl"
          >
            <img
              className="  h-[400px] w-[300px] rounded-md object-contain shadow-xl transition-all duration-500 ease-in lg:h-[700px] lg:w-[800px]"
              src={images[count].data().image}
              alt=""
            />

            <div className="flex justify-center ">
              <ArrowCircleRightIcon
                onClick={() => {
                  setCount(count + 1)
                  if (count > images.length - 2) {
                    setCount(0)
                  }
                }}
                className="h-14 w-14 rotate-180 "
              />
              {hasLiked ? (
                <HeartIconFilled
                  onClick={likePost}
                  className="h-14 w-14 text-red-500"
                />
              ) : (
                <HeartIcon onClick={likePost} className="h-14 w-14" />
              )}

              <div ref={myRefComment} className=" trans relative duration-700">
                {!sendCommentModal ? (
                  <ChatIcon
                    onClick={() => setSendCommentMoadl(!sendCommentModal)}
                    className="h-14 w-14"
                  />
                ) : (
                  sendCommentModal && (
                    <div className="flex w-60">
                      <InputEmoji
                        value={comment}
                        ref={inputRef}
                        onChange={setComment}
                        placeholder=""
                      />
                      <button
                        type="submit"
                        disabled={!comment.trim()}
                        onClick={sendComment}
                        className="absolute left-36 top-[14px] w-[6px] font-semibold text-blue-400"
                      >
                        Send
                      </button>
                    </div>
                  )
                )}
              </div>
              <ArrowCircleRightIcon
                onClick={() => {
                  setCount(count - 1)
                  if (count <= 0) {
                    setCount(images.length - 1)
                  }
                }}
                className="  h-14 w-14  "
              />
            </div>
          </div>
        </div>
      )}

      {!images.length == 0 && (
        <div
          className={
            images.length > 3
              ? `flex grid-cols-3 gap-3 overflow-x-scroll scrollbar-hide lg:grid  lg:grid-rows-2 lg:gap-3 lg:overflow-x-hidden `
              : '  flex w-full space-x-6 shadow-xl   sm:overflow-x-hidden'
          }
        >
          {images.length === 1 ? (
            <img
              onClick={() => {
                setCount(0)
                setOpenPhotoModal(true)
              }}
              src={images[0].data().image}
              alt=""
              className="flex  h-[400px] w-[700px]   cursor-pointer object-cover    "
            />
          ) : (
            images.map((image, i) => (
              <img
                key={i}
                onClick={() => {
                  setCount(i)
                  setOpenPhotoModal(true)
                }}
                src={image.data().image}
                alt=""
                className=" h-[200px] w-[400px] rounded-lg object-cover shadow-xl transition-all duration-200 ease-in    "
              />
            ))
          )}
        </div>
      )}
      {session && (
        <div className="">
          <div className="flex flex-1 p-4">
            {hasLiked ? (
              <div
                onClick={likePost}
                className="it-c flex h-10 w-1/3 cursor-pointer justify-center space-x-2 rounded-lg hover:bg-slate-100"
              >
                <ThumbUpIcon onClick={likePost} className="tb-5" />
                <p className="tb-5 hidden  cursor-pointer  lg:inline-block">
                  Liked
                </p>
              </div>
            ) : (
              <div
                onClick={likePost}
                className="it-c flex h-10 w-1/3 cursor-pointer justify-center space-x-2 rounded-lg hover:bg-slate-100"
              >
                <ThumbUpOutlinedIcon
                  className="tb-5 flex cursor-pointer space-x-2"
                  onClick={likePost}
                />
                <p className="tb-5 hidden w-10  cursor-pointer lg:inline-block">
                  Like
                </p>
              </div>
            )}
            <div
              onClick={() => setCom(!com)}
              className="it-c flex h-10 w-1/3 cursor-pointer justify-center space-x-2 rounded-lg hover:bg-slate-100"
            >
              <MarkChatUnreadTwoToneIcon className="tb-5" />
              <p className="tb-5 hidden cursor-pointer lg:inline-block">
                Comment
              </p>
            </div>
            <div className="it-c flex h-10 w-1/3 cursor-pointer justify-center space-x-2 rounded-lg hover:bg-slate-100">
              <ReplySharpIcon className="pl-15 tb-5 cursor-pointer" />
              <p className="tb-5 hidden cursor-pointer lg:inline-block">
                Share
              </p>
            </div>
          </div>
        </div>
      )}

      {likes.length > 0 && (
        <div className=" flex p-4 pl-6 font-bold">
          <p className="tb-5 pr-2  text-lg ">{`${likes.length}`} </p>
          <ThumbUpIcon onClick={likePost} className="tb-5 h-3" />
        </div>
      )}
      {com && (
        <form className="it-c flex p-4">
          <img
            src={session?.user?.image}
            className=" mr-3 h-12 w-12
          rounded-full border object-contain p-1  "
            alt=""
          />
          <div className=" w-[520px] ">
            <InputEmoji
              value={comment}
              ref={inputRef}
              onChange={setComment}
              placeholder="Add a Comment..."
            />
          </div>

          <button
            type="submit"
            disabled={!comment.trim()}
            onClick={sendComment}
            className="w-[60px] font-semibold text-blue-400"
          >
            Post
          </button>
        </form>
      )}
      {comments.length > 0 && (
        <div
          className={`ml-10 flex flex-col overflow-y-scroll transition-all duration-300 ease-in scrollbar-hide ${
            comments.length > 5 && 'h-40'
          } `}
        >
          {comments.map((comment) => (
            <div key={comment.id} className="it-c mb-3 flex space-x-2">
              <img
                className="h-7 rounded-full "
                src={comment.data().userImage}
              />
              <p className="flex  text-sm">
                <span className="font-bold">{comment.data().username}</span>
              </p>
              <div className="flex flex-1">{comment.data().comment}</div>

              <Moment className="pr-5 text-sm" fromNow>
                {comment.data().timestamp?.toDate()}
              </Moment>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Post
