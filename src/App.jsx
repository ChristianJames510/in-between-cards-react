import { useEffect, useState } from 'react'
import './App.css'
import { getNewDeck, drawFromDeck } from './service/api'

function App() {
  const [getDeckID, setGetDeckID] = useState(null);
  const [hand, setHand] = useState([]);
  const [playCard, setPlayCard] = useState(null);
  const [gameState, setGameState] = useState('start');
  
  // Initialize the deck on load
  useEffect(() => {
    const startSeq = async() => {
      const newDeckID = await getNewDeck();
      setGetDeckID(newDeckID);
      console.log("Deck ID saved in state:", newDeckID);
    }
    startSeq();
  }, [])

  // Action: Deal 2 cards for the spread
  const dealCards = async() => {
    try {
      setPlayCard(null);
      const cards = await drawFromDeck(getDeckID, 2);
      
      // Safety Check: Make sure cards is an array and has at least 2 items
      if (cards && cards.length >= 2) {
        setHand(cards);
        console.log("Drawn cards:", cards[0].code, "and", cards[1].code);
        setGameState('betting');
      } else {
        console.error("Failed to draw 2 cards. Received:", cards);
      }
    } catch (error) {
      console.error("Error in dealCards:", error);
    }
  }

  // Action: Deal the 3rd card (The Play)
  const playHand = async() => {
    const playedCardResult = await drawFromDeck(getDeckID, 1);
    // FIX: Save the entire card object so we can access .image
    setPlayCard(playedCardResult[0]); 
    console.log("Played card:", playedCardResult[0].code);
    setGameState('result');
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-slate-900 p-4 gap-12">
      
      {/* 1. CARD DISPLAY AREA */}
      <div className="flex items-center justify-center gap-4">
        {/* Left Boundary */}
        <div className="w-40 h-56 border border-slate-800 rounded-lg overflow-hidden bg-slate-800/20">
          {hand[0] && (
            <img src={hand[0].image} alt="left" className="w-full h-full object-contain shadow-2xl" />
          )}
        </div>

        {/* The Result Card (Middle) */}
        <div className="w-48 h-64 border-2 border-dashed border-slate-700 rounded-xl flex items-center justify-center bg-slate-800/40 shadow-inner">
          {playCard ? (
            <img src={playCard.image} alt="middle" className="w-40 animate-bounce" />
          ) : (
            <span className="text-slate-600 text-6xl font-thin">?</span>
          )}
        </div>

        {/* Right Boundary */}
        <div className="w-40 h-56 border border-slate-800 rounded-lg overflow-hidden bg-slate-800/20">
          {hand[1] && (
            <img src={hand[1].image} alt="right" className="w-full h-full object-contain shadow-2xl" />
          )}
        </div>
      </div>

      {/* 2. BUTTON CONTROLS (Bottom Middle) */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
        
        {/* PHASE: START */}
        {gameState === 'start' && (
          <button 
            onClick={dealCards} 
            className="bg-indigo-600 px-10 py-4 rounded-full font-bold text-white shadow-lg transition-all hover:bg-indigo-500 active:scale-95"
          >
            Start Game
          </button>
        )}

        {/* PHASE: BETTING (Show Bet and Fold) */}
        {gameState === 'betting' && (
          <div className="flex gap-4">
            <button 
              onClick={playHand} 
              className="bg-green-600 px-8 py-3 rounded-xl font-bold text-white hover:bg-green-500 shadow-lg transition-all active:scale-95"
            >
              BET (In-Between)
            </button>
            <button 
              onClick={dealCards} 
              className="bg-red-600 px-8 py-3 rounded-xl font-bold text-white hover:bg-red-500 shadow-lg transition-all active:scale-95"
            >
              FOLD (Next Round)
            </button>
          </div>
        )}

        {/* PHASE: RESULT (Show Next Round) */}
        {gameState === 'result' && (
          <button 
            onClick={dealCards} 
            className="bg-blue-600 px-10 py-4 rounded-full font-bold text-white shadow-lg transition-all hover:bg-blue-500 active:scale-95"
          >
            NEXT ROUND
          </button>
        )}
      </div>

    </div>
  )
}

export default App