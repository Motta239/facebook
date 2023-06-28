import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { db } from '../../firebase'
import Post from './Post'
import { SpinnerCircular } from 'spinners-react'
function Posts() {
  const [posts, setPosts] = useState([])
 
  // fetching posts from firebase
  useEffect(
    () =>
      onSnapshot(
        query(collection(db, 'posts'), orderBy('timestamp', 'desc')),
        (snapshot) => {
          setPosts(snapshot.docs)
          
        }
      ),
    
    [db]
  )

  return (
    <div className="flex w-full items-center justify-center ">
      {posts.length >= 1 ? (
        <div className="flex w-full flex-col">
          {posts.map((post, i) => (
            <div key={i} className="">
              <Post
                id={post.id}
                username={post.data().username}
                img={post.data().image}
                userImg={post.data().profileImg}
                caption={post.data().caption}
                timestamp={post.data().timestamp}
                edited={post.data().edited}
                editTime={post.data().editTime}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className=" flex flex-col items-center justify-start space-y-3">
          <p className="mt-10 flex items-center justify-center text-xl text-gray-500 ">
            fetching Posts...{' '}
          </p>
          <SpinnerCircular color={'#1877f2'} speen={50} />
        </div>
      )}
    </div>
  )
}

export default Posts
