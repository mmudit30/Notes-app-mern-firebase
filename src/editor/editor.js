/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-constructor */
import React from 'react';
import ReactQuill from 'react-quill';
import debounce from '../helpers';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import { withStyles } from '@material-ui/core/styles';
import styles from './styles';

class EditorComponent extends React.Component{
    constructor(){
        super();
        this.state={
            text:'',
            title:'',
            id:''
        }
    }
    
    componentDidMount =() => {
        this.setState({
            text:this.props.selectedNote.body,
            title:this.props.selectedNote.title,
            id:this.props.selectedNote.id
        });
    }

    componentDidUpdate =() =>{
        if(this.props.selectedNote.id !== this.state.id)
            this.setState({
                text:this.props.selectedNote.body,
                title:this.props.selectedNote.title,
                id:this.props.selectedNote.id
            });
    }

    render(){
        const { classes } = this.props;
        return(
            <div className={classes.editorContainer}>
                <BorderColorIcon className={classes.editIcon}/>
                <input
                 className={classes.titleInput}
                 type='text'
                 placeholder='Note title...'
                 value={this.state.title ? this.state.title : ''}
                 onChange={(e)=>this.updateTitle(e.target.value)}
                 />
                <ReactQuill 
                  value={this.state.text}
                  onChange={this.updateBody}>
                </ReactQuill>
            </div>
        );
    }

    updateBody = async (val) =>{
        await this.setState({ text: val });
        this.update();
    }
    updateTitle = async (val) =>{
        await this.setState({ title: val });
        this.update();
    }

    update = debounce(()=>{
        this.props.noteUpdate(this.state.id, {
            body: this.state.text,
            title: this.state.title
        });
    }, 1500);
}

export default withStyles(styles)(EditorComponent);