import { useRef, useEffect,  } from 'react'
import { useNavigate } from 'react-router-dom'


function CreatePost({ isAuth, createPost, setPostText, setTitle, title, postText }) {
    let navigate = useNavigate()

    const createRef = useRef()
    const postRef = useRef()
    const inputRef = useRef()
    const textAreaRef = useRef()
    const textBarRef = useRef()

const handleTitle = () => {
        const length = Number(title.length) * 2.5
        const color = 150 - length
        const rgb = `rgb(${color}, 255, ${color})`
        createRef.current.style.color = rgb

}

const handlePost = () => {
    // for the PostRef
    const length = Number(postText.length)
    const color = 205 - length *  0.4
    const rgb = `rgb(${color}, ${color}, 255)`
    postRef.current.style.color = rgb
    
    // for the textBarRef
    const length2 = Number(postText.length)
    const width = `${length2 / 5}%`
    textBarRef.current.style.width = width;

}

useEffect(() => {
    title.length && handleTitle()
  }, [ title])

useEffect(() => {
    postText.length && handlePost()
}, [postText])
 

    

    useEffect(()=> {
        if (!isAuth) {
            navigate('/login')
        }
    }, [])


    return (
        <div className='createPostPage'>
            <div className='cpContainer'>
                <h1><span ref={createRef}>Create</span> a <span ref={postRef}>Post</span></h1>
                <div className='inputGp'>
                    <label> Title:</label>
                    <input placeholder='Title...'
                    ref={inputRef}
                    maxLength="80"
                    onChange={(e)=> {
                        setTitle(e.target.value)
                    }}
                />
                </div>
                <div className='inputGp'>
                    <label> Post:</label>
                    <textarea placeholder='Post...'
                        maxLength='500' 
                        ref={textAreaRef}
                    onChange={(e) => {
                        setPostText(e.target.value)
                    }}
                    />
                </div>
                <div className='inputGp submit-div'>
                    <button onClick={() =>{
                    createPost()
                    navigate('/')
                    }}> 
                Submit Post
                </button>
                <div className='text-bar' ref={textBarRef}>
                    <div className='green'></div>
                    <div className='yellow-green'></div>
                </div>
                </div>
                
            </div>
        </div>
    )
}

export default CreatePost