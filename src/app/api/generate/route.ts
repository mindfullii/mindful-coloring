import Replicate from "replicate";

export async function POST(req: Request) {
  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });

  try {
    const { prompt, aspectRatio, complexity } = await req.json();
    console.log('API Route - Received prompt:', prompt);
    
    // 使用结构化的 prompt，不需要额外增强
    const enhancedPrompt = prompt;
    
    const negativePrompt = "color, noise, text, watermark, signature, grey, gray, shading, gradient, background texture, shadows";
    
    console.log('API Route - Starting Replicate API call...');
    const output = await replicate.run(
      "pnickolas1/sdxl-coloringbook:d2b110483fdce03119b21786d823f10bb3f5a7c49a7429da784c5017df096d33",
      {
        input: {
          prompt: enhancedPrompt,
          negative_prompt: negativePrompt,
          width: aspectRatio === "2:3" ? 768 : aspectRatio === "3:2" ? 1024 : 768,
          height: aspectRatio === "2:3" ? 1024 : aspectRatio === "3:2" ? 768 : 768,
          num_inference_steps: complexity === "detailed" ? 40 : complexity === "simple" ? 20 : 30,
          guidance_scale: 7.5
        }
      }
    );
    console.log('API Route - Replicate response:', output);

    if (!output || !output[0]) {
      throw new Error('No output from Replicate API');
    }

    console.log('API Route - Fetching image from:', output[0]);
    const imageResponse = await fetch(output[0]);

    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.status} ${imageResponse.statusText}`);
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    console.log('API Route - Image buffer size:', imageBuffer.byteLength);

    return new Response(imageBuffer, {
      headers: { 
        'Content-Type': 'image/png',
        'Cache-Control': 'no-cache'
      },
    });
  } catch (error) {
    console.error('API Route - Error details:', error);
    return Response.json({ 
      error: error.message || "Failed to generate mindful art. Please try again.",
      details: error.toString()
    }, { status: 500 });
  }
} 