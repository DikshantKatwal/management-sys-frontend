import GuestCreateView from "./GuestCreateView";

export default async function Room() {
    return (

        <div className="flex flex-col min-w-0 gap-2">

            <GuestCreateView />
        </div>
    );
}
