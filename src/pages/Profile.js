import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AiFillStar } from 'react-icons/ai'
const Profile = ({postList, isAuth, userId, deletePost, likePost, changeColor}) => {
  let navigate = useNavigate()

  const { id } = useParams()



  useEffect(() => {
    if (!isAuth) {
      navigate('/')
    }
  }, [])



  return (
    <div className='homePage'>
      { postList.map((post) => {
        if ( post.author.id === userId ) {
        let timestamp = new Date((post.date) * 1000)
        timestamp =  timestamp.toString()
          return (
            <div className='post' key={post.id}>
            <div className='postHeader'>
              <div className='title'>
                <h2 className='titleName'>{post.title}</h2>
              </div>
              <div className='deletePost'>
              <button onClick={()=> {deletePost(post.id)}}> &#128465;</button>
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
              onClick={(e) => {
                likePost(post.id, post.likes, post.likeList, post.author.id)
                changeColor(e, post.likeList, post.author.id)
                }  
              }>
                <AiFillStar />
              </div>
              <p className='likes'>{post.likes}</p>
            </div>
          </div>
          )
          }
      }) }
    </div>
  )
}

export default Profile