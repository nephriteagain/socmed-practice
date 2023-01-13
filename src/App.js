import {useState, useEffect} from 'react'
import './App.css';
import { BrowserRouter as Router,  Routes, Route, Link } from 'react-router-dom'

import { deleteDoc, doc, addDoc, collection, Timestamp, updateDoc } from 'firebase/firestore';
import { db, auth } from './firebase'


import Home from './pages/Home';
import Login from './pages/Login';
import CreatePost from './pages/CreatePost';
import Profile from './pages/Profile';
import { getDocs } from 'firebase/firestore';

function App() {

  const [ reFetch, setReFetch ] = useState(true)
  const [ isAuth, setIsAuth ] = useState(localStorage.getItem("isAuth"))
  const [ userId, setUserId ] = useState(localStorage.getItem('userId'))
  const [ postList, setPostList ] = useState([])

  const [title, setTitle] = useState('')
  const [postText, setPostText] = useState('')

  const postsCollectionRef = collection(db, 'post')


    const createPost = async () => {
        if ( title.length > 0 && postText.length > 1 && postText.length <= 500 ) {

        
        await addDoc(postsCollectionRef, {
            title,
            postText,
            likes: 0,
            date: Timestamp.fromDate(new Date()),
            author: {
                name: auth.currentUser.displayName,
                id: auth.currentUser.uid
            }
        })
        setReFetch(true)
        setPostText('')
        setTitle('')
      } 
      if (title.length === 0 || postText.length === 0) {
        alert('Title or Post cannot be empty!!!')

      }
      if (postList.length > 501) {
        alert('Maximum text exceeded(500 characters)')
      }
      
    }


    const likePost = async (id, likes) => {
      if (isAuth) {
        
        const userDoc = doc(db, 'post', id)
        const newFields = { likes: likes + 1 }
        await updateDoc(userDoc, newFields).then((res) => {
          setReFetch(true)
        })
      }
    }



  const changeColor = (e, likes) => {
    if (isAuth) {
      if (likes.length) {
        e.target.style.color = 'orange'
      } else {
        e.target.style.color = 'yellow'
      }
    }
  }


    const deletePost = async (id) => {
    const postDoc = doc(db, "post", id)
    await deleteDoc(postDoc)
    setReFetch(true)
  }

  // this useState is to prevent and infinite fetching bug idk how to fix lul
    useEffect(()=> {
    if (reFetch) {
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
            changeColor={changeColor}
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
            changeColor={changeColor}
          />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
