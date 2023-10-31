import Head from 'next/head'
import Feed from '../components/Feed'
import Sidebar from '../components/Sidebars/Sidebar'
import Modal from '../components/Sidebars/Modal'
import Messanger from '../components/Messager'
import { useRecoilState } from 'recoil'
import { darkMode } from '../atoms/darkMode'
import { postModal } from '../atoms/postModal'

function Home() {
  const [dark, setDark] = useRecoilState(darkMode)
  const [openPostWindow, setOpenPostWindow] = useRecoilState(postModal)

  return (
    <div className={`min-h-[100vh] flex justify-center ${dark ? 'bg-zinc-800' : 'bg-gray-200'}`}>
      <Head>
        <title>Facebook</title>
        <link rel="icon" href="/icons8-facebook.svg" />
      </Head>

      <div className=" relative flex hidden lg:flex items-center lg:space-x-2">
        <Sidebar />
      </div>
      <div className=" items-center w-screen lg:w-fit ">
        <Feed />
        </div>
      {<Messanger />}
      {openPostWindow && <Modal />}
    </div>
  )
}

export default Home

{
  /* <div
style={{ top: top, left: left }}
className={` fixed flex h-14 w-fit cursor-pointer items-center justify-around rounded-md bg-blue-200 p-2  shadow-xl transition-all duration-1000 ease-out focus:rotate-180 `}
>
<ArrowCircleDownIcon className="icon-floater text-fby" />
<RiYoutubeFill className="icon-floater text-ytr " />
<RiSpotifyFill className=" icon-floater text-fbg " />
<RiGoogleFill className=" icon-floater text-blue-800 " />
<CgAppleWatch className="icon-floater text-gray-600 " />
{move ? (
  <BiLockOpen
  onClick={() => setMove(!move)}
  className="icon-floater hover:text-blue-800 "
  />
  ) : (
    <LockClosedIcon
    onClick={() => setMove(!move)}
    className="icon-floater hover:text-blue-400 "
    />
    )}
  </div> */
}
// onClick={(event) => {
//   if (move) {
//     setTop(event.clientY - 20)
//     setleft(event.clientX - 200)
//   }
// }}
// const [left, setleft] = useState(300)
// const [top, setTop] = useState(300)
// const [move, setMove] = useState(false)
// const ref = useRef()

// console.log(top, left)
