import { isValidColor } from "colorizr";

// CSS color patterns to match different color formats
const COLOR_PATTERNS = [
  // Hex colors (3, 4, 6, 8 digits)
  /#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/g,
  
  // RGB/RGBA colors
  /\brgba?\(\s*(\d{1,3}\s*,\s*){2,3}\d{1,3}\s*(,\s*(0|1|0?\.\d+))?\s*\)/gi,
  
  // HSL/HSLA colors
  /\bhsla?\(\s*\d+(?:\.\d+)?(?:deg|turn|rad|grad)?\s*,\s*\d+(?:\.\d+)?%\s*,\s*\d+(?:\.\d+)?%\s*(,\s*(0|1|0?\.\d+))?\s*\)/gi,
  
  // OKLCH colors
  /\boklch\(\s*\d*\.?\d+\s+\d*\.?\d+\s+\d*\.?\d+(?:\s*,\s*\d*\.?\d+)?\s*\)/gi,
  
  // HWB colors
  /\bhwb\(\s*\d+(?:\.\d+)?(?:deg|turn|rad|grad)?\s+\d+(?:\.\d+)?%\s+\d+(?:\.\d+)?%\s*(,\s*\d*\.?\d+)?\s*\)/gi,
  
  // Named colors (subset of CSS colors for performance)
  /\b(red|blue|green|yellow|orange|purple|pink|brown|gray|grey|black|white|cyan|magenta|lime|navy|olive|maroon|aqua|silver|teal|fuchsia|gold|coral|salmon|crimson|indigo|violet|plum|orchid|turquoise|peach|beige|ivory|lavender|mint|khaki|sienna|tan|wheat|whitesmoke|gainsboro|lightgray|darkgray|darkgrey|lightgrey)\b/gi,
  
  // Modern CSS Level 4 color functions
  /\b(color\([^)]+\)|lab\([^)]+\)|lch\([^)]+\)|oklab\([^)]+\))\)/gi,
];

// CORS proxy service - in a real app, you'd want to use your own
const CORS_PROXY = "https://corsproxy.io/?";
const FALLBACK_PROXY = "https://api.allorigins.win/raw?url=";

export async function extractCSSColors(url: string): Promise<{ 
  colors: string[]; 
  pageTitle: string;
}> {
  try {
    // Test CORS with multiple proxy services
    let response;
    let attemptCount = 0;
    const maxAttempts = 3;
    const proxies = [CORS_PROXY, FALLBACK_PROXY];

    while (attemptCount < maxAttempts && !response?.ok) {
      try {
        const proxyUrl = `${proxies[attemptCount % proxies.length]}${encodeURIComponent(url)}`;
        
        response = await fetch(proxyUrl, {
          method: "GET",
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          },
        });

        if (!response.ok) {
          attemptCount++;
          continue;
        }

        const html = await response.text();
        
        // Parse the HTML and extract colors
        const colors = extractColorsFromHTML(html);
        
        // Extract page title
        const pageTitle = extractPageTitle(html);

        return {
          colors: [...new Set(colors)], // Remove duplicates while preserving order
          pageTitle,
        };
      } catch (proxyError) {
        console.warn(`Proxy attempt ${attemptCount + 1} failed:`, proxyError);
        attemptCount++;
      }
    }

    throw new Error("All proxy attempts failed");
  } catch (error) {
    console.error("Failed to fetch and extract colors:", error);
    throw new Error("Unable to extract colors from the webpage");
  }
}

function extractColorsFromHTML(html: string): string[] {
  const colors: string[] = [];
  
  // Remove comments and script/style tags to avoid false positives
  const cleanedHTML = html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+style\s*=\s*["'][^"']*["'][^>]*>/gi, (match) => {
      // Extract style attribute values
      const styleMatch = match.match(/style\s*=\s*["']([^"']*)["']/i);
      if (styleMatch) {
        colors.push(...extractColorsFromCSS(styleMatch[1]));
      }
      return '';
    });

  // Extract from style attributes
  colors.push(...extractColorsFromCSS(cleanedHTML));

  // Extract from CSS rules in style tags
  const styleTags = cleanedHTML.match(/<style[^>]*>([\s\S]*?)<\/style>/gi);
  if (styleTags) {
    styleTags.forEach(styleTag => {
      const cssContent = styleTag.replace(/<style[^>]*>/, '').replace(/<\/style>/, '');
      colors.push(...extractColorsFromCSS(cssContent));
    });
  }

  // Extract from inline styles in style attributes
  const inlineStyles = cleanedHTML.match(/style\s*=\s*["'][^"']*["']/gi);
  if (inlineStyles) {
    inlineStyles.forEach(styleAttr => {
      const styleValue = styleAttr.match(/["']([^"']*)["']/)?.[1] || '';
      colors.push(...extractColorsFromCSS(styleValue));
    });
  }

  // Filter valid colors and normalize
  return colors
    .filter(color => isValidColor(color))
    .map(color => color.toLowerCase().trim());
}

function extractColorsFromCSS(cssText: string): string[] {
  const colors: string[] = [];
  
  COLOR_PATTERNS.forEach(pattern => {
    const matches = cssText.match(pattern);
    if (matches) {
      colors.push(...matches);
    }
  });

  return colors;
}

function extractPageTitle(html: string): string {
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch) {
    return titleMatch[1].trim();
  }
  
  const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i);
  if (ogTitleMatch) {
    return ogTitleMatch[1].trim();
  }
  
  const twitterTitleMatch = html.match(/<meta[^>]*name=["']twitter:title["'][^>]*content=["']([^"']+)["']/i);
  if (twitterTitleMatch) {
    return twitterTitleMatch[1].trim();
  }

  return "Unknown Website";
}