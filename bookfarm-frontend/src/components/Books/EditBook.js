import React from 'react';
import axios from "axios";
import {connect} from 'react-redux';

import APIConfig from '../../apis/server';
import Tags from '../util/Tags';
import defaultBookImage from '../../assets/images/book.png';
import createNotification from '../util/Notification';
import { Link } from 'react-router-dom';
import { changeAuthState } from '../../actions';

class EditBook extends React.Component{
    state = {
        selectedImage : null,
        previewImageURL : null,
        suggestedTags : [],
        suggestedAuthors : [],
        selectedTags : [],
        selectedAuthors : [],
        title:'',
        description : '',
        price : 0,
        key : Date.now(),
        isAvailable : false,
        selectedBook : null
    }

    componentDidMount = () => {
        APIConfig.get('/tags/',{
            headers : {
                Authorization : `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => this.setState({suggestedTags : response.data}))
        .catch((err) => {
            if(err.response && err.response.status === 403){
                localStorage.removeItem('token');
                this.props.changeAuthState(null);
                createNotification('Please Login Again !', 'error');
            }
            else createNotification('Some error occurred! Please try again!', 'error');
        });

        APIConfig.get('/authors/',{
            headers : {
                Authorization : `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => this.setState({suggestedAuthors : response.data}))
        .catch((err) => {
            if(err.response && err.response.status === 403){
                localStorage.removeItem('token');
                this.props.changeAuthState(null);
                createNotification('Please Login Again !', 'error');
            }
            else createNotification('Some error occurred! Please try again!', 'error');
        });

        const bookId = this.props.match.params.bookId;

        APIConfig.get(`/books/${bookId}`,{
            headers : {
                Authorization : `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
            this.setState({
                selectedBook : response.data,
                selectedAuthors:response.data.authors,
                selectedTags : response.data.tags,
                title : response.data.title,
                price : response.data.price,
                previewImageURL : response.data.imageUrl,
                isAvailable : response.data.isAvailable
            })
        })
        .catch((err) => {
            if(err.response && err.response.status === 403){
                localStorage.removeItem('token');
                this.props.changeAuthState(null);
                createNotification('Please Login Again !', 'error');
            }
            else createNotification('Some error occurred! Please try again!', 'error');
        });

    }

    
    handleImageUpload = (event) => {
        this.setState({
            selectedImage : event.target.files[0]
        })
        const previewImageURL = URL.createObjectURL(event.target.files[0]);

        this.setState({
            previewImageURL
        })
    }

    
    onAuthorSubmit = (value) => {
        this.setState({
            selectedAuthors : [...this.state.selectedAuthors, {'name' : value}]
        })
    }

    onAuthorSelect = (author) => {
        this.setState({
            selectedAuthors : [...this.state.selectedAuthors, author]
        })
    }

    onAuthorDelete = (index) => {
        this.setState({
            selectedAuthors : [
                ...this.state.selectedAuthors.slice(0, index),
                ...this.state.selectedAuthors.slice(index + 1)
            ]
        })
    }

    onTagSubmit = (value) => {
        this.setState({
            selectedTags : [...this.state.selectedTags, {'name' : value}]
        })
    }

    onTagSelect = (tag) => {
        this.setState({
            selectedTags : [...this.state.selectedTags, tag]
        })
    }

    onTagDelete = (index) => {
        this.setState({
            selectedTags : [
                ...this.state.selectedTags.slice(0, index),
                ...this.state.selectedTags.slice(index + 1)
            ]
        })
    }

    onSubmit = async () => {        
        if(this.state.title.length === 0){
            createNotification('Please select appropraite title !', 'error')
            return;
        }
        
        if(this.state.selectedAuthors.length === 0){
            createNotification('Please Add alteast one author !', 'error');
            return;
        }

        if(this.state.selectedImage){
            const FILE_NAME = `${this.props.userID}_${Date.now()}.${this.state.selectedImage.name.split('.').slice(-1)[0]}`;
       
            try{
                
                const response = (await axios.post('https://c0bvn7msa5.execute-api.ap-south-1.amazonaws.com/testing-with-cors/get-upload-url',{
                    bucketName : 'bookfarm-images',
                    filePath : `images/${FILE_NAME}`
                })).data.url;
                
                const formData = new FormData()
    
                Object.keys(response.fields).forEach(key => formData.append(key, response.fields[key]))
    
                formData.append('file', this.state.selectedImage);
                
                await axios.post(response.url,formData,{'headers' : {'Content-Type':'multipart/form-data'}});
    
                this.setState({
                    previewImageURL : `https://d32wahoe3gu7v.cloudfront.net/${FILE_NAME}`
                })
            }
            catch(err){
                if(err.response && err.response.status === 403){
                    localStorage.removeItem('token');
                    this.props.changeAuthState(null);
                    createNotification('Please Login Again !', 'error');
                }
                else createNotification('Some error occurred! Please try again!', 'error');
            }
        }
        
        
       
        APIConfig.put(`users/${this.props.userID}/books/${this.props.match.params.bookId}/`,{
            title: this.state.title,
            imageUrl : this.state.previewImageURL,
            price : this.state.price,
            owner : this.props.userID,
            authors : this.state.selectedAuthors,
            isAvailable : this.state.isAvailable,
            tags : this.state.selectedTags
        },
        {
            headers : {
                Authorization : `Bearer ${localStorage.getItem('token')}`
            }
        })
       .then(res => {
           createNotification('Book updated !!', 'success');
           
       })
       .catch((err) => {
            if(err.response && err.response.status === 403){
                localStorage.removeItem('token');
                this.props.changeAuthState(null);
                createNotification('Please Login Again !', 'error');
            }
            else createNotification('Some error occurred! Please try again!', 'error');
        });

    }

    render(){

        return (
            <div className="container mt-2">
                
                <div className="row justify-content-center">
                    <div className="col-lg-8 col-md-10 col-12">
                        <div className="card p-3">
                            <div className="container">
                                <div className="row">
                                    <div className="col-lg-4 col-md-5 col-sm-12 col-12">
                                            <img  
                                                src={this.state.previewImageURL || defaultBookImage } 
                                                style={{height:'220px', width:'200px'}}
                                                className="p-2" 
                                            />
                                    </div>
                                    <div className="col-lg-8 col-md-7 col-sm-12 col-12 d-flex align-items-center p-2">
                                        <div className="container">
                                            <div className="row">
                                                <div className="col-lg-8 col-12">
                                                    <div className="form-group">
                                                        <input type="file" className="form-control" onChange={this.handleImageUpload} key={this.state.key}/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                                
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col p-2">
                                        <div className="dropdown-divider"></div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-4 col-md-5 col-sm-12 col-12">
                                        <div className="h5">Title</div>
                                    </div>
                                    <div className="col-lg-8 col-md-7 col-sm-12 col-12 d-flex align-items-center p-2">
                                        <div className="container">
                                            <div className="row">
                                                <div className="col-lg-8 ">
                                                    <input 
                                                        className="form-control" 
                                                        placeholder="enter title"
                                                        value={this.state.title}
                                                        onChange={(e) => this.setState({title : e.target.value})}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                               
                                <div className="row">
                                    <div className="col p-2">
                                        <div className="dropdown-divider"></div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-4 col-md-5 col-sm-12 col-12">
                                        <div className="h5">Description</div>
                                    </div>
                                    <div className="col-lg-8 col-md-7 col-sm-12 col-12 d-flex align-items-center p-2">
                                        <div className="container">
                                            <div className="row">
                                                <div className="col-lg-8 ">
                                                    <textarea 
                                                        className="form-control" 
                                                        placeholder="enter description"
                                                        value={this.state.description}
                                                        onChange={(e) => this.setState({description : e.target.value})}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col p-2">
                                        <div className="dropdown-divider"></div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-4 col-md-5 col-sm-12 col-12">
                                        <div className="h5">Authors</div>
                                    </div>
                                    <div className="col-lg-8 col-md-7 col-sm-12 col-12 d-flex align-items-center p-2">
                                            <Tags 
                                                items={this.state.suggestedAuthors} 
                                                tagClass={'alert alert-warning'} 
                                                placeholder="Add a Author"
                                                selectedTags={this.state.selectedAuthors}
                                                onDelete={this.onAuthorDelete}
                                                onSubmit={this.onAuthorSubmit}
                                                onSelect={this.onAuthorSelect}
                                            />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col p-2">
                                        <div className="dropdown-divider"></div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-4 col-md-5 col-sm-12 col-12">
                                        <div className="h5">Tags</div>
                                    </div>
                                    <div className="col-lg-8 col-md-7 col-sm-12 col-12 d-flex align-items-center p-2">
                                            <Tags 
                                                items={this.state.suggestedTags} 
                                                tagClass={'alert alert-primary'} 
                                                placeholder="Add a Tag"
                                                selectedTags={this.state.selectedTags}
                                                onDelete={this.onTagDelete}
                                                onSubmit={this.onTagSubmit}
                                                onSelect={this.onTagSelect}
                                            />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col p-2">
                                        <div className="dropdown-divider"></div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-4 col-md-5 col-sm-12 col-12">
                                        <div className="h5">Price</div>
                                    </div>
                                    <div className="col-lg-8 col-md-7 col-sm-12 col-12 d-flex align-items-center p-2">
                                        <div className="container">
                                            <div className="row">
                                                <div className="col-lg-4 col-md-8 col-12">
                                                    <input 
                                                        type="number" 
                                                        className="form-control" 
                                                        placeholder="enter amount"
                                                        value={this.state.price}
                                                        onChange={(e) => this.setState({price : e.target.value})}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col p-2">
                                        <div className="dropdown-divider"></div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col d-flex align-items-center p-2">
                                        <div className="container">
                                            <div className="row">
                                                <div className="col-lg-8 ">
                                                    <label className="px-2">Book available ?</label>
                                                    <input 
                                                        className="custom-checkbox checkbox-lg"
                                                        type="checkbox"
                                                        checked={this.state.isAvailable}
                                                        onChange={(e) => {
                                                            console.log(this.state.isAvailable);
                                                            this.setState({isAvailable : e.target.checked})
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col mt-5">
                                            <Link to={{
                                                pathname:`/books/detail/${this.props.match.params.bookId}`,
                                                    state : {
                                                        previousPage : (this.props.location.state)?
                                                                        this.props.location.state.previousPage || '/books':'/books',
                                                        queryText : (this.props.location.state)?
                                                                        this.props.location.state.queryText || '':'',

                                                    }
                                                }}
                                                className="btn btn-danger float-end mx-2"
                                            >
                                            {/* <Link to={`/books/detail/${this.props.match.params.bookId}`} className="btn btn-danger float-end mt-1 mx-2" > */}
                                                cancel
                                            </Link>
                                            <button className="btn btn-primary float-end" onClick={this.onSubmit}>save</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


const mapStateToProps = (state) => {
    if(!state.user)return {}

    return {
        userID : state.user.id
    }
}

export default connect(mapStateToProps, {
    changeAuthState
})(EditBook);