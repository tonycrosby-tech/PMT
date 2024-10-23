import { React, Component } from 'react';
class NotFoundPage extends Component {
  render() {
    return (
      <div>
        <div>
          <h1>PAGE NOT FOUND</h1>
          <h2>ERROR: 404</h2>
          <h1>
            <span role="img" aria-label="Face With Rolling Eyes Emoji">
              🙄
            </span>
          </h1>
          <h1>
            <a to="/home">Go to Home </a>
          </h1>
        </div>
      </div>
    );
  }
}
export default NotFoundPage;
