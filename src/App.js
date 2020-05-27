/* eslint-disable no-unused-vars */
import React from 'react';
import SidebarComponent from './sidebar/sidebar';
import EditorComponent from './editor/editor';
import './App.css';

const firebase = require('firebase');

class App extends React.Component {
  
  constructor(){
    super();
    this.state = {
      selectedNoteIndex: null,
      selectedNote: null,
      notes: null
    };
  }

  render(){
    return (
      <div className="app-container">
        <SidebarComponent 
         selectedNoteIndex={this.state.selectedNoteIndex} 
         notes={this.state.notes}
         selectNote={this.selectNote}
         deleteNote={this.deleteNote}
         newNote={this.newNote}
         />
        {
          this.state.selectedNote ?
          <EditorComponent
           notes={this.state.notes}
           selectedNote={this.state.selectedNote}
           selectedNoteIndex={this.state.selectedNoteIndex}
           noteUpdate={this.noteUpdate}
           /> : null
        }
      </div>
    );
  }
  noteUpdate = (id, noteObj) => {
    firebase
      .firestore()
      .collection('notes')
      .doc(id)
      .update({
        title: noteObj.title,
        body: noteObj.body,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });
  }
  selectNote=(note, index) => this.setState({selectedNote: note, selectedNoteIndex: index});
  deleteNote = async (note) => {
    const noteIndex = this.state.notes.indexOf(note);
    await this.setState({ notes: this.state.notes.filter(_note => _note !== note) });
    if(this.state.selectedNoteIndex === noteIndex){
      this.setState({
        selectNote: null,
        selectedNoteIndex: null
      });
    }
    else {
      this.state.notes.length > 1 ?
        this.selectNote(this.state.notes[this.state.selectedNoteIndex -1], this.state.selectedNoteIndex -1) :
        this.setState({
          selectNote: null,
          selectedNoteIndex: null
        });
    }
    firebase
      .firestore()
      .collection('notes')
      .doc(note.id)
      .delete();
  }

  newNote = async (title) => {
    const note = {
      title: title,
      body: ''
    };
    const newFromDb = await firebase
      .firestore()
      .collection('notes')
      .add({
        title: note.title,
        body: note.body,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });
    const newId = newFromDb.id;
    await this.setState({ notes : [...this.state.notes, note] });
    const newNoteIndex = this.state.notes.indexOf(this.state.notes.filter(_note => _note.id === newId)[0]);
    this.setState({ selectedNote: this.state.notes[newNoteIndex], selectedNoteIndex: newNoteIndex });
    
  }

  componentDidMount= () =>{
    firebase
      .firestore()
      .collection('notes')
      .onSnapshot(serverUpdate => {
        const notes = serverUpdate.docs.map(_doc =>{
          const data = _doc.data();
          data['id'] = _doc.id;
          return data;
        });
        console.log(notes);
        this.setState({ notes : notes });
      })
  }

}

export default App;