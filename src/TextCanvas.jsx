import React, { useState, useRef } from 'react';

const TextCanvas = () => {
  const [texts, setTexts] = useState([]);
  const [selectedText, setSelectedText] = useState(null);
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [newText, setNewText] = useState(''); // State for text input
  const [action, setAction] = useState(''); // State to track current action

  const canvasRef = useRef(null);

  // Handle adding new text
  const addText = () => {
    if (newText.trim()) {
      const textObject = {
        id: texts.length + 1,
        content: newText,
        x: 150,
        y: 150,
        fontSize: 20,
        fontFamily: 'Arial',
      };
      saveHistory();
      setTexts([...texts, textObject]);
      setNewText(''); // Reset the input field
    }
  };

  // Handle moving text
  const startDrag = (id) => {
    if (action === 'move') {
      setSelectedText(id);
    }
  };

  const moveText = (e) => {
    if (selectedText && action === 'move') {
      const newTexts = texts.map((text) => {
        if (text.id === selectedText) {
          return {
            ...text,
            x: e.clientX - canvasRef.current.offsetLeft,
            y: e.clientY - canvasRef.current.offsetTop,
          };
        }
        return text;
      });
      setTexts(newTexts);
    }
  };

  const stopDrag = () => {
    if (selectedText && action === 'move') {
      saveHistory();
      setSelectedText(null);
    }
  };

  // Change font size
  const changeFontSize = (e, id) => {
    const newTexts = texts.map((text) => {
      if (text.id === id) {
        return { ...text, fontSize: e.target.value };
      }
      return text;
    });
    saveHistory();
    setTexts(newTexts);
  };

  // Change font family
  const changeFontFamily = (e, id) => {
    const newTexts = texts.map((text) => {
      if (text.id === id) {
        return { ...text, fontFamily: e.target.value };
      }
      return text;
    });
    saveHistory();
    setTexts(newTexts);
  };

  // Save history for undo/redo
  const saveHistory = () => {
    setHistory([...history, texts]);
  };

  // Undo functionality
  const undo = () => {
    if (history.length > 0) {
      setRedoStack([texts, ...redoStack]);
      setTexts(history[history.length - 1]);
      setHistory(history.slice(0, history.length - 1));
    }
  };

  // Redo functionality
  const redo = () => {
    if (redoStack.length > 0) {
      setHistory([...history, texts]);
      setTexts(redoStack[0]);
      setRedoStack(redoStack.slice(1));
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <div>
        <button onClick={undo}>Undo</button>
        <button onClick={redo}>Redo</button>
      </div>

      <div
        ref={canvasRef}
        onMouseMove={moveText}
        onMouseUp={stopDrag}
        style={{
          border: '1px solid black',
          height: '400px',
          width: '600px',
          margin: '50px auto',
          position: 'relative',
          overflow: 'hidden',
          cursor: action === 'move' ? 'move' : 'default',
        }}
      >
        {texts.map((text) => (
          <div
            key={text.id}
            onMouseDown={() => startDrag(text.id)}
            style={{
              position: 'absolute',
              top: text.y,
              left: text.x,
              fontSize: `${text.fontSize}px`,
              fontFamily: text.fontFamily,
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            {text.content}
          </div>
        ))}
      </div>

      <div style={{ marginTop: '20px' }}>
        <button onClick={() => setAction('add')}>Add Text</button>
        <button onClick={() => setAction('move')}>Move Text</button>
        <button onClick={() => setAction('font')}>Change Font</button>

        {action === 'add' && (
          <div style={{ marginTop: '20px' }}>
            <input
              type="text"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="Enter text"
            />
            <button onClick={addText}>Submit Text</button>
          </div>
        )}

        {selectedText && action === 'font' && (
          <div style={{ marginTop: '20px' }}>
            <label>
              Font Size:
              <input
                type="number"
                value={texts.find((t) => t.id === selectedText).fontSize}
                onChange={(e) => changeFontSize(e, selectedText)}
              />
            </label>
            <label>
              Font Family:
              <select
                value={texts.find((t) => t.id === selectedText).fontFamily}
                onChange={(e) => changeFontFamily(e, selectedText)}
              >
                <option value="Arial">Arial</option>
                <option value="Courier">Courier</option>
                <option value="Times New Roman">Times New Roman</option>
              </select>
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default TextCanvas;
