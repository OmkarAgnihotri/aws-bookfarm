import React from 'react';
import Autocomplete from 'react-autocomplete';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons';

class Tags extends React.Component{
    state = {
        value : ''
    }

    handleDelete = (index) => {
        this.props.onDelete(index)
    }

    renderTags = () => {
        return this.props.selectedTags.map((tag,index) => {
            return (
                <div className={`${this.props.tagClass} p-2`} key={index}>
                    {tag.name}
                    <a href="" onClick={(e) => {
                        e.preventDefault();
                        this.handleDelete(index);
                    }}><FontAwesomeIcon icon={faTimes} className="float-end" /></a>
                </div>
            )
        })
    }


    render(){
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col">
                        {this.renderTags()}
                    <form onSubmit={(event) => {
                        event.preventDefault();
                        this.props.onSubmit(this.state.value);
                        this.setState({
                            value:''
                        })
                    }}>
                        <Autocomplete
                            getItemValue={(item) => item.name}
                            items={this.props.items}
                            renderItem={(item, isHighlighted) =>
                                <div className="p-2" style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
                                    {item.name}
                                </div>
                            }
                            shouldItemRender = {(item, value) => item.name.toLowerCase().indexOf(value.toLowerCase()) > -1}
                            value={this.state.value}
                            onChange={(e) => {
                                this.setState({value:e.target.value})
                            }}
                            onSelect={( _, item) => {
                               this.props.onSelect(item);
                            }}
                            renderInput={(props)=><input className="form-control" {...props} placeholder={this.props.placeholder} />}
                            menuStyle={{
                                borderRadius: '3px',
                                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
                                background: 'rgba(255, 255, 255, 0.9)',
                                padding: '2px 0',
                                fontSize: '90%',
                                position: 'fixed',
                                overflow: 'auto',
                                maxHeight: '100px',
                                overflowY:'scroll'
                            }}
                        />
                    </form>
                    
                    </div>
                </div>
            </div>
        )
    }
}

export default Tags;