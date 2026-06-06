const { Jimp } = require('jimp');

async function removeWhite() {
  try {
    const image = await Jimp.read('c:\\AppsMiga\\NexCV\\public\\images\\logo.png');
    console.log('Image loaded. Processing...');
    
    // Scan all pixels
    image.scan((x, y, idx) => {
      const r = image.bitmap.data[idx];
      const g = image.bitmap.data[idx + 1];
      const b = image.bitmap.data[idx + 2];
      
      // If pixel is white or very close to white, make it transparent
      if (r > 240 && g > 240 && b > 240) {
        image.bitmap.data[idx + 3] = 0; // Set Alpha to 0
      }
    });
    
    await image.write('c:\\AppsMiga\\NexCV\\public\\images\\logo.png');
    console.log('Background removed successfully.');
  } catch (error) {
    console.error('Error:', error);
  }
}

removeWhite();
