


import { useNavigate, Link } from 'react-router-dom'

import {  auth } from '../firebase'
import { signOut } from 'firebase/auth'

import {AiFillStar} from 'react-icons/ai'

function Home({ isAuth, setIsAuth, postList,  userId,  deletePost, likePost }) {
  let navigate = useNavigate()


  const signUserOut = () => {
    signOut(auth).then(()=> {
      localStorage.clear()
      setIsAuth(false)
      navigate('/')
    })
  }


  // this has no dependency becareful using this one




  return (
    <div className='homePage'>
       { isAuth && 
       <>
       <button 
            onClick={signUserOut} 
            className='btn-logout'>
               Log Out
         </button>
         <div className='btn-profile'>
         <Link to={
          `/profile/user/${userId}`
          } > Profile</Link>
         </div>
        </>
        }

      {postList.map((post) => {
        let timestamp = post.date.seconds * 1000
        timestamp = new Date(timestamp)
        timestamp =  timestamp.toString()
        const index = timestamp.indexOf('G')
        timestamp = timestamp.substring(0, index)

          const alreadyLiked =  post.likeList.some((like) => {
            if (!isAuth) return false
            return like.likerId === auth.currentUser.uid
          })

        const starOpacity = () => {
          if (alreadyLiked) {
          } else return {opacity: '0.65'}
        }
        const likeList = post.likeList.map((item) => {
          return item.likerName
        })

        return (
          <div className='post' key={post.id}>
            <div className='postHeader'>
              <div className='title'>
                <h2 className='titleName'>{post.title}</h2>
              </div>
              <div className='deletePost'>
                { isAuth && post.author.id === auth.currentUser.uid &&<button onClick={()=> {
                  deletePost(post.id)}}> &#128465;</button>}
              </div>
            </div>
            <hr />
            <div className='postTextContainer'>
              {post.postText}
            </div>
            <h4>@{post.author.name}</h4>
            <p className='postDate'>{timestamp}</p>
            <div className='react'>
              <div className='star' 
              data-likers={likeList}
              onClick={(e) => {
                likePost(post.id, post.likeList, auth.currentUser.uid, auth.currentUser.displayName)
                }
              }>
                <AiFillStar  style={isAuth && starOpacity()}   />
              </div>
              <p className='likes'
              >{post.likeList.length}
              </p>
              <div className='likeList'>
                {likeList.map((item, index)=> {
                  return (
                    <p key={index}>{item}</p>
                  )
                })}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Home