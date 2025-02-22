import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSpinner } from "@fortawesome/free-solid-svg-icons"
import "../../styles/main.css"
import { Col, Row, Container, Button } from "react-bootstrap"
import "jodit"
import "jodit/build/jodit.min.css"

// using this to test getting html files
import request from "../../utils/request"

// import test from './test2.html'
import { withRouter } from "react-router"
import { Link } from "react-router-dom"
import Comment from "../Comment/Comment"
import Editor from "./EditorComponent.jsx"

const baseURL = "http://167.172.11.217/"

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      content: null,
      loaded: false,
      hasPending: false,
      buttonText: "Edit article",
      // this needs to be set from when the article is clicked in the subject page, but those are currently inaccessible
      id: window.location.href.substring(
        window.location.href.lastIndexOf("/") + 1
      ),
      title: null,
    }
    this.updateContent = this.updateContent.bind(this)
  }

  componentDidMount() {
    this.setStart()
  }

  // currently testing setting the page using previously used code
  setStart() {
    request
      .get(`article/get/${this.state.id}`, {
        headers: {
          "auth-token": localStorage.getItem("accessToken"),
        },
      })
      .then((response) => response.data)
      .then((data) => {
        console.log(data)
        if (data.success) {
          this.editorComponent &&
            this.editorComponent.setContent(data.returnValuesForArticle.content)
          this.updateContent(data.returnValuesForArticle.content)
          this.setState({
            loaded: true,
            title: data.returnValuesForArticle.title,
          })
          if (data.returnValuesForArticle.is_pending) {
            this.setState({
              hasPending: true,
              buttonText: "Pending article exists",
            })
          }
          console.log(data)
          return data
        }
        this.editorComponent && this.editorComponent.setContent("")
        this.updateContent("")
        this.setState({ loaded: true })
      })
      .catch((err) => {
        this.setState({ loaded: true })
        console.log(err)
      })
  }

  renderEditor() {
    if (this.state.content || this.state.title) {
      return (
        <Editor
          ref={this.editorComponent}
          value={this.state.content}
          onChange={(content) => this.setState({ content })}
        />
      )
    }
    if (this.state.loaded) {
      return <h1>Error: Article ID not found</h1>
    }
    return (
      <>
        {/* <div class="spinner-border" role="status"> */}
        <h1>
          <FontAwesomeIcon icon={faSpinner} />
        </h1>
        {/* <span class="sr-only">Loading...</span> */}
        {/* </div> */}
      </>
    )
  }

  updateContent(value) {
    this.setState({ content: value })
  }

  render() {
    return (
      <>
        <div className="App article-editor-content-section">
          <Container>
            {/* just a temporary link, replace href with a function to send a request to backend */}

            <Row>
              <Col sm={9}>
                <h1>{this.state.title}</h1>
              </Col>
              <Col sm={3}>
                <Link
                  disabled={this.state.hasPending}
                  to={{ pathname: `/editpage/${this.state.id}` }}
                >
                  <Button
                    className="edit-button"
                    variant="info"
                    disabled={this.state.hasPending}
                  >
                    {this.state.buttonText}
                  </Button>
                </Link>
              </Col>
            </Row>
            {this.renderEditor()}
          </Container>
        </div>
        <div className="App article-editor-content-section">
          
            <Comment params={`${baseURL}article/get/${this.state.id}`} />
          
        </div>
        
      </>
    )
  }
}

export default withRouter(App)
