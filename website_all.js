const PercyScript = require('@percy/script');

// Function to ensure all images are loaded
async function waitForImagesToLoad(page) {
  console.log('Waiting for images to load...');
  const imageLoadResult = await page.evaluate(async () => {
    const selectors = Array.from(document.querySelectorAll('img'));
    console.log(`Found ${selectors.length} images.`);

    return Promise.all(selectors.map(img => {
      if (img.complete) {
        console.log(`Image already complete: ${img.src}`);
        return Promise.resolve();
      }
      return new Promise((resolve) => {
        img.addEventListener('load', () => {
          console.log(`Image loaded: ${img.src}`);
          resolve();
        });
        img.addEventListener('error', () => {
          console.error(`Image failed to load: ${img.src}`);
          resolve(); // Continue even if an image fails to load
        });
        setTimeout(() => {
          console.error(`Image load timeout: ${img.src}`);
          resolve(); // Continue even if an image times out
        }, 10000); // 10 seconds timeout
      });
    }));
  });

  console.log('Image load results:', imageLoadResult);
  console.log('All images loaded.');
}

// Function to scroll and trigger lazy loading
async function triggerLazyLoading(page) {
  console.log('Scrolling to trigger lazy loading...');
  let previousHeight;
  let newHeight = await page.evaluate('document.body.scrollHeight');
  while (previousHeight !== newHeight) {
    previousHeight = newHeight;
    await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second
    newHeight = await page.evaluate('document.body.scrollHeight');
  }
  console.log('Scrolling complete.');
}

// Main function to run the Percy script
PercyScript.run(async (page, percySnapshot) => {
  try {
    // Set viewport to desktop size
    await page.setViewport({ width: 1280, height: 1024 });

    // Helper function to navigate and take snapshot
    async function navigateAndSnapshot(url, snapshotName) {
      console.log(`Navigating to ${url}...`);
      await page.goto(url, { waitUntil: 'networkidle2' });
      console.log(`${url} navigation complete.`);
      await waitForImagesToLoad(page);
      await triggerLazyLoading(page);
      console.log(`Taking Percy snapshot for ${snapshotName}...`);
      await percySnapshot(snapshotName);
      console.log(`${snapshotName} snapshot taken.`);
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
