import { Fragment, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import TextField from "@/components/TextField"
import AutoComplete from "@/components/SelectField/SelectField"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import apiService from "@/lib/api"
import { Edit, Pen } from "lucide-react"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"

type User = {
    id: string
    email: string
    first_name: string
    last_name: string
    full_name: string
    user_type: string
    phone: string
    employee: {
        role?: string;
        department?: string;
        position?: string;
        hire_date?: string;
    } | null
    avatar?: string;

}

export interface ProfileFormData {
    first_name: string;
    last_name: string;
    full_name?: string;
    email: string;
    phone: string;
    user_type?: string;
    role?: string;
    department?: string;
    position?: string;
    hire_date?: string;
    avatar?: File | null;
}

const userTypeOptions = [
    { label: "Admin", id: "admin" },
    { label: "Employee", id: "employee" },
    { label: "Manager", id: "manager" },
];

type TRequest = {
    method: "post" | "put",
    url: string,
    data: FormData
}
const useUserMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ method, url, data }: TRequest) =>
            apiService[method](url, data),
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: ['me'] }),
    });
};


export function EditProfileDialog({
    open,
    onOpenChange,
    userData
}: {
    open: boolean
    onOpenChange: (open: boolean) => void
    userData: User | undefined
}) {
    const [formData, setFormData] = useState<ProfileFormData>({} as ProfileFormData);
    useEffect(() => {
        setFormData({
            first_name: userData?.first_name || "",
            phone: userData?.phone || "",
            last_name: userData?.last_name || "",
            email: userData?.email || "",
            role: userData?.employee?.role || "",
            department: userData?.employee?.department || "",
            position: userData?.employee?.position || "",
            hire_date: userData?.employee?.hire_date || "",
        })
        setPreview(userData?.avatar || null)
    }, [userData])

    const [preview, setPreview] = useState<string | null>(null);

    // Handle Input Changes
    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle Autocomplete
    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle image upload
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFormData((prev) => ({ ...prev, avatar: file }));

        const reader = new FileReader();
        reader.onload = (event) => setPreview(event.target?.result as string);
        reader.readAsDataURL(file);
    };
    const { mutate, isPending } = useUserMutation()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const fd = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                fd.append(key, value as any);
            }
        });
        mutate(
            {
                method: 'put',
                url: '/user/me/',
                data: fd,
            },
            { onSuccess: () => onOpenChange(false) }
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[480px] space-y-6">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                        Edit Profile
                    </DialogTitle>
                    <DialogDescription>
                        Update your personal information and profile photo.
                    </DialogDescription>
                </DialogHeader>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    {/* Avatar Upload */}
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-24 h-24  relative overflow-hidden flex items-center justify-center">
                            {preview ? (
                                <img
                                    alt=""
                                    src={preview}
                                    className="w-full h-full object-cover z-0 rounded-full"
                                />
                            ) : (
                                <span className="text-xs text-muted-foreground">
                                    No Image
                                </span>
                            )}
                            <label className="cursor-pointer absolute top-2 right-2 z-10">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Pen className="size-5" />
                                    </TooltipTrigger>

                                    <TooltipContent>
                                        <p>Change avatar</p>
                                    </TooltipContent>
                                </Tooltip>

                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageChange}
                                />
                            </label>
                        </div>
                    </div>
                    <TextField
                        label="Email"
                        name="email"
                        type="email"
                        disabled
                        value={formData.email}
                        onChange={handleInputChange}
                    />
                    <TextField
                        label="Phone"
                        name="phone"
                        type="phone"
                        disabled
                        value={formData.phone}
                        onChange={handleInputChange}
                    />

                    {/* Text Fields */}
                    <div className="grid grid-cols-1 [@media(min-width:400px)]:grid-cols-2  gap-4">
                        <TextField
                            label="First Name"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleInputChange}
                        />

                        <TextField
                            label="Last Name"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleInputChange}
                        />
                    </div>
                    {userData?.user_type === "admin" && (
                        // role","department","position","hire_date
                        <Fragment>
                            <div className="grid grid-cols-1  gap-4">
                                <TextField
                                    label="Position"
                                    name="position"
                                    value={formData?.position}
                                    onChange={handleInputChange}
                                />
                                <TextField
                                    label="Hire Date"
                                    name="hire_date"
                                    type="date"
                                    value={formData?.hire_date}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <TextField
                                label="Role"
                                disabled
                                name="role"
                                value={formData?.role}
                                onChange={handleInputChange}
                            />
                            <TextField
                                label="Department"
                                disabled
                                name="department"
                                value={formData?.department}
                                onChange={handleInputChange}
                            />
                        </Fragment>
                    )}


                    <DialogFooter className="mt-6">
                        <DialogClose asChild>
                            <Button variant="outline" type="button">
                                Cancel
                            </Button>
                        </DialogClose>

                        <Button type="submit">Save Changes</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
