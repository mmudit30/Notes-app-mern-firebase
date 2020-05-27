/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-constructor */
import React from 'react';
import {removeHTMLTags} from '../helpers';
import { withStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import styles from './styles';
import { ListItem } from '@material-ui/core';
import { ListItemText } from '@material-ui/core';

class SidebarItemComponent extends React.Component{

    render(){

        const { _index, _note, classes, selectedNoteIndex } = this.props;

        return(
            <div key={_index}>
                <ListItem
                 className={classes.selectedItem}
                 selected={selectedNoteIndex === _index}
                 alignItems='flex-start'
                 >
                    <div
                     className={classes.textSection}
                     onClick={()=>this.selectNote(_note, _index)}
                     >
                         <ListItemText
                         primary={_note.title}
                         secondary={ removeHTMLTags(_note.body.substring(0,30)) + '...'}
                         >

                         </ListItemText>
                    </div>
                    <DeleteIcon
                      className={classes.deleteIcon}
                      onClick={()=>this.deleteNote(_note)}
                      >                        
                    </DeleteIcon>

                </ListItem>
            </div>
        );
    }
    selectNote =(n, i) => this.props.selectNote(n, i);
    deleteNote =(n) => {
        if(window.confirm(`Sure to delete: ${n.title}`))
            this.props.deleteNote(n);
    }
}

export default withStyles(styles)(SidebarItemComponent);