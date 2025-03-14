import { useState } from "react"
import {clsx} from "clsx"
import { languages } from "./languages" // gives us access to the languages array from the languages folder
import { getFarewellText, getRandomWord } from "./utils"
import Confetti from "react-confetti"


export default function AssemblyEndgame() {
//state values 
    const [currentWord, setCurrentWord] = useState(()=> getRandomWord()) // the useState("") contenets will be what is passed into the variable set in the the array index of 0 not function which is in the first index.
    const [guessedLetters, setGuessedLetters] = useState([])
//derived values 
    const numGuessesLeft = languages.length - 1 
    const wrongGuessesCount = // declaring a variable that will look at the variable from state of guessedLetters 
      guessedLetters.filter(letter => !currentWord.includes(letter)).length //and will filter to see if the variable from state currentWords does not have the letter and will return the length or the number of wrong guessed letters 
    
    const isGameWon = 
      currentWord.split("").every(letter =>guessedLetters.includes(letter))

    const isGameLost = 
      wrongGuessesCount >= numGuessesLeft

    const isGameOver = isGameWon || isGameLost

    const lastGuessedLetter = guessedLetters[guessedLetters.length - 1]
    const isLastGuessIncorrect = lastGuessedLetter && !currentWord.includes(lastGuessedLetter)
   

  
//static values 
     const alphabet = "abcdefghijklmnopqrstuvwxyz" // this is a variable with one string that contains the alphabet in order a-z

    function addGuessedLetter(letter) { //we are declaring a function that take in the parameter of letter from the button on the keyboard 
      setGuessedLetters(prevLetters => //we are calling the setGussedLetter function from useState and passing a paramter of prevLetters
        prevLetters.includes(letter) ? // we are using the arrow function and a ternary to evaluate if the element includes parameter from parent function
        prevLetters :  // return the parameter from child function if true
        [...prevLetters, letter] // return the array from paramter from child function that is a new one and store it with the parameter from the parent function if false
      )
     }

     function startNewGame(){
        setCurrentWord(getRandomWord())
        setGuessedLetters([])
     }

    const languageElements = languages.map((lang ,index)=> { // taking the languages array from the languages.js file and iterating over it while also setting it as an object with the properties of backgroundColor and color 
        const isLanguageLost = index < wrongGuessesCount  //declaring a variable that is set to the result of the array index being less than the wrongGuessesCount variable
        const styles = {
            backgroundColor: lang.backgroundColor, //saying for each element from the array will have a background color from iteslf 
            color: lang.color //saying for each element from the array will have a color from iteslf 
        }
        const className = clsx("chip", isLanguageLost && "lost")
        return (
            <span 
              className={className}
              style={styles}
              key={lang.name} // grabbing the property from the array of objects
            >
              {lang.name} {/* passing the name where the span is */}
            </span>
        )
     })

     const letterElements = currentWord.split("").map((letter, index) => {
      const shouldRevealLetter = isGameLost || guessedLetters.includes(letter)
      const letterClassName = clsx(
          isGameLost && !guessedLetters.includes(letter) && "missed-letter"
      )
      return (
          <span key={index} className={letterClassName}>
              {shouldRevealLetter ? letter.toUpperCase() : ""}
          </span>
      )
  })
    const keyboardElements = alphabet.split("").map(letter =>{ // will happen everytime we render we are declaring a new variable taht will take the variable of alphabet and split all of the letter to be in their own string. we then map over all of them 
      const isGuessed = guessedLetters.includes(letter) //we are declaring a variable that looks at variable state guessedLetters and checks if it is included in the letter from the map
      const isCorrect = isGuessed && currentWord.includes(letter) //we are declaring a variable that looks the isGuessed variable and the current word state variable and checks if the letter is included in the current word
      const isWrong = isGuessed && !currentWord.includes(letter) //we are declaring a variable that looks the isGuessed variable and the current word state variable and checks if the letter is not included in the current word
      const className = clsx({ //we are declaring a variable that will take the clsx function and pass in an object with the properties of correct and wrong and the values being the variables we declared above
          correct: isCorrect, //returns if isCorrect is true 
          wrong: isWrong //returns if isWrong is true 
      })
      
      console.log(className)
      
      return (
          <button
              className={className} // we are saying that the value that comes out of className variable will be the value in of the className property
              key={letter} // we are saying that the key will be the letter from the map
              disabled ={isGameOver}
              aria-disabled={guessedLetters.includes(letter)}
              aria-label={`Letter ${letter}`}
              onClick={() => addGuessedLetter(letter)} // we are saying that the onClick will call the addGuessedLetter function with its paramter being the button clicked letter
          >
              {letter.toUpperCase()}
          </button> // we are saying that for each element make its key itself, call the addGuessedLetter function with its paramter being the button clicked letter and as the button make it show its letter as an uppercase 
    )
      })
      const gameStatusClass = clsx("game-status", {
        won: isGameWon, //returns if isGameWon is true 
        lost: isGameLost, //returns if isGameLost is true 
        farewell: !isGameOver && isLastGuessIncorrect //returns if isLastGuessIncorrect is true 
      })

function renderGameStatus() { //running a function for conditional rendering
  if (!isGameOver && isLastGuessIncorrect) {
    return (
        <p 
            className="farewell-message"
        >
            {getFarewellText(languages[wrongGuessesCount - 1].name)}
        </p>
    )
}
if (isGameWon) {
    return (
        <>
            <h2>You win!</h2>
            <p>Well done! 🎉</p>
        </>
    )
} 
if (isGameLost) {
    return (
        <>
            <h2>Game over!</h2>
            <p>You lose! Better start learning Assembly 😭</p>
        </>
    )
}
return null
}

return (
        <main>
          {
            isGameWon && 
            <Confetti
              recycle ={false}
              numberOfPieces={1000}
              />
          }
            <header>
                <h1>Assembly: Endgame</h1>
                <p>Guess the word within 8 attempts to keep the
                programming world safe from Assembly!</p>
            </header>

            <section aria-live ="polite" role ="status" className={gameStatusClass}>
                {renderGameStatus()}
            </section>

            <section className="language-chips">
                {languageElements} {/* passing in the declared variable from above */}
            </section>
            <section className="word">
              {letterElements}
            </section>
            <section 
                className="sr-only" 
                aria-live="polite" 
                role="status"
            >
                <p>
                    {currentWord.includes(lastGuessedLetter) ? 
                        `Correct! The letter ${lastGuessedLetter} is in the word.` : 
                        `Sorry, the letter ${lastGuessedLetter} is not in the word.`
                    }
                    You have {numGuessesLeft} attempts left.
                </p>
                <p>Current word: {currentWord.split("").map(letter => 
                guessedLetters.includes(letter) ? letter + "." : "blank.")
                .join(" ")}</p>
            
            </section>
            <section className="keyboard">
             {keyboardElements} {/*passing in the declared variable from above so it will run*/}
            </section>
            {isGameOver && <button className ="new-game" onClick={startNewGame}>New Game</button>}
        </main>
    )
}