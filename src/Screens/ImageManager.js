import React from 'react';
import DropDown from "../Component/DropDown";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { v4 as uuidv4 } from 'uuid';
import {
    doConnect,
    doFileConnect
} from '../config/Common';
import DataTable from "../Component/DataTable";
import MyConstant from "../config/MyConstant";
import { Link } from "react-router-dom";



const fileTypeOption = [{ value: 'image', label: 'Image' }, {
    value: 'video',
    label: 'Video'
}, { value: 'audio', label: 'Audio' },
{ value: 'gif', label: 'Gif' },

]

class ImageManager extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedOption: null,
            fileData: {},
            actionType: 'add',
            editId: '',
            editTitle: '',
            title: '', enableLoader: false, displayImage: 'none'
        }
    }
    componentDidMount() {


        this.getImages()
    }
    async getImages() {
        let postJson = { fileType: '', sessionId: '1223' };
        let responseData = await doConnect("getGameFilesList", "POST", postJson);
        var json = responseData;
        this.setState({ fileData: json.filesMap })

    }

    async submitFunction() {

        const { selectedOption, title } = this.state;
        //console.log(selectedOption ,title,this.state.fileObj )

        if (title.trim() === "") {
            this.setState({ titleValidatation: 'Please Enter Title ' })
            return false

        }
        else {
            this.setState({ titleValidatation: '' })
        }


        if (!selectedOption) {
            this.setState({ selectValidatation: 'Please Select Option ' })
            return false

        }
        else {
            this.setState({ selectValidatation: '' })
        }

        if (!this.state.fileObj) {
            this.setState({ imageValidatation: 'Please Chose Image ' })
            return false
        }
        else {
            this.setState({ imageValidatation: '' })
        }

        var filename = this.state.fileObj.fileName

        var Extension = filename.split(".").pop();

        let extension_Type_Image = ['png', 'jpg', 'jpeg', 'bmp']
        //  console.log('checking',extension_Type_Image.includes(Extension))


        if (this.state.selectedOption.value === "image") {
            if (!extension_Type_Image.includes(Extension)) {

                this.setState({ imageValidatation: 'Please Choose Image Format ' })
                return false
            }

        }

        let extension_Type_Video = ['mp4'];

        if (this.state.selectedOption.value === 'video') {
            if (!extension_Type_Video.includes(Extension)) {

                this.setState({ imageValidatation: 'Please Choose Video Format ' })
                return false
            }

        }

        let extension_Type_Gif = ["gif"];

        if (this.state.selectedOption.value === 'gif') {
            if (!extension_Type_Gif.includes(Extension)) {

                this.setState({ imageValidatation: 'Please Choose Gif Format ' })
                return false
            }

        }

        let extension_Type_Audio = ['mp3'];

        if (this.state.selectedOption.value === 'audio') {
            if (!extension_Type_Audio.includes(Extension)) {

                this.setState({ imageValidatation: 'Please Choose audio Format ' })
                return false
            }

        }


        doFileConnect(this.state.fileObj)


        let postJson = { title: this.state.title, fileName: this.state.fileObj.fileName, fileType: this.state.selectedOption.value, sessionId: '1223' };

        var that = this;
        this.setState({ enableLoader: true })
        let responseData = await doConnect("addGameFile", "POST", postJson);
        var json = responseData;
        var response = json.response;
        if (response === 'Success') {
            toast.success('Added data !', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            that.setState({ title: '', fileObj: {}, fileType: "", enableLoader: false })

            that.getImages()

        } else {
            alert(response);
        }




        /*
                let ImageFieldPost={
                    levelid:this.state.selectedOption.value,
                    docsid:this.state.selectedOption.value,
                    fileName:this.state.FileName,
                    fileType:this.state.fileType
                }
                console.log(ImageFieldPost)
        
                this.setState({ImageFieldPost})*/
        //alert(1)
    }
    async editFunction() {

        let postJson = { fileId: this.state.editId, title: this.state.editTitle, fileName: "", fileType: "", sessionId: '1223' };

        var that = this;
        let responseData = await doConnect("updateGameFile", "POST", postJson);
        var json = responseData;
        var response = json.response;
        if (response === 'Success') {
            toast.success('Added data !', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            that.setState({ editTitle: '', actionType: 'add' })

            that.getImages()

        } else {
            alert(response);
        }


    }
    async deleteGameFile(fileId) {
        let postJson = { sessionId: '1223', fileId: fileId };
        let responseData = await doConnect("deleteGameFile", "POST", postJson);
        if (responseData.response === 'Success') {
            toast.success(' Data deleted !', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

            this.getImages();

        } else {
            alert(responseData.response);
        }

    }

    render() {
        const { selectedOption } = this.state


        const columns = [
            {
                name: 'Title',
                sortable: true,
                selector: (row, index, column, id) => {
                    return <div >{row.title}</div>
                },
            },
            {
                name: 'type',
                sortable: true,
                selector: (row, index, column, id) => {
                    return <div >{row.fileType}</div>
                },
            },
            {
                name: 'file',
                sortable: true,
                selector: (row, index, column, id) =>

                    <React.Fragment>
                        <div id={row.id}>
                            {row.fileType === "image" || row.fileType === "gif" ?
                                <img src={MyConstant.keyList.apiURL + "vp?action=module&key=" + row.fileName + "&id=" + row.fileType} width="75" height="75" alt="loading..."
                                    onClick={async () => {

                                        await this.setState({ imageView: row, displayImage: "block" })

                                    }} />
                                :
                                row.fileType === "video" ?
                                    <React.Fragment>
                                        <video width="100" height="100" controls>
                                            <source src={MyConstant.keyList.apiURL + "vp?action=module&key=" + row.fileName + "&id=" + row.fileType} type="video/mp4" />
                                            <source src={MyConstant.keyList.apiURL + "vp?action=module&key=" + row.fileName + "&id=" + row.fileType} type="video/ogg" />
                                            Your browser does not support the video tag.
                                        </video>
                                    </React.Fragment>

                                    :
                                    <React.Fragment>
                                        <audio width="100" height="100" controls>
                                            <source src={MyConstant.keyList.apiURL + "vp?action=module&key=" + row.fileName + "&id=" + row.fileType} type="audio/ogg" />
                                            <source src={MyConstant.keyList.apiURL + "vp?action=module&key=" + row.fileName + "&id=" + row.fileType} type="audio/mpeg" />
                                            Your browser does not support the audio element.
                                        </audio>
                                    </React.Fragment>

                            }

                        </div>

                    </React.Fragment>
                ,
            },
            {
                name: 'Edit',
                sortable: true,
                selector: (row, index, column, id) =>
                    <div id={row.id} >
                        <button id={row.id} className="btn btn-info" onClick={(e) => {
                            this.setState({ editId: row.id, editTitle: row.title, actionType: 'edit' })
                        }}>Edit</button>

                    </div>,

            },
            {
                name: 'Delete',
                sortable: true,
                selector: (row, index, column, id) =>
                    <div id={row.id}
                    >
                        <div style={{ fontWeight: 700 }}></div>
                        <button id={row.id} className="btn btn-danger" onClick={(e) => {
                            if (window.confirm('Delete the item?')) { this.deleteGameFile(row.id) }
                        }
                        }>Delete</button>  </div>,
            }
        ];

        let data = [];
        Object.keys(this.state.fileData).map((ival, index) => {
            data.push(this.state.fileData[ival])
            return true
        })

        return (
            <React.Fragment>
                <div className="main-content">
                    {/* <!-- page content --> */}
                    <div className="right_col" role="main">
                        <div className="">

                            <div className="clearfix"></div>

                            <div className="row">
                                <div className="col-md-12 col-sm-12  ">
                                    <div className="x_panel">
                                        <div className="x_title">
                                            <h2>Plain Page</h2>
                                            <ul className="nav navbar-right panel_toolbox">
                                                <li><Link className="collapse-link"><i className="fa fa-chevron-up"></i></Link>
                                                </li>
                                                <li className="dropdown">
                                                    <Link to="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"><i className="fa fa-wrench"></i></Link>
                                                    <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                        <Link className="dropdown-item" to="#">Settings 1</Link>
                                                        <Link className="dropdown-item" to="#">Settings 2</Link>
                                                    </div>
                                                </li>
                                                <li><Link className="close-link"><i className="fa fa-close"></i></Link>
                                                </li>
                                            </ul>
                                            <div className="clearfix"></div>
                                        </div>
                                        <div className="x_content">
                                            {/* content*/}


                                            <ToastContainer />


                                            {this.state.actionType === "add" ?
                                                <div>
                                                    <div className="row item form-group" style={{ marginTop: 20 }}>
                                                        <div className="col-sm-1">Title </div>
                                                        <div className="col-sm-4">
                                                            <input type={'text'} placeholder={'Enter Title'} className={'form-control'} value={this.state.title} onChange={(e) => { this.setState({ title: e.target.value }) }} />
                                                            <span style={{ color: 'red', fontSize: 12, float: 'inherit', marginTop: 5 }}> {this.state.titleValidatation} </span>
                                                        </div>
                                                        <div className="col-sm-7"> </div>

                                                    </div>
                                                    <div className="row item form-group" style={{ marginTop: 20 }}>
                                                        <div className="col-sm-1 ">Level </div>
                                                        <div className="col-sm-4">
                                                            <DropDown
                                                                selectedOption={selectedOption}
                                                                onChange={(e) => {
                                                                    this.setState({ selectedOption: e })
                                                                }}
                                                                options={fileTypeOption}
                                                            />
                                                            <span style={{ color: 'red', fontSize: 12, float: 'inherit', marginTop: 5 }}> {this.state.selectValidatation} </span>
                                                        </div>
                                                        <div className="col-sm-7"> </div>

                                                    </div>




                                                    <div className="row item form-group" style={{ marginTop: 10 }}>
                                                        <div className="col-sm-1">Image </div>
                                                        <div className="col-sm-4">
                                                            <input type="file" onChange={async (event) => {
                                                                var files = event.target.files;
                                                                var length = files.length;

                                                                if (length > 0) {
                                                                    for (var i = 0; i < length; i++) {
                                                                        var fileUrl = URL.createObjectURL(files[i]);
                                                                        var file = files[i];
                                                                        var filename = file.name;
                                                                        var ext = filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);


                                                                        var uid = uuidv4();
                                                                        var fileObj = {
                                                                            file: file,
                                                                            fileUrl: fileUrl,
                                                                            fileName: uid + "." + ext,
                                                                            docsId: uid,
                                                                            processType: "module",
                                                                            fileType: this.state.selectedOption.value
                                                                        };

                                                                        this.setState({ fileObj, fileType: ext })

                                                                    }

                                                                }
                                                            }
                                                            }
                                                            />
                                                            <span style={{ color: 'red', fontSize: 12, float: 'inherit', marginTop: 5 }}> {this.state.imageValidatation} </span>
                                                        </div>
                                                        <div className="col-sm-7"> </div>
                                                    </div>




                                                    <div className="row item form-group" style={{ marginTop: 20 }}>
                                                        <div className="col-sm-1"> </div>
                                                        <div className="col-sm-3">
                                                            <button className="buttonload btn btn-primary" type="button" disabled={this.state.enableLoader} onClick={() => this.submitFunction()} >
                                                                {this.state.enableLoader ? <i className="fa fa-spinner fa-spin"></i> : null} Submit</button>
                                                        </div>
                                                        <div className="col-sm-8"> </div>

                                                    </div>
                                                </div> : <div>


                                                    <div className="row item form-group" style={{ marginTop: 20 }}>
                                                        <div className="col-sm-1">Title </div>
                                                        <div className="col-sm-4">
                                                            <input type={'text'} placeholder={'Enter Title'} className={'form-control'} value={this.state.editTitle} onChange={(e) => { this.setState({ editTitle: e.target.value }) }} />
                                                        </div>
                                                        <div className="col-sm-7"> </div>

                                                    </div>
                                                    <div className="row item form-group" style={{ marginTop: 20 }}>
                                                        <div className="col-sm-1"></div>
                                                        <div className="col-sm-3">
                                                            <button type="button" className="btn btn-primary"
                                                                onClick={() => this.editFunction()}>Update
                                                            </button>
                                                            <button type="button" className="btn btn-info"
                                                                onClick={() => this.setState({ actionType: 'add' })}>Add new
                                                            </button>
                                                        </div>
                                                        <div className="col-sm-8"> </div>

                                                    </div>
                                                </div>
                                            }


                                            <div className="row">

                                                {data.length !== 0 ?
                                                    <DataTable
                                                        title=""
                                                        columns={columns}
                                                        data={data}
                                                    />
                                                    :
                                                    <React.Fragment>

                                                        <div className="col-sm-4"> </div>
                                                        <div className="col-sm-4">
                                                            <div className="loader"></div>
                                                        </div>
                                                        <div className="col-sm-4"> </div>

                                                    </React.Fragment>}

                                            </div>


                                            {/*Image View*/}
                                            <div id="myModal" className="modal_image" style={{ display: this.state.displayImage }} >
                                                <span className="close" onClick={() => {
                                                    this.setState({ displayImage: "none" })
                                                }}  >&times;</span>
                                                {this.state.imageView ?

                                                    <img src={MyConstant.keyList.apiURL + "vp?action=module&key=" + this.state.imageView.fileName + "&id=" + this.state.imageView.fileType} className="modal-content_image" id="img01" alt='loading' />

                                                    : null}

                                                <div id="caption">  </div>
                                            </div>
                                            {/*Image View*/}

                                            {/*content*/}

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <!-- /page content --> */}
                </div>
            </React.Fragment>
        )

    }


}


export default ImageManager
