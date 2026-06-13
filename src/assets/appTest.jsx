import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { getNewDeck, drawFromDeck } from './service/api'

function App() {
  const [getDeckID, setGetDeckID] = useState(null);
  const [hand, setHand] = useState([]);
  const [playCard, setPlayCard] = useState(null);
  const [gameState, setGameState] = useState('start');
  
  useEffect(() => {
    const startSeq = async() => {
      const newDeckID = await getNewDeck();
      
      setGetDeckID(newDeckID);
      console.log("Deck ID saved in state:", newDeckID);
    }

    startSeq();
  }, [])

  const dealCards = async() => {
    setPlayCard(null);
    const drawnCard = await drawFromDeck(getDeckID, 2)
    setHand(drawnCard);
    console.log("Drawn card from Deck ID: ", getDeckID)
    console.log("Drawn card is: ", drawnCard[0].code);
    console.log("Drawn card is: ", drawnCard[1].code);
    setGameState('betting');
  }

  const playHand = async() => {
    const playedCard = await drawFromDeck(getDeckID, 1)
    setPlayCard(playedCard[0].code);
    console.log(playedCard[0].code);
    setGameState('result');
  }


  return (
    <div className="flex h-screen flex-row items-center justify-center bg-slate-900 p-4 gap-6">
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
      
      {gameState === 'start' && (
        <button onClick={dealCards} className="bg-indigo-600 px-10 py-4 rounded-full font-bold text-white shadow-lg">
          DEAL SPREAD
        </button>
      )}

      {gameState === 'betting' && (
        <div className="flex gap-4">
          <button onClick={playHand} className="bg-green-600 px-8 py-3 rounded-xl font-bold text-white hover:bg-green-500 shadow-lg">
            BET (In-Between)
          </button>
          <button onClick={() => setGameState('start')} className="bg-red-600 px-8 py-3 rounded-xl font-bold text-white hover:bg-red-500 shadow-lg">
            FOLD
          </button>
        </div>
      )}

      {gameState === 'result' && (
        <button onClick={dealCards} className="bg-blue-600 px-10 py-4 rounded-full font-bold text-white shadow-lg">
          NEXT ROUND
        </button>
      )}
    </div>

    <div className="flex items-center justify-center gap-4">
      {/* Left Boundary */}
      {hand[0] && (
        <img src={hand[0].image} alt="left" className="w-40 shadow-2xl rounded-lg" />
      )}

      {/* The Result Card (Middle) */}
      <div className="w-48 h-64 border-2 border-dashed border-slate-700 rounded-xl flex items-center justify-center bg-slate-800/20">
        {playCard ? (
          <img src={plaCard.image} alt="middle" className="w-40 animate-bounce" />
        ) : (
          <span className="text-slate-600 text-4xl">?</span>
        )}
      </div>

      {/* Right Boundary */}
      {hand[1] && (
        <img src={hand[1].image} alt="right" className="w-40 shadow-2xl rounded-lg" />
      )}
    </div>
  </div>
  )
}

export default App
