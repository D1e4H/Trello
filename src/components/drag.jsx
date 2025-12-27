import React, { useState } from 'react';


export function Drag() {
    const [drag, dragSet] = useState(false)
    const [selected, setSelected] = useState(false)
    const [hover, setHover] = useState(false)
    const [color, setColor] = useState('purple');
    const [cardId, setCardId] = useState(null);
    const [tinyCardId, setTinyCardId] = useState(null);
    const [modal, setModal] = useState(false);
    const [card, setCard] = useState([]);
    const [typeModal, setTypeModal] = useState({ Object: false, Card: false, EditObject: false, EditCard: false });


    const handleDeleteCard = () => {
        const newCards = card.filter(c => {
            return c.id !== cardId

        })
        setCard(newCards)
    }

    const handleDeleteNote = (newid) => {
        const newCards = card.map(c => {
            if (cardId === c.id) {
                
                const newNote = c.tinyCard.filter(t => {
                    return newid !== t.id;
                });
                return {
                    ...c,
                    tinyCard: newNote
                };
            } else {
                return c;
            }
        });

        setCard(newCards);

    }

    const handleDragStart = (e, cardId) => {
        e.dataTransfer.setData("cardId", cardId);
    }

    const handleDragStartTiny = (e, cardIndex, tinyCardIndex) => {
        e.dataTransfer.setData("tinyCardIndex", tinyCardIndex);
        e.dataTransfer.setData("cardIndex", cardIndex);
    }

    const handleDropTiny = (e, targetCardIndex, targetTinyIndex) => {
        e.preventDefault();
        if (targetTinyIndex === undefined) return ;

        const sourceTinyCardIndex = parseInt(e.dataTransfer.getData("tinyCardIndex"));
        const sourceCardIndex = parseInt(e.dataTransfer.getData("cardIndex"));

        const newCard = [...card];

    [ newCard[sourceCardIndex].tinyCard[sourceTinyCardIndex], newCard[targetCardIndex].tinyCard[targetTinyIndex] ] =
    [ newCard[targetCardIndex].tinyCard[targetTinyIndex], newCard[sourceCardIndex].tinyCard[sourceTinyCardIndex] ];

    
        setCard(newCard);
    };




    const handleDrop = (e, targetId) => {
        e.preventDefault();
        const cardId = (e.dataTransfer.getData("cardId"));

        if (cardId === targetId) return;

        const cardIndex = card.findIndex(c => c.id === parseInt(cardId));
        const targetIndex = card.findIndex(c => c.id === parseInt(targetId));

        const newCard = [...card];

        [newCard[cardIndex], newCard[targetIndex]] = [newCard[targetIndex], newCard[cardIndex]];

        setCard(newCard);
    }

    return (
        <>
            <h1>Trello Clone</h1>

            <div className='cardsContainer'>
                {card.map((item, cardIndex) => (
                    <div key={`${item.id}`}className={` Card ${item.color} ${hover === item.id ? "AnimationHoverCard" : ""}  ${selected === item.id ? "SelectedCard" : ""}`} onMouseOver={() => setHover(item.id)} onMouseOut={() => setHover(false)} onClick={(e) => { e.stopPropagation(); setCardId(item.id); setSelected(item.id) }}  onDrop={ drag ? (e) => {e.stopPropagation(); handleDrop(e, item.id)} :null}  onDragOver={(e) => e.preventDefault()} onDragStart={(e) => { dragSet(true); e.stopPropagation(); handleDragStart(e, item.id)}} onDragEnd={(e) => {dragSet(false)}} draggable >
                        <div id='Title'> <h1>{item.title}</h1>  <hr ></hr>  </div>

                        <div id='Content'> {item.tinyCard.map((note, noteIndex) => (<div key={`${note.id}`} className='editContainer'><div draggable onDragOver={(e) => e.preventDefault()} onDragStart={(e) =>{ e.stopPropagation(); handleDragStartTiny(e, cardIndex, noteIndex )}} onDrop={(e) => handleDropTiny(e, cardIndex, noteIndex )}onClick={() => { setTinyCardId(note.id); setSelected(note.id) }} className={`TinyCard ${note.color} ${selected === note.id ? "done" : ""} `}> <p>{note.content}</p>  </div> <div className='divideContainer'> <button onClick={() => { setModal(true); setTypeModal({ EditObject: true }); setTinyCardId(note.id); setCardId(item.id) }} className='editNote' id={note.id} > <span className="material-symbols-outlined">
                            edit
                        </span> </button> <button className='deleteNote' onClick={() => { handleDeleteNote(note.id)}}> <span className="material-symbols-outlined">delete</span></button></div></div>))}</div>
                    </div>
                ))}
            </div>
            <div id='handleContainer'>

                <button id='cardButton' onClick={() => setTypeModal({ Card: true }, setModal(true))} > <div className='circle'>+</div>   <span>  </span></button><h2> Agregar  </h2>
                <button id='deleteButton' onClick={() => handleDeleteCard()}> <span className="material-symbols-outlined circle">delete </span> </button><h2> Borrar </h2>
                <button id='AddTinyCard' onClick={() => { card.length > 0 ? setModal(true) : setModal(false); setTypeModal({ Object: true }) }}><span className="material-symbols-outlined circle">note_stack_add</span> </button><h2> Nota</h2>
                <button id='editCardButton' onClick={() => {card.length > 0 ? setModal(true) : setModal(false); setTypeModal({ EditCard: true }) }}> <span className="material-symbols-outlined circle">edit</span> </button><h2> Editar </h2>
            </div>
            <ModelPopup
                tinyCardId={tinyCardId}
                color={color}
                setColor={setColor} card={card}
                setCardId={setCardId} setCard={setCard}
                cardId={cardId} IsOpen={modal} CloseModal={() => setModal(false)}
                ClearType={() => setTypeModal({ Object: false, Card: false, EditObject: false, EditCard: false })} Type={typeModal}
            />
        </>
    )
}

const ModelPopup = ({ color, setColor, IsOpen, CloseModal, setCard, cardId, card, Type, ClearType, tinyCardId }) => {
    const [input, setInput] = useState('');
    const [max, setMax] = useState(false)

    const handleAddCard = () => {
        if (card.length >= 15) return;
        const newCard = { id: card.length + 1, title: input, tinyCard: [], color: color };
        setCard([...card, newCard]);
    }

    const handleEditCards = () => {
        return card.map(c => {
            if (c.id === cardId) {
                return ({ ...c, title: input, color: color });

            } return c;
        })
    }

    const handleAddNote = () => {
        const newContent = { id: Date.now(), content: input, color: color };
        setCard(prevCards => prevCards.map(c => {
            if (c.tinyCard.length < 3) {
                if (c.id === cardId) {
                    return { ...c, tinyCard: [...c.tinyCard, newContent] };
                } else { return c }
            } else { return c; }
        }))
    }

    const handleEditNote = () => {
        return card.map(c => {
            if (c.id === cardId) {
                return {
                    ...c,
                    tinyCard: c.tinyCard.map(t =>
                        tinyCardId === t.id ? { ...t, content: input, color: color } : t
                    )
                }
            } return c;
        })


    }



    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input) return;
        if (Type.EditObject) {
            setCard(prevCards => (handleEditNote()));

        }
        if (Type.Object) {
            handleAddNote();

        } else if (Type.Card) {
            handleAddCard();

        } else if (Type.EditCard) {
            setCard(prevCards => (handleEditCards()));
        }
        setInput("")
        CloseModal()
    }

    const handleInput = (e) => {
        setInput(e.target.value)
        setMax(false)
        if (Type.Card || Type.EditCard) {
            if (e.target.value.length >= 10) {
                setMax(true)
            }
        } else if (e.target.value.length >= 30) {
            setMax(true)

        }
    }

        const limiteAlcanzado = card.some(c => c.tinyCard?.length >= 3);


    if (!IsOpen) return null;
    return (
        <>
            <div className='Modal' >
                <div id='ModalContent'>
                    <form onSubmit={handleSubmit}>
                        <h1>{Type.Object ? "Agregar nota" : Type.EditObject ? "Editar nota" : Type.Card ? "Agregar tarjeta" : Type.EditCard ? "Editar tarjeta" : null}</h1>
                        {max ? <span className='red'>Limite de caracteres alcanzado </span> : null}{card.length >= 15 && Type.Card ? <span className='red'>Limite de tarjetas alcanzado </span> : null}
                        {limiteAlcanzado && Type.Object ? <span className='red'>Limite de notas alcanzado </span> : null}
                        <div><input maxLength={Type.Card || Type.EditCard ? 10 : 30} onChange={handleInput} value={input}></input> </div>

                        
                            <div id='colorOptions'>
                                <button type="button" onClick={(e) => setColor("red")} className={`colorButton red ${color === "red" ? "selectedButton" : ""}`}></button>
                                <button type="button" onClick={(e) => setColor("yellow")} className={`colorButton yellow ${color === "yellow" ? "selectedButton" : ""}`}></button>
                                <button type="button" onClick={(e) => setColor("green")} className={`colorButton green ${color === "green" ? "selectedButton" : ""}`}></button>
                                <button type="button" onClick={(e) => setColor("blue")} className={`colorButton blue ${color === "blue" ? "selectedButton" : ""}`}></button>
                                <button type="button" onClick={(e) => setColor("purple")} className={`colorButton purple ${color === "purple" ? "selectedButton" : ""}`}></button>
                                <button type="button" onClick={(e) => setColor("orange")} className={`colorButton orange ${color === "orange" ? "selectedButton" : ""}`}></button>
                            </div>
                        <div className='buttonContainer'>
                            <button id='aceptar' type='submit'> Aceptar </button>
                            <button type='button' id='cancelar' onClick={() => { CloseModal(); ClearType(); setMax(false); setInput("") }}> Cancelar </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

