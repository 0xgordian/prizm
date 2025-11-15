"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { useColorStore } from "@/app/store/colorStore";
import { extractCSSColors } from "@/app/utils/cssExtractor";
import { convert, isValidColor } from "colorizr";
import { handleFileUpload } from "@/app/utils/colorUtils";
import { Loader2, Copy, PaperclipIcon } from "lucide-react";

interface ExtractedColors {
  color: string;
  count: number;
  usage: "inline" | "css" | "style";
}

export function URLExtractor() {
  const [url, setUrl] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedColors, setExtractedColors] = useState<ExtractedColors[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [fetchedPageTitle, setFetchedPageTitle] = useState("");
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  
  const { addColor, colors } = useColorStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExtract = async () => {
    if (!url.trim()) {
      toast.error("Please enter a URL or color code");
      return;
    }

    const input = url.trim();
    
    // Check if it's a color code
    if (isValidColor(input)) {
      addColor(input);
      toast.success(`Added ${input} to palette`);
      setUrl("");
      return;
    }

    // Handle as URL
    try {
      // More flexible URL validation - add https:// if missing
      let cleanUrl = input;
      if (!/^https?:\/\//i.test(cleanUrl)) {
        cleanUrl = 'https://' + cleanUrl;
      }

      new URL(cleanUrl);
    } catch {
      toast.error("Please enter a valid URL or color code");
      return;
    }

    setIsExtracting(true);
    toast.loading("Extracting colors...");

    try {
      const { colors: extracted, pageTitle } = await extractCSSColors(input);
      setFetchedPageTitle(pageTitle);
      
      if (extracted.length === 0) {
        toast.dismiss();
        toast.error("No colors found on this webpage");
        setIsExtracting(false);
        return;
      }

      const colorCounts: Record<string, { count: number; color: string; usage: "inline" | "css" | "style" }> = {};
      
      extracted.forEach((color: string) => {
        const normalizedColor = convert(color, "hex");
        if (!colorCounts[normalizedColor]) {
          colorCounts[normalizedColor] = { count: 0, color: normalizedColor, usage: "css" as const };
        }
        colorCounts[normalizedColor].count++;
      });

      const sortedColors: ExtractedColors[] = Object.values(colorCounts)
        .sort((a, b) => b.count - a.count)
        .slice(0, 12);

      setExtractedColors(sortedColors);
      setShowResults(true);
      toast.dismiss();
      toast.success(`Found ${sortedColors.length} unique colors`);
    } catch (error) {
      console.error("Error extracting colors:", error);
      toast.dismiss();
      toast.error("Failed to extract colors from webpage");
    } finally {
      setIsExtracting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    handleFileUpload(file, {
      setIsExtracting: setIsProcessingFile,
      setUploadedImage: setUploadedImage,
      colors,
      addColor,
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const setUploadedImage = () => {
    // Set uploaded image URL for display
    // You could add state for this if needed
  };

  const addColorToPalette = (color: string) => {
    addColor(color);
    toast.success(`Added ${color} to palette`);
  };

  const addAllColors = () => {
    extractedColors.forEach(({ color }) => {
      addColor(color);
    });
    toast.success(`Added ${extractedColors.length} colors to palette`);
  };

  const copyColor = (color: string) => {
    navigator.clipboard.writeText(color);
    toast.success(`${color} copied`);
  };

  return (
    <div className="text-center">
      <div className="max-w-4xl mx-auto">
        {/* Mobile-first responsive layout */}
        <div className="space-y-3">
          {/* Main input field */}
          <div className="relative">
            <Input
              placeholder="enter url or color code"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleExtract()}
              disabled={isExtracting || isProcessingFile}
              className="w-full text-sm md:text-base px-4 py-2 rounded-lg border border-border/50 focus:border-primary focus:ring-0 focus:outline-none transition-colors bg-background/80 backdrop-blur-sm placeholder:text-muted-foreground/70"
            />
          </div>
          
          {/* Action buttons */}
          <div className="flex gap-3 justify-center">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={isExtracting || isProcessingFile}
                variant="outline"
                size="default"
                className="px-6 py-3 md:py-2 h-12 md:h-9 text-sm font-medium rounded-full border border-border/60 hover:border-border/80 hover:bg-accent/50 transition-all duration-200 bg-background/80 backdrop-blur-sm"
              >
                <motion.div
                  animate={isProcessingFile ? { rotate: 360 } : {}}
                  transition={isProcessingFile ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
                >
                  <PaperclipIcon className="h-4 w-4 mr-2" />
                </motion.div>
                Upload
              </Button>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={handleExtract}
                disabled={isExtracting || isProcessingFile || !url.trim()}
                className="px-8 py-3 md:py-2 h-12 md:h-9 text-sm font-medium rounded-full bg-primary hover:bg-primary/90 text-primary-foreground border border-primary/20 shadow-sm transition-all duration-200 hover:shadow-md"
              >
                {isExtracting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <div className="h-4 w-4 bg-current rounded-sm mr-2" />
                )}
                Extract
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      <Input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <Dialog open={showResults} onOpenChange={setShowResults}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {fetchedPageTitle || "Website"} Colors
            </DialogTitle>
            <DialogDescription>
              Found {extractedColors.length} unique colors
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex gap-2">
              <Button onClick={addAllColors} className="flex-1">
                Add All
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowResults(false)}
              >
                Close
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <AnimatePresence>
                {extractedColors.map(({ color, count }, index) => (
                  <motion.div
                    key={color}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    className="group cursor-pointer"
                    onClick={() => addColorToPalette(color)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="border border-border/50 rounded-md overflow-hidden bg-card/30 backdrop-blur-sm">
                      <div 
                        className="h-16 w-full border-b border-border/50"
                        style={{ backgroundColor: color }}
                      />
                      <div className="p-2">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs">
                            {color}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              copyColor(color);
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {count} use{count !== 1 ? "s" : ""}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

            <div className="flex gap-3 justify-end">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button variant="outline" onClick={() => setShowResults(false)} className="px-6 py-2 h-10 rounded-full border border-border/60 hover:border-border/80 hover:bg-accent/30 transition-all duration-200">
                  Close
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button onClick={addAllColors} className="px-6 py-2 h-10 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground border border-primary/20 shadow-sm hover:shadow-md transition-all duration-200">
                  Add All
                </Button>
              </motion.div>
            </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}