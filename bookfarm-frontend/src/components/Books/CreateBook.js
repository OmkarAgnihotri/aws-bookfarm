import React from 'react';
import axios from "axios";
import {connect} from 'react-redux';

import APIConfig from '../../apis/server';
import Tags from '../util/Tags';
import defaultBookImage from '../../assets/images/book.png';
import createNotification from '../util/Notification';
import {Link} from 'react-router-dom';

class CreateBook extends React.Component{
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
        key : Date.now()
    }

    componentDidMount = () => {
        APIConfig.get('/tags/')
        .then(response => this.setState({suggestedTags : response.data}))
        .catch(err=>console.log(err));

        APIConfig.get('/authors/')
        .then(response => this.setState({suggestedAuthors : response.data}))
        .catch(err=>console.log(err));
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

        if(!this.state.selectedImage){
            createNotification('Please select an image !', 'error')
            return;
        }

        if(this.state.title.length === 0){
            createNotification('Please select appropraite title !', 'error')
            return;
        }

        if(this.state.selectedAuthors.length === 0){
            createNotification('Please Add alteast one author !', 'error');
            return;
        }

        const FILE_NAME = `${this.props.userID}_${Date.now()}.${this.state.selectedImage.name.split('.').slice(-1)[0]}`;
       
       const response = (await axios.post('https://c0bvn7msa5.execute-api.ap-south-1.amazonaws.com/testing-with-cors/get-upload-url',{
           bucketName : 'bookfarm-images',
           filePath : `images/${FILE_NAME}`
       })).data.url;
       
       const formData = new FormData()

       Object.keys(response.fields).forEach(key => formData.append(key, response.fields[key]))

       formData.append('file', this.state.selectedImage);
       
       await axios.post(response.url,formData,{'headers' : {'Content-Type':'multipart/form-data'}})
       
       APIConfig.post(`users/${this.props.userID}/books/`,{
            title: this.state.title,
            imageUrl : `https://d32wahoe3gu7v.cloudfront.net/${FILE_NAME}`,
            price : this.state.price,
            owner : this.props.userID,
            authors : this.state.selectedAuthors,
            tags : this.state.selectedTags
       })
       .then(res => {
           createNotification('Book added to your inventory !!', 'success');
            this.setState({
                title:'',
                description : '',
                selectedAuthors : [],
                selectedTags : [],
                price : 0,
                key : Date.now(),
                selectedImage : null,
                previewImageURL : null
            })
       })
       .catch(err => console.error(err));

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
                                        <hr />
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
                                        <hr />
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
                                        <hr />
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
                                        <hr />
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
                                        <hr />
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
                                    <div className="col mt-5">
                                            <Link to='/books' className="btn btn-danger float-end mx-2">cancel</Link>
                                            <button className="btn btn-primary float-end" onClick={this.onSubmit}>Add</button>
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

export default connect(mapStateToProps, {})(CreateBook);