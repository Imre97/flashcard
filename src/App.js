import React, { useState, useEffect, useRef } from 'react'
import './App.css';
import FlashcardList from './FlashcardList'
import axios from 'axios'


function App() {

  const [flashcards, setFlashcards] = useState([])
  const [categories, setCategories] =useState([])

  const categoryEl = useRef()
  const amountEl = useRef()


  useEffect(() => {
    axios
      .get('https://opentdb.com/api_category.php')
      .then(res => {
        setCategories(res.data.trivia_categories)
      })
  }, [])

  
  function stringDecoder(str) {
    const textArea = document.createElement('textarea')
    textArea.innerHTML = str
    return textArea.value
  }

  function handelSubmit(e) {
    e.preventDefault()
    axios
    .get('https://opentdb.com/api.php', {
      params:{
        amount: amountEl.current.value,
        category: categoryEl.current.value
      }
    })
    .then(res => {
      setFlashcards(res.data.results.map((questionItem, index) => {
        const answer = stringDecoder(questionItem.correct_answer)
        const options = [...questionItem.incorrect_answers.map(a => stringDecoder(a)), answer]
        return{
          id: `${index}-${Date.now()}`,
          question: stringDecoder(questionItem.question),
          answer: answer,
          options: options.sort(() => Math.random() - .5)
        }
      }))
    })
  }

  return (
    <>
      <form className='header' onSubmit={handelSubmit}>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select id="category" ref={categoryEl} onChange={() => setFlashcards([])}>
            {categories.map(category => {
              return <option value={category.id} key={category.id}>{category.name}</option>
            })}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="amount">Number of Question</label>
          <input type="number" id="amount" defaultValue={10} min='1' step='1' ref={amountEl} />
        </div>
        <div className="form-group">
          <button className='btn'>Generate</button>
        </div>
      </form>
      <div className="container">
        <FlashcardList flashcards={flashcards} />
      </div>
    </>  
  );
}
export default App;
