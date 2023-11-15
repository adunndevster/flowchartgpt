const { app, HttpRequest, HttpResponseInit, InvocationContext } = require("@azure/functions");

async function flowchartgpt(request, context) {
    context.log(`Http function processed request for url "${request.url}"`);

    // Get the Mermaid chart string from the request
    const chartString = request.query.get('chart') || await request.text();
    
    if (!chartString) {
        return { body: 'No chart string provided', status: 400 };
    }
    let svgContent;

    try {
        // Dynamically import mermaid
        //const mermaid = (await import('mermaid')).default;
        const mermaid = require("headless-mermaid");
        
        // Convert the Mermaid string to SVG
        svgContent = await mermaid.execute(chartString);
        
    } catch (error) {
        context.log(`Error processing Mermaid chart: ${error}`);
        return { body: 'Error processing Mermaid chart', status: 500 };
    }

    //const svgContent = container.innerHTML;

    // Return the HTML content
    return {
        body: svgContent,
        headers: { 'Content-Type': 'text/html' }
    };
};

app.http('flowchartgpt', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: flowchartgpt
});
