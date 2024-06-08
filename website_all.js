const PercyScript = require('@percy/script');

// Function to ensure all images are loaded
async function waitForImagesToLoad(page) {
  // Your existing function code
}

// Function to scroll and trigger lazy loading
async function triggerLazyLoading(page) {
  // Your existing function code
}

// Main function to run the Percy script
PercyScript.run(async (page, percySnapshot) => {
  try {
    // Set multiple viewport sizes
    const viewports = [
      { width: 1366, height: 768 },
      { width: 1440, height: 900 },
      { width: 1920, height: 1080 }
    ];

    // Helper function to navigate and take snapshot
    async function navigateAndSnapshot(url, snapshotName, additionalSteps) {
      for (let viewport of viewports) {
        await page.setViewport(viewport);
        console.log(`Navigating to ${url} at ${viewport.width}x${viewport.height}...`);
        await page.goto(url, { waitUntil: 'networkidle2' });
        console.log(`${url} navigation complete.`);
        await waitForImagesToLoad(page);
        await triggerLazyLoading(page);
        if (additionalSteps) {
          await additionalSteps();
        }
        console.log(`Taking Percy snapshot for ${snapshotName} at ${viewport.width}x${viewport.height}...`);
        await percySnapshot(`${snapshotName} (${viewport.width}x${viewport.height})`);
        console.log(`${snapshotName} snapshot taken.`);
      }
    }

    // Visit the pages and take snapshots in the correct order
    await navigateAndSnapshot('https://www.multion.ai/', '1. Homepage Snapshot');
    await navigateAndSnapshot('https://www.multion.ai/api', '2. API Overview Page Snapshot');
    await navigateAndSnapshot('https://www.multion.ai/api/pricing', '3. API Pricing Page Snapshot');
    await navigateAndSnapshot('https://www.multion.ai/about', '4. About Page Snapshot');
    await navigateAndSnapshot('https://www.multion.ai/blog', '5. Blog Page Snapshot');
    await navigateAndSnapshot('https://www.multion.ai/blog?type=product', '6. Blog Page Product Type Snapshot');
    await navigateAndSnapshot('https://www.multion.ai/blog?type=company', '7. Blog Page Company Type Snapshot');
    await navigateAndSnapshot('https://www.multion.ai/careers', '8. Careers Page Snapshot');
    await navigateAndSnapshot('https://www.multion.ai/contact', '9. Contact Page Snapshot');
  } catch (error) {
    console.error('Error occurred:', error);
  }
});
