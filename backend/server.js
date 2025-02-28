// server/server.js

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const cheerio = require('cheerio');
const { NlpManager } = require('node-nlp');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Simulated documentation responses for fallback
const responses = {
    segment: {
        setupSource: "To set up a new source in Segment, first navigate to the Sources tab, click on 'Add Source', select your source type, and follow the configuration steps. For more details, please refer to the Segment Documentation.",
        advanced: "For advanced configurations in Segment, you can customize tracking plans and use server-side libraries. Check the official docs for detailed examples."
    },
    mparticle: {
        createUser: "To create a user profile in mParticle, log in to your dashboard, go to the Users section, and click 'Create New User'. Fill in the required fields and save your changes.",
        advanced: "mParticle offers advanced integrations via SDKs and REST APIs. See the documentation for instructions on configuring custom data pipelines."
    },
    lytics: {
        buildAudience: "To build an audience segment in Lytics, start by selecting the Segments tab, then use the filter options to define your audience criteria. Review your segment and publish it.",
        advanced: "Lytics supports complex segmentation rules. For advanced use cases, combine multiple data attributes as explained in the docs."
    },
    zeotap: {
        integrateData: "To integrate your data with Zeotap, navigate to the Data Integration section, choose your data source, and follow the guided setup. Detailed steps are available in the Zeotap Documentation.",
        advanced: "Zeotap provides API-based data ingestion for enterprise scenarios. Refer to the docs for integration examples and advanced settings."
    }
};

// Initialize NLP Manager with English language support and NER enabled
const manager = new NlpManager({ languages: ['en'], forceNER: true });

// --- Training Data ---
// Segment intents
manager.addDocument('en', 'how do I set up a new source in segment', 'segment.setupSource');
manager.addDocument('en', 'setup source in segment', 'segment.setupSource');
manager.addDocument('en', 'how can I set up a source in segment', 'segment.setupSource');

// mParticle intents
manager.addDocument('en', 'how can I create a user profile in mparticle', 'mparticle.createUser');
manager.addDocument('en', 'create user profile in mparticle', 'mparticle.createUser');
manager.addDocument('en', 'how do I create a user in mparticle', 'mparticle.createUser');

// Lytics intents
manager.addDocument('en', 'how do I build an audience segment in lytics', 'lytics.buildAudience');
manager.addDocument('en', 'build audience segment in lytics', 'lytics.buildAudience');
manager.addDocument('en', 'create audience segment in lytics', 'lytics.buildAudience');

// Zeotap intents
manager.addDocument('en', 'how can I integrate my data with zeotap', 'zeotap.integrateData');
manager.addDocument('en', 'integrate data with zeotap', 'zeotap.integrateData');
manager.addDocument('en', 'data integration with zeotap', 'zeotap.integrateData');

// Advanced configurations
manager.addDocument('en', 'advanced segment configuration', 'segment.advanced');
manager.addDocument('en', 'segment advanced settings', 'segment.advanced');

manager.addDocument('en', 'advanced mparticle integrations', 'mparticle.advanced');
manager.addDocument('en', 'mparticle advanced configuration', 'mparticle.advanced');

manager.addDocument('en', 'advanced lytics configurations', 'lytics.advanced');
manager.addDocument('en', 'lytics advanced settings', 'lytics.advanced');

manager.addDocument('en', 'advanced zeotap settings', 'zeotap.advanced');
manager.addDocument('en', 'zeotap advanced configuration', 'zeotap.advanced');

// Cross-CDP comparisons
manager.addDocument('en', 'compare segment and lytics', 'cross.compare');
manager.addDocument('en', 'how does segment compare to lytics', 'cross.compare');
manager.addDocument('en', 'compare mparticle and zeotap', 'cross.compare');

// --- Responses ---
// Direct answers mapped to intents (fallbacks if dynamic extraction is not used)
manager.addAnswer('en', 'segment.setupSource', responses.segment.setupSource);
manager.addAnswer('en', 'mparticle.createUser', responses.mparticle.createUser);
manager.addAnswer('en', 'lytics.buildAudience', responses.lytics.buildAudience);
manager.addAnswer('en', 'zeotap.integrateData', responses.zeotap.integrateData);

manager.addAnswer('en', 'segment.advanced', responses.segment.advanced);
manager.addAnswer('en', 'mparticle.advanced', responses.mparticle.advanced);
manager.addAnswer('en', 'lytics.advanced', responses.lytics.advanced);
manager.addAnswer('en', 'zeotap.advanced', responses.zeotap.advanced);

manager.addAnswer('en', 'cross.compare', "Cross-CDP Comparison: Each platform has a unique approach. For example, Segment focuses on real-time data routing, whereas Lytics emphasizes audience segmentation. Please specify which aspects you wish to compare.");

// Train the NLP model on startup
(async () => {
    await manager.train();
    manager.save();
    console.log('NLP model trained.');
})();

/**
 * Function to fetch and extract documentation content.
 * For demonstration, this function fetches the HTML and looks for a simple text snippet.
 * In production, you might pre-index content or apply more advanced parsing.
 */
async function extractDocumentation(platform, query) {
    let url;
    if (platform === 'segment') {
        url = 'https://segment.com/docs/?ref=nav';
    } else if (platform === 'mparticle') {
        url = 'https://docs.mparticle.com/';
    } else if (platform === 'lytics') {
        url = 'https://docs.lytics.com/';
    } else if (platform === 'zeotap') {
        url = 'https://docs.zeotap.com/home/en-us/';
    } else {
        return "Unknown platform.";
    }

    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
            }
        });
        const $ = cheerio.load(response.data);
        const content = $('body').text();
        if (content.toLowerCase().includes(query.toLowerCase())) {
            return `The documentation for ${platform} appears to cover your query "${query}".`;
        }
        return `No direct match found for "${query}" in ${platform} documentation.`;
    } catch (error) {
        return `Error fetching documentation for ${platform}: ${error.message}`;
    }
}


// Endpoint to process queries using NLP and optionally extract documentation content
app.post('/api/query', async (req, res) => {
    const { query } = req.body;
    if (!query) {
        return res.status(400).json({ error: 'Query is required.' });
    }

    try {
        const nlpResult = await manager.process('en', query);
        // If the NLP result has a recognized intent, use it
        let answer = nlpResult.answer;

        // If the intent corresponds to a known platform, try dynamic extraction.
        // This demo checks if the intent contains a dot (e.g., "segment.setupSource").
        if (nlpResult.intent && nlpResult.intent.includes('.')) {
            const [platform] = nlpResult.intent.split('.');
            // Attempt to fetch and extract documentation content based on the query
            const docSnippet = await extractDocumentation(platform, query);
            // Combine the dynamic extraction with the NLP answer for a richer response.
            answer = `${nlpResult.answer}`;
        }

        // Fallback message if no confident answer is found
        if (!answer) {
            answer = "I'm sorry, I can only help with how-to questions related to Segment, mParticle, Lytics, and Zeotap.";
        }
        res.json({ answer });
    } catch (error) {
        console.error('Error processing query:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
