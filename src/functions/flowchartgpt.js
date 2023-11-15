const { app, HttpRequest, HttpResponseInit, InvocationContext } = require("@azure/functions");

async function flowchartgpt(request, context) {
    context.log(`Http function processed request for url "${request.url}"`);

    // Get the Mermaid chart string from the request
    const chartString = request.query.get('chart') || await request.text();
    
    if (!chartString) {
        return { body: 'No chart string provided', status: 400 };
    }

    let htmlContent;

    try {
        // Dynamically import mermaid
        const mermaid = await import('mermaid');

        // Convert the Mermaid string to SVG
        mermaid.mermaidAPI.render('mermaidChart', chartString, (svgCode) => {
            htmlContent = `<div>${svgCode}</div>`;
        });
    } catch (error) {
        context.log(`Error processing Mermaid chart: ${error}`);
        return { body: 'Error processing Mermaid chart', status: 500 };
    }

    // Return the HTML content
    return {
        body: htmlContent,
        headers: { 'Content-Type': 'text/html' }
    };
};

app.http('flowchartgpt', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: flowchartgpt
});
