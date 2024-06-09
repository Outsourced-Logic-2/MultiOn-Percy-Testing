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

    // Visit the Contact page
    console.log('Navigating to the Contact page...');
    await page.goto('https://www.multion.ai/contact', { waitUntil: 'networkidle2' });
    console.log('Contact page navigation complete.');
    await waitForImagesToLoad(page);
    await triggerLazyLoading(page);
    console.log('Expanding all FAQs...');
    await page.evaluate(() => {
      document.querySelectorAll('[data-accordion-trigger]').forEach(button => {
        button.click();
      });
    });
    console.log('FAQs expanded.');
    console.log('Taking Percy snapshot for Contact page...');
    await percySnapshot('9. Contact Page Snapshot');
    console.log('Contact page snapshot taken.');

    // Visit the Careers page
    console.log('Navigating to the Careers page...');
    await page.goto('https://www.multion.ai/careers', { waitUntil: 'networkidle2' });
    console.log('Careers page navigation complete.');
    await waitForImagesToLoad(page);
    await new Promise(resolve => setTimeout(resolve, 5000)); // Additional wait for dynamic content
    await triggerLazyLoading(page);
    console.log('Taking Percy snapshot for Careers page...');
    await percySnapshot('8. Careers Page Snapshot');
    console.log('Careers page snapshot taken.');

    // Visit the Blog page with company type
    console.log('Navigating to the Blog page with company type...');
    await page.goto('https://www.multion.ai/blog?type=company', { waitUntil: 'networkidle2' });
    console.log('Blog page with company type navigation complete.');
    await waitForImagesToLoad(page);
    await triggerLazyLoading(page);
    console.log('Taking Percy snapshot for Blog page with company type...');
    await percySnapshot('7. Blog Page Company Type Snapshot');
    console.log('Blog page with company type snapshot taken.');

    // Visit the Blog page with product type
    console.log('Navigating to the Blog page with product type...');
    await page.goto('https://www.multion.ai/blog?type=product', { waitUntil: 'networkidle2' });
    console.log('Blog page with product type navigation complete.');
    await waitForImagesToLoad(page);
    await triggerLazyLoading(page);
    console.log('Taking Percy snapshot for Blog page with product type...');
    await percySnapshot('6. Blog Page Product Type Snapshot');
    console.log('Blog page with product type snapshot taken.');

    // Visit the Blog page
    console.log('Navigating to the Blog page...');
    await page.goto('https://www.multion.ai/blog', { waitUntil: 'networkidle2' });
    console.log('Blog page navigation complete.');
    await waitForImagesToLoad(page);
    await triggerLazyLoading(page);
    console.log('Taking Percy snapshot for Blog page...');
    await percySnapshot('5. Blog Page Snapshot');
    console.log('Blog page snapshot taken.');

    // Visit the About page
    console.log('Navigating to the About page...');
    await page.goto('https://www.multion.ai/about', { waitUntil: 'networkidle2' });
    console.log('About page navigation complete.');
    await waitForImagesToLoad(page);
    await triggerLazyLoading(page);
    console.log('Taking Percy snapshot for About page...');
    await percySnapshot('4. About Page Snapshot');
    console.log('About page snapshot taken.');

    // Visit the API pricing page
    console.log('Navigating to the API pricing page...');
    await page.goto('https://www.multion.ai/api/pricing', { waitUntil: 'networkidle2' });
    console.log('API pricing page navigation complete.');
    await waitForImagesToLoad(page);
    await triggerLazyLoading(page);
    console.log('Taking Percy snapshot for API pricing page...');
    await percySnapshot('3. API Pricing Page Snapshot');
    console.log('API pricing page snapshot taken.');

    // Visit the API overview page
    console.log('Navigating to the API overview page...');
    await page.goto('https://www.multion.ai/api', { waitUntil: 'networkidle2' });
    console.log('API overview page navigation complete.');
    await waitForImagesToLoad(page);
    await triggerLazyLoading(page);
    console.log('Taking Percy snapshot for API overview page...');
    await percySnapshot('2. API Overview Page Snapshot');
    console.log('API overview page snapshot taken.');

    // Visit the homepage
    console.log('Navigating to the homepage...');
    await page.goto('https://www.multion.ai/', { waitUntil: 'networkidle2' });
    console.log('Homepage navigation complete.');
    await waitForImagesToLoad(page);
    await triggerLazyLoading(page);
    console.log('Taking Percy snapshot for homepage...');
    await percySnapshot('1. Homepage Snapshot');
    console.log('Homepage snapshot taken.');
  } catch (error) {
    console.error('Error occurred:', error);
  }
});
