A simple app that receives files.

## Installation

Just clone or fork this repository and start the application with npm:

```
npm install
PORT=5000 KEY="something-very-strong" PUBLIC_DIR="files/" ROOT_URI="http://localhost:3000/" npm start
```

* `PUBLIC_DIR` is a relative path and must contain a trailing slash.
* `ROOT_URI` must contain a trailing slash.

## Usage

* `POST /`: Send a file. Headers must contain `Authorization: KEY something-very-strong`.
* `GET /`: List files.
* `DELETE /:file`: Delete a file. Headers must contain `Authorization: KEY something-very-strong`.

## Requirements

You need Node.js and npm.

## Docker

To run this app into a Docker container, build the image and run it:

```
docker build -t "simple-cdn:latest" .
docker run --restart=always -d --publish 127.0.0.1:8080:80 --env KEY="something-very-strong" simple-cdn:latest
```

Then, visit http://localhost:8080/. Files stored in the container are located at `/opt/app/files`.

## License

Licensed under the GNU Affero General Public License Version 3 (or later); you may not use this work except in compliance with the License.

You may obtain a copy of the License in the LICENSE file, or at:

http://www.gnu.org/licenses/agpl-3.0.txt
