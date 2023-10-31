import React, { useEffect, useRef, useState } from 'react'
import { MdClose } from 'react-icons/md'
import {
  SearchIcon,
  CameraIcon,
  TrashIcon,
  PlusCircleIcon,
  UserGroupIcon,
  ChevronDownIcon,
} from '@heroicons/react/solid'
import {
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
  doc,
  snapshot,
} from 'firebase/firestore'
import { db, storage } from '../../firebase'
import { signIn, signOut, useSession } from 'next-auth/react'
import { ref, getDownloadURL, uploadString } from '@firebase/storage'
import InputEmoji from 'react-input-emoji'
import { useRecoilState } from 'recoil'
import { postModal } from '../../atoms/postModal'

import { CgYoutube } from 'react-icons/cg'
import { BiGlobe } from 'react-icons/bi'

function Modal({ dark }) {
  const { data: session } = useSession()
  const [firstName, lastName] = session?.user?.name.split(' ')
  const myRefNot = useRef()
  const fileRef = useRef(null)
  const inputRef = useRef(false)
  const [imagesUrl, setImagesUrl] = useState([])
  const [name, setName] = useState()
  const [openPostWindow, setOpenPostWindow] = useRecoilState(postModal)
  const [text, setText] = useState('')
  const [openNot, setOpenNot] = useState(false)

  const [youtubeSrc, setYoutubeSrc] = useState('')
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside2)
    return () => document.removeEventListener('mousedown', handleClickOutside2)
  })
  const handleClickOutside2 = (e) => {
    if (!myRefNot.current?.contains(e.target)) {
      setOpenPostWindow(false)
    }
  }
  const handleClickInside2 = () => setOpenNot(true)

  const handleChange = (e) => {
    for (let i = 0; i < e.target.files.length; i++) {
      const reader = new FileReader()
      const newImage = e.target.files[i]
      reader.readAsDataURL(newImage)
      reader.onload = (readerEvent) => {
        const imageUrl = readerEvent.target.result
        setImagesUrl((prevState) => [...prevState, imageUrl])
      }
    }
  }


const uploadImage = async (e) => {
     setName(false);
    setOpenPostWindow(false);
      setText("")
  try {
    e.preventDefault();

    const docRef = await addDoc(collection(db, 'posts'), {
      username: session.user.name,
      caption: text,
      profileImg: session.user.image,
      timestamp: serverTimestamp(),
    });


  } catch (error) {
    console.error("An error occurred while uploading images:", error);

  } finally {

 
    
  }
};

const removeImage = () => {
  setImagesUrl([]);
  setName(false);
};

const removeImageUrl = (idx) => {
  const temp = [...imagesUrl];
  temp.splice(idx, 1);
  setImagesUrl(temp);
};


  return (
    <div className="fixed top-[68px] right-0 left-0 bottom-0 z-50 flex items-center justify-center bg-neutral-500 bg-opacity-30">
      <div
        ref={myRefNot}
        onClick={handleClickInside2}
        className={`flex  w-[360px] flex-col rounded-xl md:w-[500px] ${
          dark ? 'bg-cg text-white' : 'bg-white text-gray-500'
        } shadow-2xl transition-all duration-700 ease-in  lg:h-fit`}
      >
        <div className=" flex h-fit flex-col  ">
          <div className="border-shadow-xl flex h-[60px]  items-center border-b-[1px]  ">
            <div className="ml-[36px] flex flex-1 justify-center text-xl font-semibold text-blue-500 ">
              {' '}
              Create Post{' '}
            </div>
            <MdClose
              onClick={() => setOpenPostWindow(false)}
              className=" mr-2 flex h-9  w-9 cursor-pointer rounded-full p-1 text-blue-500 hover:bg-gray-200"
            />
          </div>
          <div className=" ml-2  flex h-[75px] items-center space-x-3">
            <img
              className=" flex h-[50px] w-[50px] cursor-pointer rounded-full   border-2 border-blue-100 "
              src={session?.user.image}
              alt=""
            />
            <div className="">
              <div className="text-sm">{`${firstName} ${lastName}`}</div>
              <div className="curser-pointer flex  items-center rounded-3xl bg-gray-200 p-1 hover:bg-gray-100 ">
                <BiGlobe classname="h-[3px]w-[3px] " />
                <div className="flex justify-center rounded-md  text-xs text-cg">
                  Public
                </div>
                <ChevronDownIcon className="h-4 " />
              </div>
            </div>
          </div>
        </div>
        <div className="flex h-fit flex-col">
          <div className=" flex h-fit flex-col break-words p-2 text-3xl scrollbar-hide ">
            <InputEmoji
              value={text}
              ref={inputRef}
              onChange={setText}
              placeholder={`What's on your Mind, ${firstName}`}
            />
          </div>

          <div className="ml-4 flex h-fit overflow-x-scroll p-2 scrollbar-hide ">
            <div className="flex items-center justify-center space-x-5">
              {imagesUrl.map((imageUrl, i) => (
                <div
                  key={i}
                  className="flex h-[110px] w-[110px] items-center justify-center "
                >
                  <img
                    className="transiton-all  h-20 w-20 rounded-lg object-cover duration-500 ease-in-out hover:scale-110 "
                    src={imageUrl}
                  />
                  <div>
                    <MdClose
                      className="h-7 w-7 font-bold text-blue-500 transition-all duration-500 ease-in hover:ml-5 hover:rotate-180  hover:scale-150 hover:text-red-600 "
                      onClick={() => removeImageUrl(i)}
                    />
                  </div>
                </div>
              ))}
              <PlusCircleIcon
                onClick={() => fileRef.current.click()}
                className=" h-14 w-14  pr-3"
              />
            </div>
          </div>
        </div>
        <div className="flex h-[142px] flex-col p-1 ">
          <div className=" ml-4 mr-4 flex h-1/2 items-center justify-between rounded-md sm:sm:justify-center md:justify-evenly   ">
            <div className="ml-2 hidden w-fit text-sm md:inline-block ">
              Add to your post{' '}
            </div>
            <div className="flex space-x-1 ">
              <CameraIcon
                onClick={() => fileRef.current.click()}
                className="text-fb h-11 rounded-full p-1 text-fbb hover:bg-gray-300 "
              />

              <UserGroupIcon className="h-11 rounded-full p-1 text-fby hover:bg-gray-300 " />
              <CgYoutube
                style={{ fontSize: '3em' }}
                className="  rounded-full p-1 text-fbp hover:bg-gray-300 "
              />
              <TrashIcon
                onClick={removeImage}
                className="h-11 rounded-full p-1 text-fbg hover:bg-gray-300 "
              />
              <SearchIcon className="h-11 rounded-full p-1 text-fbo hover:bg-gray-300 " />
              <input
                ref={fileRef}
                hidden
                multiple
                type="file"
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            disabled={!text.trim() && imagesUrl.length < 1}
            type="submit"
            onClick={uploadImage}
            className={`m-3 flex h-1/2 flex-1 cursor-pointer flex-col items-center justify-center rounded-md ${
              !text.trim() && imagesUrl.length < 1
                ? 'bg-gray-500 text-white '
                : 'bg-blue-500 text-white'
            }`}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  )
}

export default Modal
