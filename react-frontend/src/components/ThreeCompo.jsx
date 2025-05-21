import React, { useState, useEffect, useRef, forwardRef, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF, Center } from "@react-three/drei";
import { X, ExternalLink, Download, ArrowLeft, ImageIcon, SlidersHorizontal, ArrowUp } from 'lucide-react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  Form,
  Label,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea
} from "@/components/ui";
import { cn } from "@/lib/utils";

// Form schema
const formSchema = z
  .object({
    images: z.array(z.instanceof(File)).optional(),
    prompt: z.string().optional(),
    condition_mode: z.enum(["concat", "fuse"]).default("concat"),
    quality: z.enum(["high", "medium", "low", "extra-low"]).default("medium"),
    geometry_file_format: z.enum(["glb", "usdz", "fbx", "obj", "stl"]).default("glb"),
    use_hyper: z.boolean().default(false),
    tier: z.enum(["Regular", "Sketch"]).default("Regular"),
    TAPose: z.boolean().default(false),
    material: z.enum(["PBR", "Shaded"]).default("PBR"),
  })
  .refine(
    (data) => {
      // Require at least one of images or prompt
      return (data.images && data.images.length > 0) || (data.prompt && data.prompt.length > 0);
    },
    {
      message: "You must provide either images or a prompt",
      path: ["prompt"],
    },
  );

// API Service functions
async function submitRodinJob(formData) {
  const response = await fetch("/api/rodin", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return await response.json();
}

async function checkJobStatus(subscriptionKey) {
  const response = await fetch(`/api/status`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      subscription_key: subscriptionKey,
    }),
  });

  if (!response.ok) {
    throw new Error(`Status check failed: ${response.status}`);
  }

  return await response.json();
}

async function downloadModel(taskUuid) {
  const response = await fetch(`/api/download`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      task_uuid: taskUuid,
    }),
  });

  if (!response.ok) {
    throw new Error(`Download failed: ${response.status}`);
  }

  return await response.json();
}

// Custom hooks
function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);

    // Update the state initially
    setMatches(media.matches);

    // Define a callback function to handle changes
    const listener = (e) => {
      setMatches(e.matches);
    };

    // Add the callback as a listener for changes to the media query
    media.addEventListener("change", listener);

    // Clean up
    return () => {
      media.removeEventListener("change", listener);
    };
  }, [query]);

  return matches;
}

// Components
const AutoResizeTextarea = forwardRef(({ className, ...props }, ref) => {
  const textareaRef = useRef(null);

  // Combine the forwarded ref with our local ref
  const setRefs = (element) => {
    textareaRef.current = element;
    if (typeof ref === "function") {
      ref(element);
    } else if (ref) {
      ref.current = element;
    }
  };

  const resizeTextarea = () => {
    if (textareaRef.current) {
      // Reset height to auto to get the correct scrollHeight
      textareaRef.current.style.height = "auto";
      // Set the height to the scrollHeight, but ensure it's at least the line height
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${scrollHeight}px`;
    }
  };

  // Resize on initial render
  useEffect(() => {
    if (textareaRef.current) {
      // Start with single line height
      const lineHeight = Number.parseInt(getComputedStyle(textareaRef.current).lineHeight);
      textareaRef.current.style.height = `${lineHeight}px`;

      // Then adjust if there's content
      if (textareaRef.current.value) {
        resizeTextarea();
      }
    }
  }, []);

  // Handle input changes
  const handleInput = (e) => {
    resizeTextarea();
    if (props.onChange) {
      props.onChange(e);
    }
  };

  return (
    <Textarea
      {...props}
      ref={setRefs}
      onChange={handleInput}
      className={cn(
        "overflow-hidden min-h-[40px] focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none border-0 shadow-none",
        className,
      )}
      rows={1}
    />
  );
});

AutoResizeTextarea.displayName = "AutoResizeTextarea";

function ProgressBar({ totalTasks, completedTasks, className, isIndeterminate = false }) {
  // Calculate percentage
  const percentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className={cn("w-full bg-black rounded-full h-2 overflow-hidden border border-white p-[1px]", className)}>
      {isIndeterminate ? (
        <div className="h-full relative w-full">
          <div className="h-full bg-white absolute w-[40%] animate-progress-indeterminate rounded-full" />
        </div>
      ) : (
        <div className="h-full bg-white transition-all duration-500 rounded-full" style={{ width: `${percentage}%` }} />
      )}
    </div>
  );
}

function StatusIndicator({ isLoading, jobStatuses }) {
  if (!isLoading) {
    return null;
  }

  // Add one additional task to the total count
  const actualTasks = jobStatuses.length;
  const totalTasks = actualTasks > 0 ? actualTasks + 1 : 0;

  // Count the first task (initial request) as completed when we have job statuses
  const completedJobTasks = jobStatuses.filter((job) => job.status === "Done").length;
  const initialRequestComplete = actualTasks > 0 ? 1 : 0;
  const completedTasks = completedJobTasks + initialRequestComplete;

  const showProgress = actualTasks > 0;
  const isIndeterminate = actualTasks === 0;

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
      <div className="w-64">
        <ProgressBar totalTasks={totalTasks} completedTasks={completedTasks} isIndeterminate={isIndeterminate} />
      </div>
    </div>
  );
}

function ImageUploadArea({ previewUrls, onRemoveImage, isLoading = false }) {
  if (previewUrls.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 px-4 pt-3 pointer-events-auto">
      {previewUrls.map((url, index) => (
        <div key={index} className="relative h-16 w-16">
          <img
            src={url || "/placeholder.svg"}
            alt={`Preview ${index + 1}`}
            className="h-full w-full object-cover rounded-full"
          />
          {!isLoading && (
            <button type="button" onClick={() => onRemoveImage(index)} className="absolute -top-1 -right-1">
              <X className="h-3 w-3 text-white" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

function FormComponent({ isLoading, onSubmit, onOpenOptions }) {
  const [previewUrls, setPreviewUrls] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  const fileInputRef = useRef(null);
  const dropAreaRef = useRef(null);
  const formRef = useRef(null);
  const dragCounter = useRef(0);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      images: [],
      condition_mode: "concat",
      quality: "medium",
      geometry_file_format: "glb",
      use_hyper: false,
      tier: "Regular",
      TAPose: false,
      material: "PBR",
    },
  });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    addImages(files);
  };

  const addImages = (files) => {
    if (files.length === 0) return;

    // Limit to 5 images total
    const currentImages = form.getValues("images") || [];
    const totalImages = currentImages.length + files.length;

    if (totalImages > 5) {
      setError("You can upload a maximum of 5 images");
      const allowedNewImages = 5 - currentImages.length;
      files = files.slice(0, allowedNewImages);

      if (files.length === 0) return;
    }

    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
    const updatedImages = [...currentImages, ...files];

    setPreviewUrls([...previewUrls, ...newPreviewUrls]);
    form.setValue("images", updatedImages);
  };

  const removeImage = (index) => {
    const currentImages = form.getValues("images") || [];
    const newImages = [...currentImages];
    newImages.splice(index, 1);

    const newPreviewUrls = [...previewUrls];
    URL.revokeObjectURL(newPreviewUrls[index]);
    newPreviewUrls.splice(index, 1);

    setPreviewUrls(newPreviewUrls);
    form.setValue("images", newImages);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Drag and drop handlers
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current = 0;
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files).filter((file) => file.type.startsWith("image/"));
      addImages(files);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleKeyDown = (e) => {
    // On desktop, Enter submits the form unless Shift is pressed
    // On mobile, Enter creates a new line
    if (e.key === "Enter") {
      if (!isMobile && !e.shiftKey) {
        e.preventDefault();
        formRef.current?.requestSubmit();
      }
    }
  };

  return (
    <Form {...form}>
      <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="relative">
        <div
          ref={dropAreaRef}
          className={cn(
            "relative bg-black/60 backdrop-blur-md rounded-[24px] overflow-hidden transition-all shadow-lg border border-[rgba(255,255,255,0.12)]",
            isDragging ? "ring-2 ring-white" : isFocused ? "ring-2 ring-white" : "",
            isLoading && "animate-pulse-loading pointer-events-none opacity-70",
          )}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {/* Image previews */}
          <ImageUploadArea previewUrls={previewUrls} onRemoveImage={removeImage} isLoading={isLoading} />

          <div className="px-2 py-1.5">
            <div className="flex items-center">
              <div className="flex space-x-0">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={triggerFileInput}
                  className="text-gray-400 hover:text-white hover:bg-transparent rounded-full h-10 w-10 ml-0"
                  disabled={isLoading}
                >
                  <ImageIcon className="h-5 w-5" />
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={onOpenOptions}
                  className="text-gray-400 hover:text-white hover:bg-transparent rounded-full h-10 w-10 ml-0"
                  disabled={isLoading}
                >
                  <SlidersHorizontal className="h-5 w-5" />
                </Button>
              </div>

              <AutoResizeTextarea
                placeholder="Generate 3D model..."
                className="flex-1 bg-transparent border-0 focus:ring-0 text-white placeholder:text-gray-400 py-2 px-3 resize-none text-base tracking-normal"
                {...form.register("prompt")}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
              />

              <div>
                <Button
                  type="submit"
                  className="bg-white hover:bg-gray-200 text-black rounded-full h-10 w-10 p-0 flex items-center justify-center"
                  disabled={isLoading}
                >
                  <ArrowUp className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          {isDragging && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center pointer-events-none z-10">
              <p className="text-white font-medium tracking-normal text-lg">Drop images here</p>
            </div>
          )}
        </div>

        {error && <div className="mt-2 text-red-400 text-sm tracking-normal">{error}</div>}
      </form>
    </Form>
  );
}

function OptionsDialog({ open, onOpenChange, options, onOptionsChange }) {
  const [localOptions, setLocalOptions] = useState(options);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Update local options when props change
  useEffect(() => {
    setLocalOptions(options);
  }, [options]);

  const handleChange = (key, value) => {
    setLocalOptions((prev) => {
      const updated = { ...prev, [key]: value };
      onOptionsChange(updated);
      return updated;
    });
  };

  const content = (
    <div className="py-2">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="basic" className="tracking-normal">
            Basic Settings
          </TabsTrigger>
          <TabsTrigger value="advanced" className="tracking-normal">
            Advanced
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white font-mono tracking-normal">Quality</Label>
              <Select value={localOptions.quality} onValueChange={(value) => handleChange("quality", value)}>
                <SelectTrigger className="bg-black border-[rgba(255,255,255,0.12)] text-white tracking-normal">
                  <SelectValue placeholder="Select quality" />
                </SelectTrigger>
                <SelectContent className="bg-black border-[rgba(255,255,255,0.12)] text-white">
                  <SelectItem value="high" className="tracking-normal hover:bg-[#111111] focus:bg-[#111111]">
                    High (50k)
                  </SelectItem>
                  <SelectItem value="medium" className="tracking-normal hover:bg-[#111111] focus:bg-[#111111]">
                    Medium (18k)
                  </SelectItem>
                  <SelectItem value="low" className="tracking-normal hover:bg-[#111111] focus:bg-[#111111]">
                    Low (8k)
                  </SelectItem>
                  <SelectItem value="extra-low" className="tracking-normal hover:bg-[#111111] focus:bg-[#111111]">
                    Extra Low (4k)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-white font-mono tracking-normal">Format</Label>
              <Select
                value={localOptions.geometry_file_format}
                onValueChange={(value) => handleChange("geometry_file_format", value)}
              >
                <SelectTrigger className="bg-black border-[rgba(255,255,255,0.12)] text-white tracking-normal">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent className="bg-black border-[rgba(255,255,255,0.12)] text-white">
                  <SelectItem value="glb" className="tracking-normal hover:bg-[#111111] focus:bg-[#111111]">
                    GLB
                  </SelectItem>
                  <SelectItem value="usdz" className="tracking-normal hover:bg-[#111111] focus:bg-[#111111]">
                    USDZ
                  </SelectItem>
                  <SelectItem value="fbx" className="tracking-normal hover:bg-[#111111] focus:bg-[#111111]">
                    FBX
                  </SelectItem>
                  <SelectItem value="obj" className="tracking-normal hover:bg-[#111111] focus:bg-[#111111]">
                    OBJ
                  </SelectItem>
                  <SelectItem value="stl" className="tracking-normal hover:bg-[#111111] focus:bg-[#111111]">
                    STL
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm border-[rgba(255,255,255,0.12)] bg-black/50">
              <div>
                <Label className="text-white font-mono tracking-normal">Use Hyper</Label>
                <p className="text-gray-400 text-xs tracking-normal">Better details</p>
              </div>
              <Switch
                checked={localOptions.use_hyper}
                onCheckedChange={(checked) => handleChange("use_hyper", checked)}
              />
            </div>

            <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm border-[rgba(255,255,255,0.12)] bg-black/50">
              <div>
                <Label className="text-white font-mono tracking-normal">T/A Pose</Label>
                <p className="text-gray-400 text-xs tracking-normal">For humans</p>
              </div>
              <Switch checked={localOptions.TAPose} onCheckedChange={(checked) => handleChange("TAPose", checked)} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <div className="space-y-2">
            <Label className="text-white font-mono tracking-normal">Condition Mode</Label>
            <RadioGroup
              value={localOptions.condition_mode}
              onValueChange={(value) => handleChange("condition_mode", value)}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="concat" id="concat" className="border-white text-white" />
                <Label htmlFor="concat" className="text-white tracking-normal">
                  Concat (Single object, multiple views)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fuse" id="fuse" className="border-white text-white" />
                <Label htmlFor="fuse" className="text-white tracking-normal">
                  Fuse (Multiple objects)
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label className="text-white font-mono tracking-normal">Material</Label>
            <RadioGroup
              value={localOptions.material}
              onValueChange={(value) => handleChange("material", value)}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="PBR" id="pbr" className="border-white text-white" />
                <Label htmlFor="pbr" className="text-white tracking-normal">
                  PBR
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Shaded" id="shaded" className="border-white text-white" />
                <Label htmlFor="shaded" className="text-white tracking-normal">
                  Shaded
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label className="text-white font-mono tracking-normal">Generation Tier</Label>
            <RadioGroup
              value={localOptions.tier}
              onValueChange={(value) => handleChange("tier", value)}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Regular" id="regular" className="border-white text-white" />
                <Label htmlFor="regular" className="text-white tracking-normal">
                  Regular (Quality)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Sketch" id="sketch" className="border-white text-white" />
                <Label htmlFor="sketch" className="text-white tracking-normal">
                  Sketch (Speed)
                </Label>
              </div>
            </RadioGroup>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-black border-[rgba(255,255,255,0.12)] text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl text-white font-mono tracking-normal">Options</DialogTitle>
          </DialogHeader>
          {content}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="bg-black border-t border-[rgba(255,255,255,0.12)] text-white">
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader>
            <DrawerTitle className="text-xl text-white font-mono tracking-normal">Options</DrawerTitle>
          </DrawerHeader>
          <div className="px-4">{content}</div>
          <DrawerFooter>
            <Button
              onClick={() => onOpenChange(false)}
              className="bg-gray-800 hover:bg-gray-700 text-white tracking-normal"
            >
              Apply Settings
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function LoadingSpinner() {
  const groupRef = useRef(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.5;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <torusGeometry args={[1, 0.1, 16, 32]} />
        <meshStandardMaterial color="#ffffff" wireframe={true} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1, 0.1, 16, 32]} />
        <meshStandardMaterial color="#ffffff" wireframe={true} />
      </mesh>
    </group>
  );
}

function LoadingPlaceholder() {
  return (
    <>
      <mesh>
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <meshStandardMaterial color="#cccccc" wireframe={true} transparent opacity={0.5} />
      </mesh>

      <mesh>
        <sphereGeometry args={[0.75, 32, 32]} />
        <meshStandardMaterial color="#aaaaaa" wireframe={true} transparent opacity={0.5} />
      </mesh>
    </>
  );
}

function SceneSetup() {
  const { scene } = useThree();

  useEffect(() => {
    // Set background to transparent to show the CSS background
    scene.background = null;
  }, [scene]);

  return null;
}

function ModelComponent({ url }) {
  const [isLoading, setIsLoading] = useState(true);
  const { scene } = useGLTF(url, undefined, undefined, (error) => {
    //console.error("Error loading model:", error)
  });
  const { camera } = useThree();

  useEffect(() => {
    // Reset camera position when model changes - position higher to account for prompt container
    camera.position.set(0, 0, 5);

    // Set loading to false when scene is loaded
    if (scene) {
      setIsLoading(false);
    }

    return () => {
      setIsLoading(true);
    };
  }, [url, camera, scene]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Center>
      <primitive object={scene} scale={1.5} />
    </Center>
  );
}

function ModelViewer({ modelUrl }) {
  return (
    <div className="w-full h-[100dvh] bg-black bg-radial-gradient">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <SceneSetup />
        <ambientLight intensity={0.3} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} castShadow intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />

        <Suspense fallback={<LoadingPlaceholder />}>
          {modelUrl ? <ModelComponent url={modelUrl} /> : <LoadingPlaceholder />}
        </Suspense>

        <OrbitControls
          minDistance={3}
          maxDistance={10}
          enableZoom={true}
          enablePan={false}
          autoRotate={true}
          autoRotateSpeed={1}
        />
        <Environment preset="night" />
      </Canvas>
    </div>
  );
}

// Main component
export default function Rodin3DGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [isPolling, setIsPolling] = useState(false);
  const [modelUrl, setModelUrl] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [jobStatuses, setJobStatuses] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const [showPromptContainer, setShowPromptContainer] = useState(true);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [options, setOptions] = useState({
    condition_mode: "concat",
    quality: "medium",
    geometry_file_format: "glb",
    use_hyper: false,
    tier: "Regular",
    TAPose: false,
    material: "PBR",
  });

  // Prevent body scroll on mobile
  useEffect(() => {
    if (isMobile) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
      };
    }
  }, [isMobile]);

  const handleOptionsChange = (newOptions) => {
    setOptions(newOptions);
  };

  async function handleStatusCheck(subscriptionKey, taskUuid) {
    try {
      setIsPolling(true);

      const data = await checkJobStatus(subscriptionKey);
      console.log("Status response:", data);

      // Check if jobs array exists
      if (!data.jobs || !Array.isArray(data.jobs) || data.jobs.length === 0) {
        throw new Error("No jobs found in status response");
      }

      // Update job statuses
      setJobStatuses(data.jobs);

      // Check status of all jobs
      const allJobsDone = data.jobs.every((job) => job.status === "Done");
      const anyJobFailed = data.jobs.some((job) => job.status === "Failed");

      if (allJobsDone) {
        setIsPolling(false);

        // Get the download URL using the task UUID
        try {
          const downloadData = await downloadModel(taskUuid);
          console.log("Download response:", downloadData);

          // Check if there's an error in the download response
          if (downloadData.error && downloadData.error !== "OK") {
            throw new Error(`Download error: ${downloadData.error}`);
          }

          // Find the first GLB file to display in the 3D viewer
          if (downloadData.list && downloadData.list.length > 0) {
            const glbFile = downloadData.list.find((file) => file.name.toLowerCase().endsWith(".glb"));

            if (glbFile) {
              const proxyUrl = `/api/proxy-download?url=${encodeURIComponent(glbFile.url)}`;
              setModelUrl(proxyUrl);
              setDownloadUrl(glbFile.url);
              setIsLoading(false);
              setShowPromptContainer(false);
            } else {
              setError("No GLB file found in the results");
              setIsLoading(false);
            }
          } else {
            setError("No files available for download");
            setIsLoading(false);
          }
        } catch (downloadErr) {
          setError(`Failed to download model: ${downloadErr instanceof Error ? downloadErr.message : "Unknown error"}`);
          setIsLoading(false);
        }
      } else if (anyJobFailed) {
        setIsPolling(false);
        setError("Generation task failed");
        setIsLoading(false);
      } else {
        // Still processing, poll again after a delay
        setTimeout(() => handleStatusCheck(subscriptionKey, taskUuid), 3000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to check status");
      setIsPolling(false);
      setIsLoading(false);
    }
  }

  async function handleSubmit(values) {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setModelUrl(null);
    setDownloadUrl(null);
    setJobStatuses([]);

    try {
      const formData = new FormData();

      if (values.images && values.images.length > 0) {
        values.images.forEach((image) => {
          formData.append("images", image);
        });
      }

      if (values.prompt) {
        formData.append("prompt", values.prompt);
      }

      // Add all the advanced options
      formData.append("condition_mode", options.condition_mode);
      formData.append("geometry_file_format", options.geometry_file_format);
      formData.append("material", options.material);
      formData.append("quality", options.quality);
      formData.append("use_hyper", options.use_hyper.toString());
      formData.append("tier", options.tier);
      formData.append("TAPose", options.TAPose.toString());
      formData.append("mesh_mode", "Quad");
      formData.append("mesh_simplify", "true");
      formData.append("mesh_smooth", "true");

      // Make the API call through our server route
      const data = await submitRodinJob(formData);
      console.log("Generation response:", data);

      setResult(data);

      // Start polling for status
      if (data.jobs && data.jobs.subscription_key && data.uuid) {
        handleStatusCheck(data.jobs.subscription_key, data.uuid);
      } else {
        setError("Missing required data for status checking");
        setIsLoading(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      setIsLoading(false);
    }
  }

  const handleDownload = () => {
    if (downloadUrl) {
      window.open(downloadUrl, "_blank");
    }
  };

  const handleBack = () => {
    setShowPromptContainer(true);
  };

  const ExternalLinks = () => (
    <div className="flex items-center space-x-6">
      <a
        href="https://hyper3d.ai"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center text-white hover:text-gray-300 transition-colors tracking-normal"
      >
        <span className="mr-1">Website</span>
        <ExternalLink className="h-4 w-4" />
      </a>
      <a
        href="https://developer.hyper3d.ai"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center text-white hover:text-gray-300 transition-colors tracking-normal"
      >
        <span className="mr-1">API Docs</span>
        <ExternalLink className="h-4 w-4" />
      </a>
    </div>
  );

  return (
    <div className="relative h-[100dvh] w-full">
      {/* Full-screen canvas */}
      <div className="absolute inset-0 z-0">
        <ModelViewer modelUrl={isLoading ? null : modelUrl} />
      </div>

      {/* Overlay UI */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* Logo in top left */}
        <div className="absolute top-6 left-6 pointer-events-auto">
          <h1 className="text-3xl text-white font-normal tracking-normal">3D Model Generator</h1>
          <p className="text-gray-400 text-sm mt-1 tracking-normal">Powered by Hyper3D Rodin</p>
        </div>

        {/* Links in top right - desktop only */}
        {!isMobile && (
          <div className="absolute top-6 right-6 pointer-events-auto">
            <ExternalLinks />
          </div>
        )}

        {/* Loading indicator */}
        <StatusIndicator isLoading={isLoading} jobStatuses={jobStatuses} />

        {/* Error message */}
        {error && (
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-gray-900/80 text-white px-4 py-2 rounded-md tracking-normal">
            {error}
          </div>
        )}

        {/* Model controls when model is loaded */}
        {!isLoading && modelUrl && !showPromptContainer && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4 pointer-events-auto">
            <Button
              onClick={handleBack}
              className="bg-black hover:bg-gray-900 text-white border border-white/20 rounded-full px-4 py-2 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="tracking-normal">Back</span>
            </Button>

            <Button
              onClick={handleDownload}
              className="bg-white hover:bg-gray-200 text-black rounded-full px-4 py-2 flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              <span className="tracking-normal">Download</span>
            </Button>
          </div>
        )}

        {/* Input field at bottom */}
        {showPromptContainer && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-3xl px-4 sm:px-0 pointer-events-auto">
            <FormComponent isLoading={isLoading} onSubmit={handleSubmit} onOpenOptions={() => setShowOptions(true)} />

            {/* Links below prompt on mobile */}
            {isMobile && (
              <div className="mt-4 flex justify-center pointer-events-auto">
                <ExternalLinks />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Options Dialog/Drawer */}
      <OptionsDialog
        open={showOptions}
        onOpenChange={setShowOptions}
        options={options}
        onOptionsChange={handleOptionsChange}
      />
    </div>
  );
}