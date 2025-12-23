import Image from "next/image"
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog"
import { VisuallyHidden } from "radix-ui";
type ImageViewerProps = {
    image: string | null
    onClose: () => void
}

const ImageViewer = ({ image, onClose }: ImageViewerProps) => {
    return (
        <Dialog open={!!image} onOpenChange={onClose}>
            <DialogContent

                aria-description="preview"
                aria-describedby="preview"
                className="
                    z-2000
                    bg-background/50
                    w-[80vh]
                    h-[80vh]
                    p-3
                    overflow-hidden
                    flex
                    flex-col
                "
            >
                <VisuallyHidden.Root>
                    <DialogTitle className="h-10 px-4 py-2 shrink-0">
                        Preview
                    </DialogTitle>

                </VisuallyHidden.Root>



                <div className="flex-1 relative">
                    {image && (
                        <img
                            src={image}
                            alt="preview"
                            className="
            absolute inset-0
            w-full h-full
            object-contain
          "
                        />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ImageViewer
