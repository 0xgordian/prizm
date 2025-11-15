# Prizm

A modern color palette creator that helps designers and developers transform colors across formats, craft beautiful color schemes, extract palettes from images, check accessibility, and simulate colour blindness.

## What Prizm Does

Prizm is built for designers and developers who want to create perfect color palettes. The application combines powerful color manipulation tools with an intuitive interface, making it easy to work with colors across multiple formats and contexts.

## Core Features

- **Transform Colors Across Formats**: Convert between HEX, RGB, HSL, OKLCH, and more
- **Craft Beautiful Color Schemes**: Generate analogous, complementary, triadic, and monochromatic palettes
- **Extract Palettes from Images**: Upload any image to automatically extract dominant colors
- **Check Accessibility**: Ensure your color choices meet accessibility standards
- **Simulate Colour Blindness**: Preview how your palettes appear to users with different types of color blindness
- **Extract from Websites**: Pull color palettes directly from any webpage
- **Export Options**: Generate CSS variables and Tailwind configurations
- **Modern Interface**: Clean, responsive design with light and dark mode support

## Technology

Prizm is built with modern web technologies:

- **Framework**: Next.js with React
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Color Engine**: colord and colorizr for advanced color manipulation
- **Animations**: motion/react for smooth interactions

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/yourusername/prizm.git
cd prizm
```

2. Install dependencies:

```bash
pnpm install
```

3. Start the development server:

```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## How to Use Prizm

### Create a Color Palette

1. Enter any color in the input field (supports HEX, RGB, HSL, OKLCH formats)
2. Press Enter or click to add the color to your palette
3. Generate variations using Palette, Scheme, or Swatch generators

### Extract from Images

1. Click the upload button to select an image
2. Prizm automatically extracts the dominant colors
3. Add individual colors or the complete palette to your collection

### Extract from Websites

1. Enter any website URL in the URL extractor
2. Prizm fetches and analyzes the site's CSS colors
3. Select and add colors from the extracted palette

### Export Your Work

1. Click "Export CSS" to see all your colors
2. Choose between CSS Variables or Tailwind Config
3. Select your preferred color format (HEX, RGB, HSL, OKLCH)
4. Copy the generated code with one click

### Test Accessibility

Use the color blindness simulator to preview how your palette appears to users with:
- Protanopia (red-blindness)
- Deuteranopia (green-blindness)  
- Tritanopia (blue-blindness)
- Achromatopsia (total color blindness)

## License

MIT
