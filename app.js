import express from 'express';
import { configDotenv } from 'dotenv';
import expressEjsLayouts from 'express-ejs-layouts';
import prepareUploadFolders from './server/middleware/prepare-upload-folders.js';
import videoRoutes from './server/routes/video-routes.js';
import clearUploadFolders from './server/handlers/clear-upload-folders-handler.js';

// Load variables from .env file into process.env
configDotenv();

// Get port from env file
const port = process.env.PORT || 5000;

// Create an instance of an Express application
const app = express();

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Use express-ejs-layouts middleware
app.use(expressEjsLayouts);

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Set the EJS layout
app.set('layout', './layout/index.ejs');

// Prepare upload folders
app.use(prepareUploadFolders);

// Use video routes
app.use(videoRoutes);

// Clean up upload folders before server shutdown
process.on('SIGINT', () => {
  console.log('Server is shutting down. Cleaning up storage...');

  clearUploadFolders();

  setTimeout(() => {
    process.exit();
  }, 1000); // Time for cleanup
});

process.on('SIGTERM', () => {
  console.log('Server is terminating. Cleaning up storage...');

  clearUploadFolders();

  setTimeout(() => {
    process.exit();
  }, 1000); // Time for cleanup
});

// Start the server to listen on the port defined in env file
app.listen(port, () => console.log(`Server running on port ${port}`));
