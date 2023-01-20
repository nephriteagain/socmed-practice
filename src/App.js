import {useState, useEffect} from 'react'
import './App.css';
import { BrowserRouter as Router,  Routes, Route, Link } from 'react-router-dom'
import { v4 as uuid } from 'uuid';
import { deleteDoc, doc, addDoc, collection, Timestamp, updateDoc, arrayUnion, arrayRemove, getDocs, setDoc } from 'firebase/firestore';
import { db, auth } from './firebase'


import Home from './pages/Home';
import Login from './pages/Login';
import CreatePost from './pages/CreatePost';
import Profile from './pages/Profile';


function App() {

  const [ reFetch, setReFetch ] = useState(true)
  const [ isAuth, setIsAuth ] = useState(localStorage.getItem("isAuth"))
  const [ userId, setUserId ] = useState(localStorage.getItem('userId'))
  const [ postList, setPostList ] = useState([])
  const [ myPost, setmyPost ] = useState([])

  const [title, setTitle] = useState('')
  const [postText, setPostText] = useState('')



    const createPost = async () => {
        if ( title.length > 0 && postText.length > 1 && postText.length <= 500 ) {

        const uniqueId = uuid()
        await setDoc(doc(db, 'post', uniqueId), {
            title,  
            postText,
            likeList: [],
            date: Timestamp.fromDate(new Date()),
            author: {
                name: auth.currentUser.displayName,
                id: auth.currentUser.uid
            }
        })
        .then(() => {
          setDoc(doc(db, `profilePost-${auth.currentUser.uid}`, uniqueId), {
            title,  
            postText,
            likeList: [],
            date: Timestamp.fromDate(new Date()),
            author: {
                name: auth.currentUser.displayName,
                id: auth.currentUser.uid
            }
        })
        }).then(() => {
          setReFetch(true)
          setPostText('')
          setTitle('')
          console.log('post created')
        })
        
      

      } 
      if (title.length === 0 || postText.length === 0) {
        alert('Title or Post cannot be empty!!!')

      }
      if (postList.length > 501) {
        alert('Maximum text exceeded(500 characters)')
      }
      
    }


    const likePost = async (postId, likeList, personWhoLiked, personName) => {
      if (isAuth) {
        const userDoc = doc(db, 'post', postId)
        const userProfileDoc = doc(db, `profilePost-${auth.currentUser.uid}`, postId)
        
        const notYetLiked = likeList.some((likes) => {
          return likes.likerId === personWhoLiked
        })

        
        if (!notYetLiked) {
          await updateDoc(userDoc, {
            likeList: arrayUnion({
              likerId: personWhoLiked,
              likerName: personName
            })
          }).then(() => {
            updateDoc(userProfileDoc, {
              likeList: arrayUnion({
                likerId: personWhoLiked,
                likerName: personName
              })
            })
          }).then(() => setReFetch(true))

        } else {
          await updateDoc(userDoc, {
            likeList: arrayRemove({
              likerId: personWhoLiked,
              likerName: personName
            })
          }).then(() => {
            updateDoc(userProfileDoc, {
              likeList: arrayRemove({
                likerId: personWhoLiked,
                likerName: personName
              })
            })
          }).then(() => setReFetch(true))

        }
      }
    }




    const deletePost = async (id) => {
    const postDoc = doc(db, "post", id)
    const ProfilePostDoc = doc(db, `profilePost-${auth.currentUser.uid}`, id)
    await deleteDoc(postDoc).then(() => deleteDoc(ProfilePostDoc))
    setReFetch(true)
  }

  // this useState is to prevent and infinite fetching bug idk how to fix lul
    useEffect(()=> {
      if (reFetch) {
      const postsCollectionRef = collection(db, 'post')
      setReFetch(false)
      const getPosts = async () => {
      const data = await getDocs(postsCollectionRef)
      setPostList(
        data.docs
        .map((doc) => ({...doc.data(), id: doc.id}))
        .sort((a, b) => {
          return b.date - a.date
        })
      )
    }
    getPosts()
    const getMyPosts = async () => {
      if (isAuth === true) {
        const profilePostCollectionRef =  collection(db, `profilePost-${auth.currentUser.uid}`)
        const data = await getDocs(profilePostCollectionRef)
        setmyPost(
          data.docs
          .map((doc) => ({...doc.data(), id: doc.id}))
          .sort((a, b) => { 
            return  b.date - a.date  
          })
        )
      }
      
      
    }
    getMyPosts()
    }
  }, [reFetch])
  


  return (
    <Router>
      <nav>
        <Link to='/'> Home</Link>
        { !isAuth ? <Link to='/login'> Login</Link> :
        <Link to='/createpost'> Create</Link>
        }
      </nav>


      <Routes>
        <Route exact path='/' element={
          <Home 
            isAuth={isAuth} 
            setIsAuth={setIsAuth} 
            postList={postList} 
            setPostList={setPostList} 
            userId={userId} 
            deletePost={deletePost}
            likePost={likePost}

          />}
        />
        <Route path='/createpost' element={
          <CreatePost 
          isAuth={isAuth} 
          createPost={createPost}
          setPostText={setPostText}
          setTitle={setTitle}
          title={title}
          postText={postText}
          />} 
        />
        { !isAuth && 
        <Route path='/login' element={
          <Login 
            setIsAuth={setIsAuth} 
            setUserId={setUserId}
          />} 
        /> 
      }
        <Route path={`profile/user/:id`} element={
          <Profile 
            postList={postList} 
            isAuth={isAuth} 
            userId={userId} 
            deletePost={deletePost}
            likePost={likePost}
            myPost={myPost}
            setmyPost={setmyPost}
            reFetch={reFetch}
            setReFetch={setReFetch}
          />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
