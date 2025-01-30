import express from 'express';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import schedule from 'node-schedule';
import cors from 'cors';
import yaml from 'js-yaml';

const app = express();
const PORT = process.env.PORT || 3000;
const IMAGE_DIR = path.join(__dirname, 'images');
const CONFIG_PATH = path.join(__dirname, 'config.yaml');

if (!fs.existsSync(IMAGE_DIR)) {
    fs.mkdirSync(IMAGE_DIR);
}

app.use(cors());
app.use(express.json());

const loadConfig = () => {
    try {
        const configData = yaml.load(fs.readFileSync(CONFIG_PATH, 'utf8'));
        return configData;
    } catch (error) {
        console.error('Error loading config file:', error);
        return {
            apis: ['unsplash'],
            refreshInterval: 30, // Default to 30 minutes
            categories: ['nature']
        };
    }
};

let config = loadConfig();

const fetchNewImage = async () => {
    try {
        const category = config.categories[Math.floor(Math.random() * config.categories.length)];
        let imageUrl;

        if (config.apis.includes('unsplash')) {
            const response = await axios.get(`https://source.unsplash.com/1600x900/?${category}`);
            imageUrl = response.request.res.responseUrl;
        } else if (config.apis.includes('pexels')) {
            const response = await axios.get(`https://api.pexels.com/v1/search?query=${category}&per_page=1`, {
                headers: { Authorization: process.env.PEXELS_API_KEY },
            });
            imageUrl = response.data.photos[0]?.src?.original;
        }
        
        if (imageUrl) {
            const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
            const imageId = uuidv4();
            const imagePath = path.join(IMAGE_DIR, `${imageId}.jpg`);
            fs.writeFileSync(imagePath, imageResponse.data);
            config.latestImage = `/static/${imageId}.jpg`;
        }
    } catch (error) {
        console.error('Error fetching new image:', error);
    }
};

schedule.scheduleJob(`*/${config.refreshInterval} * * * *`, fetchNewImage);
fetchNewImage();

app.get('/config', (req, res) => {
    res.json(config);
});

app.get('/image', (req, res) => {
    if (config.latestImage) {
        res.redirect(config.latestImage);
    } else {
        res.status(404).send('No image available yet.');
    }
});

app.use('/static', express.static(IMAGE_DIR));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
