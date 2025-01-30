# Dynamic Image Service

This application dynamically fetches images based on categories from external sources (Unsplash and Pexels) and serves them via a static URL. The images refresh at a configurable interval.

## Installation

### Prerequisites
- Node.js (latest LTS version recommended)
- npm (included with Node.js)
- Git

### Clone the Repository
```sh
git clone https://github.com/your-username/dynamic-image-service.git
cd dynamic-image-service
```

### Install Dependencies
```sh
npm install
```

## Configuration

Edit the `config.yaml` file to set the preferred APIs, refresh time, and categories:

```yaml
apis:
  - unsplash
  - pexels

refreshInterval: 30  # Refresh time in minutes

categories:
  - nature
  - technology
  - animals
  - space
  - architecture
```

For Pexels API usage, set your API key as an environment variable:
```sh
export PEXELS_API_KEY=your_pexels_api_key
```

## Running the Application

Start the server with:
```sh
npm start
```

The service will be available at `http://localhost:3000/`

## Endpoints
- `GET /config` - Retrieve the current configuration.
- `GET /image` - Get the latest dynamically updated image.
- `POST /config` (Future Feature) - Update configuration dynamically.

## License
This project is licensed under the MIT License.

