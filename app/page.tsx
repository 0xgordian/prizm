"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useColorStore } from "./store/colorStore";
import {
  getColorFormats,
  generateAdvancedCssVariables,
  generateTailwindConfig,
} from "./utils/colorUtils";
import { generateColors } from "./utils/colorUtils";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Copy,
  Trash2,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import * as colorBlind from "color-blind";
import { motion, AnimatePresence } from "motion/react";
import { URLExtractor } from "@/components/url-extractor";
import { Header } from "@/components/header";

export default function Home() {
  const {
    colors,
    showExport,
    addColor,
    removeColor,
    removeAllColors,
    setShowExport,
    setColorName,
    colorNames,
  } = useColorStore();

  const [generatorModal, setGeneratorModal] = useState<{
    isOpen: boolean;
    type: "palette" | "scheme" | "swatch";
    baseColor: string;
  }>({
    isOpen: false,
    type: "palette",
    baseColor: "",
  });

  const [paletteType, setPaletteType] = useState<
    "analogous" | "monochromatic" | "complementary" | "triadic"
  >("analogous");
  const [schemeType, setSchemeType] = useState<
    "analogous" | "complementary" | "triadic"
  >("complementary");

  const [cssFormat, setCssFormat] = useState<"hex" | "rgb" | "hsl" | "oklch">(
    "hex",
  );
  const [tailwindFormat, setTailwindFormat] = useState<
    "hex" | "rgb" | "hsl" | "oklch"
  >("hex");

  const [blindnessType, setBlindnessType] = useState<
    "normal" | "protanopia" | "deuteranopia" | "tritanopia" | "achromatopsia"
  >("normal");

  const [generatedColors, setGeneratedColors] = useState<string[]>([]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("code copied to clipboard");
  };

  const exportColors = (type: string) => {
    let content = "";

    switch (type) {
      case "css-hex":
        content = generateAdvancedCssVariables(colors, {
          format: "hex",
          useModernSyntax: true,
        });
        break;
      case "css-rgb":
        content = generateAdvancedCssVariables(colors, {
          format: "rgb",
          useModernSyntax: true,
        });
        break;
      case "css-hsl":
        content = generateAdvancedCssVariables(colors, {
          format: "hsl",
          useModernSyntax: true,
        });
        break;
      case "css-oklch":
        content = generateAdvancedCssVariables(colors, {
          format: "oklch",
          useModernSyntax: true,
        });
        break;
      case "tailwind-hex":
        content = generateTailwindConfig(colors, "hex");
        break;
      case "tailwind-rgb":
        content = generateTailwindConfig(colors, "rgb");
        break;
      case "tailwind-hsl":
        content = generateTailwindConfig(colors, "hsl");
        break;
      case "tailwind-oklch":
        content = generateTailwindConfig(colors, "oklch");
        break;
    }

    copyToClipboard(content);
  };

  const handleColorGenerate = (
    color: string,
    type: "palette" | "scheme" | "swatch",
  ) => {
    try {
      let generated: string[] = [];

      switch (type) {
        case "palette":
          generated = generateColors(color, "palette", {
            paletteType: paletteType,
          });
          break;
        case "scheme":
          generated = generateColors(color, "scheme", {
            schemeType: schemeType,
          });
          break;
        case "swatch":
          generated = generateColors(color, "swatch");
          break;
      }

      setGeneratedColors(generated);
      setGeneratorModal({ isOpen: true, type, baseColor: color });
    } catch (error) {
      toast.error(`Failed to generate ${type}`);
    }
  };

  const getSimulatedColor = (color: string) => {
    if (blindnessType === "normal") return color;
    try {
      return (colorBlind as any)[blindnessType](color);
    } catch (error) {
      console.error("Error simulating color blindness:", error);
      return color;
    }
  };

  return (
    <main className="min-h-dvh flex flex-col">
      <Header />
      <div className="flex flex-col mx-auto w-full max-w-2xl px-4 py-6">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-in fade-in duration-1000">
          <div className="mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-wide lowercase" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>prizm</h1>
            <p className="text-xs md:text-sm text-muted-foreground font-light lowercase tracking-wide">
              create perfect palettes
            </p>
          </div>

          <div className="max-w-3xl mx-auto mb-12">
            <p className="text-sm md:text-base font-medium text-muted-foreground leading-relaxed mb-1 tracking-wide">
              Transform colors across formats, craft beautiful color schemes,
            </p>
            <p className="text-sm md:text-base font-medium text-muted-foreground leading-relaxed tracking-wide">
              extract palettes from images, check accessibility, and simulate colour blindness.
            </p>
          </div>

          {/* Color Blindness Simulation */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-3 px-4 py-2 border border-border/50 rounded-md bg-background/50">
              <span className="text-sm text-muted-foreground font-medium">Simulate</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-7 px-3 text-sm">
                    {blindnessType.charAt(0).toUpperCase() + blindnessType.slice(1)}
                    <ChevronDown className="h-3 w-3 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center">
                  <DropdownMenuItem onClick={() => setBlindnessType("normal")}>
                    Normal
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setBlindnessType("protanopia")}>
                    Protanopia
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setBlindnessType("deuteranopia")}>
                    Deuteranopia
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setBlindnessType("tritanopia")}>
                    Tritanopia
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setBlindnessType("achromatopsia")}>
                    Achromatopsia
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Color Swatch Showcase */}
        <div className="flex justify-center mb-16">
          <motion.div
            className="flex gap-3 p-4 bg-card/30 rounded-2xl border border-border/30 backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            {['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'].map((color, i) => (
              <motion.div
                key={i}
                className="w-8 h-8 rounded-lg border border-border/50 cursor-pointer transition-all duration-500 ease-in-out"
                style={{ backgroundColor: getSimulatedColor(color) }}
                onClick={() => addColor(color)}
                whileHover={{
                  scale: 1.2,
                  rotate: 8,
                  boxShadow: "0 12px 30px rgba(0,0,0,0.2)"
                }}
                whileTap={{ scale: 0.9 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 17
                }}
              />
            ))}
          </motion.div>
        </div>

        {/* URL Extractor Section */}
        <div className="mb-16">
          <URLExtractor />
        </div>

        {colors.length > 0 ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-card rounded-lg border shadow-sm p-6 mb-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">{colors.length} Color{colors.length > 1 ? "s" : ""}</h2>
                <div className="flex gap-2">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button variant="outline" onClick={() => { removeAllColors(); toast("All colors discarded"); }} className="h-9 px-4 rounded-full border border-border/60 hover:border-border/80 hover:bg-accent/30 transition-all duration-200">
                      Clear All
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button onClick={() => setShowExport(!showExport)} className="h-9 px-4 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground border border-primary/20 transition-all duration-200 shadow-sm hover:shadow-md">
                      Export CSS
                    </Button>
                  </motion.div>
                </div>
              </div>

              <AnimatePresence mode="popLayout">
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: {
                      transition: {
                        staggerChildren: 0.1,
                      },
                    },
                  }}
                >
                  {colors.map((color: string, index: number) => {
                    const formats = getColorFormats(color);
                    return (
                      <motion.div
                        key={color}
                        layout
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 25,
                          layout: { duration: 0.3 }
                        }}
                        className="bg-background rounded-md border p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <input
                            value={colorNames[index] || `Color ${index + 1}`}
                            onChange={(e) => setColorName(index, e.target.value)}
                            onBlur={(e) => { if (!e.target.value.trim()) setColorName(index, `Color ${index + 1}`); }}
                            className="border-none focus:ring-0 focus:ring-offset-0 focus:outline-none font-medium text-sm md:text-base bg-transparent placeholder:text-muted-foreground/70 px-1 py-0.5 rounded"
                            placeholder="Color name"
                          />
                          <Button variant="ghost" size="sm" onClick={() => removeColor(index)} className="h-8 w-8 p-0 opacity-70 hover:opacity-100">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <motion.div
                          className="h-16 rounded-md mb-3 border transition-all duration-500 ease-in-out"
                          style={{ backgroundColor: getSimulatedColor(color) }}
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        />

                        <div className="max-h-32 overflow-y-auto">
                          <div className="space-y-2">
                            {Object.entries(formats).map(([format, value]) => (
                              <motion.div
                                key={format}
                                className="flex items-center justify-between text-sm"
                                whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                                transition={{ duration: 0.2 }}
                              >
                                <span className="text-muted-foreground uppercase text-xs">{format}:</span>
                                <div className="flex items-center gap-2">
                                  <span className="font-mono">{value}</span>
                                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(value)} className="h-7 w-7 p-0 rounded-full hover:bg-accent/50 border border-transparent hover:border-border/30 transition-all duration-200">
                                      <Copy className="h-3 w-3" />
                                    </Button>
                                  </motion.div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-2 mt-3">
                          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button variant="outline" size="sm" onClick={() => handleColorGenerate(color, "palette")} className="h-8 px-3 text-xs rounded-full border border-border/60 hover:border-border/80 hover:bg-accent/30 transition-all duration-200">
                              Palette
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button variant="outline" size="sm" onClick={() => handleColorGenerate(color, "scheme")} className="h-8 px-3 text-xs rounded-full border border-border/60 hover:border-border/80 hover:bg-accent/30 transition-all duration-200">
                              Scheme
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button variant="outline" size="sm" onClick={() => handleColorGenerate(color, "swatch")} className="h-8 px-3 text-xs rounded-full border border-border/60 hover:border-border/80 hover:bg-accent/30 transition-all duration-200">
                              Swatch
                            </Button>
                          </motion.div>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </div>

            {showExport && (
              <div className="bg-card rounded-lg border shadow-sm p-6 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Export</h3>
                  <Button variant="ghost" size="sm" onClick={() => setShowExport(false)} className="h-8 w-8 p-0 rounded-full hover:bg-accent/50 border border-transparent hover:border-border/30 transition-all duration-200">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </div>

                <Tabs defaultValue="css" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="css">CSS Variables</TabsTrigger>
                    <TabsTrigger value="tailwind">Tailwind Config</TabsTrigger>
                  </TabsList>

                  <TabsContent value="css" className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Format:</span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            {cssFormat.toUpperCase()} <ChevronDown className="h-3 w-3 ml-1" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => setCssFormat("hex")}>HEX</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setCssFormat("rgb")}>RGB</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setCssFormat("hsl")}>HSL</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setCssFormat("oklch")}>OKLCH</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="bg-muted/30 p-4 rounded-md max-h-64 overflow-y-auto border border-border/50 rounded-lg">
                      <pre className="text-xs md:text-sm font-mono whitespace-pre-wrap overflow-x-auto leading-relaxed">
                        {generateAdvancedCssVariables(colors, { format: cssFormat, useModernSyntax: true })}
                      </pre>
                    </div>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button variant="outline" size="sm" className="mt-3 w-full" onClick={() => exportColors(`css-${cssFormat}`)}>
                        <Copy className="h-3 w-3 mr-1" /> Copy CSS Variables
                      </Button>
                    </motion.div>
                  </TabsContent>

                  <TabsContent value="tailwind" className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Format:</span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            {tailwindFormat.toUpperCase()} <ChevronDown className="h-3 w-3 ml-1" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => setTailwindFormat("hex")}>HEX</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setTailwindFormat("rgb")}>RGB</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setTailwindFormat("hsl")}>HSL</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setTailwindFormat("oklch")}>OKLCH</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="bg-muted/30 p-4 rounded-md max-h-64 overflow-y-auto border border-border/50 rounded-lg">
                      <pre className="text-xs md:text-sm font-mono whitespace-pre-wrap overflow-x-auto leading-relaxed">
                        {generateTailwindConfig(colors, tailwindFormat)}
                      </pre>
                    </div>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button variant="outline" size="sm" className="mt-3 w-full" onClick={() => exportColors(`tailwind-${tailwindFormat}`)}>
                        <Copy className="h-3 w-3 mr-1" /> Copy Tailwind Config
                      </Button>
                    </motion.div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
        ) : null}

        <Dialog
          open={generatorModal.isOpen}
          onOpenChange={(open) =>
            setGeneratorModal((prev) => ({ ...prev, isOpen: open }))
          }
        >
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {generatorModal.type} from {generatorModal.baseColor}
              </DialogTitle>
              <DialogDescription>
                {generatorModal.type === "palette" &&
                  `${paletteType} color palette`}
                {generatorModal.type === "scheme" && `${schemeType} color scheme`}
                {generatorModal.type === "swatch" &&
                  "Color swatch from light to dark"}
              </DialogDescription>
            </DialogHeader>

            <div className="flex gap-4">
              {generatorModal.type === "palette" && (
                <div className="flex-1 mb-4 flex flex-col gap-2">
                  <Label className="text-xs text-muted-foreground">
                    Palette Type
                  </Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between text-sm border-dashed"
                      >
                        {paletteType.charAt(0).toUpperCase() +
                          paletteType.slice(1)}
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="start"
                      className="w-[var(--radix-dropdown-menu-trigger-width)]"
                    >
                      <DropdownMenuItem
                        onClick={() => {
                          setPaletteType("analogous");
                          handleColorGenerate(
                            generatorModal.baseColor,
                            "palette",
                          );
                        }}
                      >
                        Analogous
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setPaletteType("monochromatic");
                          handleColorGenerate(
                            generatorModal.baseColor,
                            "palette",
                          );
                        }}
                      >
                        Monochromatic
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setPaletteType("complementary");
                          handleColorGenerate(
                            generatorModal.baseColor,
                            "palette",
                          );
                        }}
                      >
                        Complementary
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setPaletteType("triadic");
                          handleColorGenerate(
                            generatorModal.baseColor,
                            "palette",
                          );
                        }}
                      >
                        Triadic
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}

              {generatorModal.type === "scheme" && (
                <div className="flex-1 mb-4 flex flex-col gap-2">
                  <Label className="text-xs text-muted-foreground">
                    Scheme Type
                  </Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between text-sm border-dashed"
                      >
                        {schemeType.charAt(0).toUpperCase() + schemeType.slice(1)}
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="start"
                      className="w-[var(--radix-dropdown-menu-trigger-width)]"
                    >
                      <DropdownMenuItem
                        onClick={() => {
                          setSchemeType("complementary");
                          handleColorGenerate(generatorModal.baseColor, "scheme");
                        }}
                      >
                        Complementary
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSchemeType("analogous");
                          handleColorGenerate(generatorModal.baseColor, "scheme");
                        }}
                      >
                        Analogous
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSchemeType("triadic");
                          handleColorGenerate(generatorModal.baseColor, "scheme");
                        }}
                      >
                        Triadic
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>

            <div className="max-h-64 overflow-y-auto">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {generatedColors.map((genColor, idx) => (
                  <div key={idx} className="border border-dashed overflow-hidden">
                    <motion.div
                      className="h-16 w-full border-b border-dashed transition-all duration-500 ease-in-out"
                      style={{ backgroundColor: getSimulatedColor(genColor) }}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    />
                    <div className="p-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs line-clamp-1">
                          {genColor}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyToClipboard(genColor)}
                          className="h-6 w-6"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="outline"
                  onClick={() => setGeneratorModal((prev) => ({ ...prev, isOpen: false }))}
                  className="px-6 py-2 h-10 rounded-full border border-border/60 hover:border-border/80 hover:bg-accent/30 transition-all duration-200"
                >
                  Close
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={() => {
                    generatedColors.forEach((color) => addColor(color));
                    toast.success(`Added ${generatedColors.length} colors`);
                    setGeneratorModal((prev) => ({ ...prev, isOpen: false }));
                  }}
                  className="px-6 py-2 h-10 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground border border-primary/20 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  Add All
                </Button>
              </motion.div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
}
