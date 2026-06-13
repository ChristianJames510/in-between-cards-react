export const getNewDeck = async() => {
    const response = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
    const data = await response.json();

    return data.deck_id;
}

export const drawFromDeck = async( deck_id, count ) => {
    const response = await fetch(`https://deckofcardsapi.com/api/deck/${deck_id}/draw/?count=${count}`);
    const data = await response.json();
    console.log("Remaining Cards: ", data.remaining);
    return data.cards;
}